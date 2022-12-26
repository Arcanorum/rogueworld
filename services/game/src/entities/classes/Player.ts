import { Settings } from '@rogueworld/configs';
import { ObjectOfUnknown, Offset } from '@rogueworld/types';
import { warning } from '@rogueworld/utils';
import { CraftingRecipesList } from '../../crafting';
import Damage from '../../gameplay/Damage';
import DamageTypes from '../../gameplay/DamageTypes';
import { rowColOffsetToDirection } from '../../gameplay/Directions';
import Heal from '../../gameplay/Heal';
import { Inventory, ItemState } from '../../inventory';
import Ammunition from '../../items/classes/ammunition/Ammunition';
import Clothes from '../../items/classes/clothes/Clothes';
import Holdable from '../../items/classes/holdable/Holdable';
import { Board } from '../../space';
import { boardsObject } from '../../space/BoardsList';
import PlayerWebSocket from '../../websocket_events/PlayerWebSocket';
import Entity, { EntityConfig } from './Entity';
import WorldTree from './WorldTree';

interface PlayerConfig extends EntityConfig {
    socket: PlayerWebSocket;
    displayName: string;
}

class Player extends Entity {
    inventory: Inventory;

    socket?: PlayerWebSocket;

    displayName = '';

    glory = 0;

    defence = 0;

    maxHitPoints = Settings.PLAYER_MAX_HITPOINTS || 200;

    hitPoints = this.maxHitPoints;

    maxFood: number = Settings.PLAYER_STARTING_MAX_FOOD || 1000;

    food = this.maxFood;

    foodDrainRate: number = Settings.PLAYER_FOOD_DRAIN_RATE || 0;

    foodDrainAmount: number = Settings.PLAYER_FOOD_DRAIN_AMOUNT || 0;

    foodDrainLoop = setTimeout(() => { /**/ });

    moveRate = Settings.PLAYER_MOVE_RATE || 1000;

    nextMoveTime = 0;

    isMovePending = false;

    pendingMove = setTimeout(() => { /**/ });

    /** The time when this player was last damaged. */
    lastDamagedTime = 0;

    /** How many times this player has moved in the same direction continuously. */
    momentum = 0;

    /**
     * What this player is wearing. Such as armour, robes, cloak, disguise, apron.
     * A reference to an item in their inventory.
     */
    clothing?: Clothes;

    /**
     * What this player is holding. Mostly weapons.
     * A reference to an item in their inventory.
     */
    holding?: Holdable;

    /**
     * What this player is using as ammunition. Mostly arrows.
     * A reference to an item in their inventory.
     */
    ammunition?: Ammunition;

    autoSaveTimeout: NodeJS.Timeout;

    constructor(config: PlayerConfig) {
        super(config);

        config.socket.entity = this;
        this.socket = config.socket;

        config.board.addPlayer(this);

        this.inventory = new Inventory(this);

        this.displayName = config.displayName;

        this.startFoodDrainLoop();

        this.autoSaveTimeout = setTimeout(
            this.saveAccount.bind(this),
            5000,
        );
    }

    onDestroy() {
        this.inventory.dropAllItems();

        clearTimeout(this.foodDrainLoop);

        this.board?.removePlayer(this);

        super.onDestroy();
    }

    /**
     * Special function for players, so the inventory isn't dropped when they close the game,
     * otherwise the inventory would be saved and also dropped so would duplicate items.
     * Called in World.removePlayer when the client is closed (by user or timeout, etc.).
     */
    remove() {
        this.socket = undefined;

        // If player was in combat and closed client to cheat death
        // items should be removed from inventory.
        if (this.isInCombat()) {
            this.inventory.dropAllItems();
        }

        clearTimeout(this.autoSaveTimeout);
        clearTimeout(this.foodDrainLoop);
        // clearTimeout(this.hitpointRegenLoop);
        if (this.actionTimeout) clearTimeout(this.actionTimeout);

        // They might be dead when they disconnect, and so will already be removed from the board.
        // Check they are on the board/alive first.
        if (this.board) {
            this.board.removePlayer(this);

            // Call Destroyable.onDestroy directly, without going through the whole
            // onDestroy chain, so skips Player.onDestroy (no duplicate dropped items).
            super.onDestroy();
        }
    }

    getEmittableProperties(properties: ObjectOfUnknown) {
        properties.displayName = this.displayName;
        return super.getEmittableProperties(properties);
    }

    saveAccount() {
        if (!this.socket) return;

        if (!this.socket.account) return;

        try {
            this.socket.account.save();
        }
        catch (error) {
            warning(error);
        }

        this.autoSaveTimeout = setTimeout(
            this.saveAccount.bind(this),
            Settings.ACCOUNT_AUTO_SAVE_RATE || 15000,
        );
    }

    /**
     * Returns true if player was damaged in last x seconds.
     */
    isInCombat() {
        if (this.lastDamagedTime === 0) {
            return false;
        }
        return Date.now() - this.lastDamagedTime < (Settings.IN_COMBAT_STATUS_DURATION || 5000);
    }

    respawn() {
        this.hitPoints = this.maxHitPoints;
        this.food = this.maxFood;
        // Players are a special case that can be undestroyed.
        this.destroyed = false;
        // Clear timestamp used for in combat status.
        this.lastDamagedTime = 0;

        this.startFoodDrainLoop();

        // Reposition them to somewhere around the world tree.
        const randomPosition = boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME]
            .worldTree?.getRandomPositionInRange(
                WorldTree.rangeOfInfluence,
                false,
            );

        this.changeBoard(
            this.board,
            boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME],
            randomPosition?.row || 0,
            randomPosition?.col || 0,
        );

        this.socket?.sendEvent('player_respawn');
    }

    startFoodDrainLoop() {
        // Start the food drain loop.
        if (this.foodDrainRate > 0) {
            this.foodDrainLoop = setTimeout(this.drainFood.bind(this), this.foodDrainRate);
        }
    }

    drainFood() {
        if (this.food > 0) {
            this.modFood(-this.foodDrainAmount);
        }
        else {
            this.damage({
                amount: 20,
                types: [DamageTypes.Biological],
                penetration: 100,
            });
        }

        // Might have died above. Check they are still alive before restarting the loop.
        if (this.hitPoints > 0) {
            this.foodDrainLoop = setTimeout(this.drainFood.bind(this), this.foodDrainRate);
        }
    }

    reposition(toRow: number, toCol: number) {
        this.board?.removePlayer(this);
        super.reposition(toRow, toCol);
        this.board?.addPlayer(this);
    }

    getMoveRate() {
        let { moveRate } = this;

        if (this.lastDamagedTime + Settings.PLAYER_COMBAT_SLOWDOWN_DURATION > Date.now()) {
            moveRate *= Settings.PLAYER_COMBAT_SLOWDOWN_MOVE_RATE_MODIFIER;
        }

        // Check the time since the last move, otherwise they will be able to continue with their
        // momentum. Momentum should be lost after standing still.
        if (Date.now() > this.nextMoveTime + 500) {
            this.momentum = 0;
        }

        if (this.momentum) {
            if (this.momentum > Settings.PLAYER_MAX_MOMENTUM) {
                this.momentum = Settings.PLAYER_MAX_MOMENTUM;
            }

            const momentumModifier = (
                1 - (
                    Settings.PLAYER_MAX_MOMENTUM_MODIFIER
                    * (this.momentum / Settings.PLAYER_MAX_MOMENTUM)
                )
            );

            moveRate *= momentumModifier;
        }

        return super.getMoveRate(moveRate);
    }

    move(byRows: Offset, byCols: Offset, force = false) {
        // Check if this player can move yet.
        if (!force && Date.now() < this.nextMoveTime) {
            // Can't move yet. Make this move command be pending, so it happens as soon as it can.

            clearTimeout(this.pendingMove);

            this.pendingMove = setTimeout(
                this.move.bind(this),
                this.nextMoveTime - Date.now(),
                byRows,
                byCols,
            );

            return false;
        }

        this.nextMoveTime = Date.now() + this.getMoveRate();

        // Check if the entity can move.
        if (super.move(byRows, byCols) === true) {
            // Don't move if dead.
            if (this.hitPoints < 1) {
                return false;
            }

            const dynamicsAtViewRangeData = this.board?.getDynamicsAtViewRangeData(
                this.row,
                this.col,
                rowColOffsetToDirection(byRows, byCols),
            );

            // Don't bother sending the event if no dynamics were found.
            if (dynamicsAtViewRangeData !== false) {
            // Tell the player any dynamics that they can now see in the direction they moved.
                this.socket?.sendEvent(
                    'add_entities',
                    dynamicsAtViewRangeData,
                );
            }

            this.momentum += 1;
        }

        return true;
    }

    changeBoard(fromBoard: Board | undefined, toBoard: Board, toRow: number, toCol: number) {
        // Need to check if there is a board, as the board will be nulled if the player dies, but
        // they can be revived.
        if (fromBoard) {
            fromBoard.removePlayer(this);
        }

        super.changeBoard(fromBoard, toBoard, toRow, toCol);

        if (this.board) {
            this.board.addPlayer(this);

            // Tell the client to load the new board map.
            this.socket?.sendEvent('change_board', {
                boardName: this.board.name,
                boardAlwaysNight: this.board.alwaysNight,
                playerRow: this.row,
                playerCol: this.col,
                dynamicsData: this.board.getNearbyDynamicsData(this.row, this.col),
            });
        }
    }

    setDisplayName(displayName: string) {
        this.displayName = displayName;

        // Tell every other nearby player the new name.
        this.board?.emitToNearbyPlayers(
            this.row,
            this.col,
            'change_display_name',
            {
                id: this.id,
                displayName,
            },
        );

        // If they already have an account, save the new display name.
        if (this.socket?.account) {
            this.socket.account.displayName = displayName;
        }
    }

    modGlory(amount: number) {
        this.glory += amount;
        this.glory = Math.floor(this.glory);

        if (this.glory < 0) {
            this.glory = 0;
        }

        // Tell the player their new glory amount.
        this.socket?.sendEvent('glory_value', this.glory);

        // If this player has an account, save the new glory amount.
        if (this.socket?.account) {
            this.socket.account.glory = this.glory;
        }
    }

    modHitPoints(hitPointModifier: Damage | Heal, source: Entity) {
        // If damaged by another player in a safe zone, ignore the damage.
        if (source instanceof Player) {
            if (this.board?.grid[this.row][this.col].safeZone === true) {
                return;
            }
        }
        super.modHitPoints(hitPointModifier);
        // Tell the player their new HP amount.
        this.socket?.sendEvent('hit_point_value', this.hitPoints);
    }

    modFood(amount: number) {
        this.food += amount;
        this.food = Math.floor(this.food);

        // Make sure they can't go above max or below minimum food.
        if (this.food > this.maxFood) {
            this.food = this.maxFood;
        }
        else if (this.food < 0) {
            this.food = 0;
        }

        // Tell the player their new food amount.
        this.socket?.sendEvent('food_value', this.food);
    }

    modDefence(amount: number) {
        super.modDefence(amount);
        // Tell the player their new defence amount.
        this.socket?.sendEvent('defence_value', this.defence);
    }

    /**
     * Swap to a different clothing item, or unequip the currently worn clothing.
     */
    modClothing(clothing?: Clothes) {
        if (clothing) {
            // Tell the player to show the equip icon on the inventory slot of the item that was
            // equipped.
            this.socket?.sendEvent('activate_clothing', clothing.slotIndex);

            // Object.entries(clothing.statBonuses).forEach(([statKey, statBonus]) => {
            //     this.stats[statKey].levelModifier += statBonus;
            // });

            this.clothing = clothing;
        }
        else {
            // Tell the player to hide the equip icon on the inventory slot of the item that was
            // removed.
            this.socket?.sendEvent('deactivate_clothing');

            // Object.entries(this.clothing.statBonuses).forEach(([statKey, statBonus]) => {
            //     this.stats[statKey].levelModifier -= statBonus;
            // });

            this.clothing = undefined;
        }
    }

    modHolding(holding?: Holdable) {
        if (holding) {
            // Tell the player to show the equip icon on the inventory slot of the item that was
            // equipped.
            this.socket?.sendEvent('activate_holding', holding.slotIndex);

            this.holding = holding;
        }
        else {
            // Tell the player to hide the equip icon on the inventory slot of the item that was
            // removed.
            this.socket?.sendEvent('deactivate_holding');

            this.holding = undefined;
        }
    }

    modAmmunition(ammunition?: Ammunition) {
        if (ammunition) {
            // Tell the player to show the ammunition icon on the inventory slot of the item that
            // was equipped.
            this.socket?.sendEvent('activate_ammunition', ammunition.slotIndex);

            this.ammunition = ammunition;
        }
        else {
            // Tell the player to hide the ammunition icon on the inventory slot of the item that
            // was removed.
            this.socket?.sendEvent('deactivate_ammunition');

            this.ammunition = undefined;
        }
    }

    pickUpItem() {
        // Get the tile the character is standing on.
        const boardTile = this.getBoardTile();

        if (!boardTile) return;

        // Get the first entity in the pickups list.
        const pickup = Object.values(boardTile.pickups)[0];

        // Check it has a pickup item on it.
        if (pickup) {
            const { itemState } = pickup;

            // Check there is enough space to fit this item.
            if (!this.inventory.canItemBeAdded(itemState)) return;

            try {
                this.inventory.addItem(itemState);
            }
            catch (error) {
                warning('Cannot add item to player inventory. Error:', error);
            }

            // If it is a pickup of a stackable, then there might still be some in the stack that
            // they couldn't fit in their inventory, so check there is anything left before
            // destroying.
            if (pickup.itemState.quantity < 1) {
                pickup.destroy();
            }
        }
        // Nothing there, so try digging up whatever the ground is made up of.
        else {
            const ItemType = boardTile.groundType.gatherItemType;
            if (ItemType) {
                this.performAction(
                    { name: 'dig', duration: 1000 },
                    undefined,
                    undefined,
                    undefined,
                    () => {
                        this.inventory.addItem(
                            new ItemState({ ItemType }),
                        );
                    },
                );
            }
        }
    }

    craft(recipeIndex: number) {
        if (Number.isFinite(recipeIndex) === false) return;

        const recipe = CraftingRecipesList[recipeIndex];

        if (!recipe) return;

        // TODO: figure out what to do about moving stations :S
        // Check the player is stood next to any of the valid types of crafting station for this
        // recipe.
        // const nextToStation = recipe.stationClasses.some((stationType) => (
        //     this.isAdjacentToStaticType(stationType.prototype.typeNumber)));

        // if (!nextToStation) return;

        // Check the player has all of the required ingredients.
        const { items } = this.inventory;
        const hasEveryIngredient = recipe.ingredients.every((ingredient) => (
            items.some((item) => (
                item.itemState.ItemType === ingredient.ItemType
                && item.itemState.quantity >= ingredient.quantity
            ))
        ));

        if (!hasEveryIngredient) return;

        // Calculate the amount of bonus quantity for the result item.
        let averageCraftingLevel = 0;

        // recipe.statNames.forEach((statName) => {
        //     averageCraftingLevel += this.stats[statName].level;
        // });
        averageCraftingLevel += 1;// TODO: remove, used for testing

        // Divide by the number of stats used, rounded down.
        // averageCraftingLevel = Math.floor(averageCraftingLevel /= recipe.statNames.length);

        const craftingStatBonusMultiplier = Settings.CRAFTING_STAT_BONUS_MULTIPLIER || 1;

        const percentCraftingBonus = averageCraftingLevel * craftingStatBonusMultiplier * 0.01;

        let resultQuantity = recipe.result.baseQuantity;

        if (recipe.result.baseQuantity) {
            resultQuantity = (
                recipe.result.baseQuantity // The minimum amount.
                + (recipe.result.baseQuantity * percentCraftingBonus) // The bonus amount.
            );
        }

        // Remove the items from the crafter that were used in the recipe.
        recipe.ingredients.forEach((ingredient) => {
            this.inventory.removeQuantityByItemType(ingredient.quantity, ingredient.ItemType);
        });

        const itemState = new ItemState({
            ItemType: recipe.result.ItemType,
            quantity: resultQuantity,
        });

        this.inventory.addItem(itemState);

        // Check there is any of the item left.
        // Due to stat levels being able to increase the quantity of an item (and therefore it's
        // total weight), not all of it might have been able to fit into the inventory, so some
        // might be left over. Add anything remaining to the ground.
        if (itemState.quantity > 0) {
            if (itemState.ItemType.PickupType && this.board) {
                new itemState.ItemType.PickupType(
                    {
                        row: this.row,
                        col: this.col,
                        board: this.board,
                        itemState,
                    },
                ).emitToNearbyPlayers();
            }
        }

        // Divide the exp among all the stats that this recipe gives exp to.
        // const sharedExp = recipe.expGiven / recipe.statNames.length;
        // recipe.statNames.forEach((statName) => {
        //     this.stats[statName].gainExp(sharedExp);
        // });

        // Don't give the full exp amount as glory, it is a bit too much.
        // this.modGlory(recipe.expGiven * 0.5);

        recipe.result.ItemType.craftTaskIds.forEach((taskTypeId) => {
            // this.tasks.progressTask(taskTypeId);
        });
    }
}

export default Player;
