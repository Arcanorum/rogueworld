import { Settings } from '@dungeonz/configs';
import { Offset } from '@dungeonz/types';
import { warning } from '@dungeonz/utils';
import DamageTypes from '../../gameplay/DamageTypes';
import { rowColOffsetToDirection } from '../../gameplay/Directions';
import { Inventory } from '../../inventory';
import Ammunition from '../../items/classes/ammunition/Ammunition';
import Clothes from '../../items/classes/clothes/Clothes';
import Holdable from '../../items/classes/holdable/Holdable';
import PlayerWebSocket from '../../websocket_events/PlayerWebSocket';
import Character from './Character';
import { EntityConfig } from './Entity';

interface PlayerConfig extends EntityConfig {
    socket: PlayerWebSocket;
    displayName: string;
}

class Player extends Character {
    inventory: Inventory;

    socket: PlayerWebSocket;

    displayName = '';

    glory = 0;

    maxFood: number = Settings.PLAYER_STARTING_MAX_FOOD || 1000;

    food = this.maxFood;

    foodDrainRate: number = Settings.PLAYER_FOOD_DRAIN_RATE || 1000;

    foodDrainAmount: number = Settings.PLAYER_FOOD_DRAIN_AMOUNT || 10;

    foodDrainLoop = setTimeout(() => { /**/ });

    nextMoveTime = 0;
    isMovePending = false;
    pendingMove = setTimeout(() => { /**/ });

    /** The time the player most recently performed an action. */
    lastActionTime = 0;

    /** The time after which this player can perform another action. */
    nextActionTime = 0;

    /** The time when this player was last damaged. */
    lastDamagedTime = 0;

    /** How many times this player has moved in the same direction continuously. */
    momentum = 0;

    /**
     * What this player is wearing. Such as armour, robes, cloak, disguise, apron.
     * A reference to an item in their inventory.
     */
    clothing: Clothes|null = null;

    /**
     * What this player is holding. Mostly weapons.
     * A reference to an item in their inventory.
     */
    holding: Holdable|null = null;

    /**
     * What this player is using as ammunition. Mostly arrows.
     * A reference to an item in their inventory.
     */
    ammunition: Ammunition|null = null;

    autoSaveTimeout: NodeJS.Timeout;

    constructor(config: PlayerConfig) {
        super(config);

        config.socket.entity = this;
        this.socket = config.socket;

        config.board.addPlayer(this);

        this.inventory = new Inventory(this);

        this.displayName = config.displayName;

        // Start the food drain loop.
        // if (this.foodDrainRate > 0) {
        //     this.foodDrainLoop = setTimeout(this.drainFood.bind(this), this.foodDrainRate);
        // }

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
        // If player was in combat and closed client to cheat death
        // items should be removed from inventory.
        if (this.isInCombat()) {
            this.inventory.dropAllItems();
        }

        clearTimeout(this.autoSaveTimeout);
        // clearTimeout(this.gatherTimeout);
        // clearTimeout(this.hitpointRegenLoop);
        clearTimeout(this.foodDrainLoop);

        // They might be dead when they disconnect, and so will already be removed from the board.
        // Check they are on the board/alive first.
        if (this.board) {
            this.board.removePlayer(this);

            // Call Destroyable.onDestroy directly, without going through the whole
            // onDestroy chain, so skips Player.onDestroy (no duplicate dropped items).
            super.onDestroy();
        }
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

    drainFood() {
        if (this.food > 0) {
            this.modFood(-this.foodDrainAmount);
        }
        else {
            // this.damage(new Damage({
            //     amount: 20,
            //     types: [ DamageTypes.Biological ],
            //     armourPiercing: 100,
            // }));
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

        // Check the time since the last move, otherwise they will be able to continue with their momentum. Momentum should be lost after standing still.
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

        // Check if the entity can move as a character.
        if (super.move(byRows, byCols) === true) {
            // Don't move if dead.
            if (this.hitPoints < 1) return false;

            const dynamicsAtViewRangeData = this.board?.getDynamicsAtViewRangeData(
                this.row,
                this.col,
                rowColOffsetToDirection(byRows, byCols),
            );

            // Don't bother sending the event if no dynamics were found.
            if (dynamicsAtViewRangeData !== false) {
            // Tell the player any dynamics that they can now see in the direction they moved.
                this.socket.sendEvent(
                    'add_entities',
                    dynamicsAtViewRangeData,
                );
            }

            this.momentum += 1;

            // Cancel the gathering action if it was in progress.
            // clearTimeout(this.gatherTimeout);
        }

        return true;
    }

    setDisplayName(displayName: string) {
        this.displayName = displayName;

        // Tell every other nearby player the new name of player's character.
        this.board?.emitToNearbyPlayers(
            this.row,
            this.col,
            'change_display_name',
            {
                displayName,
                entityId: this.id,
            },
        );

        // If they already have an account, save the new display name.
        if (this.socket.account) {
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
        this.socket.sendEvent('glory_value', this.glory);

        // If this player has an account, save the new glory amount.
        if (this.socket.account) {
            this.socket.account.glory = this.glory;
        }
    }

    modFood(amount: number) {
        this.food += amount;
        this.food = Math.floor(this.food);

        // Make sure they can't go above max food or below the minimum.
        if (this.food > this.maxFood) {
            this.food = this.maxFood;
        }
        else if (this.food < 0) {
            this.food = 0;
        }

        // Tell the player their new food amount.
        this.socket.sendEvent('food_value', this.food);
    }

    modDefence(amount: number) {
        super.modDefence(amount);
        // Tell the player their new defence amount.
        this.socket.sendEvent('defence_value', this.defence);
    }

    /**
     * Swap to a different clothing item, or unequip the currently worn clothing.
     */
    modClothing(clothing: Clothes|null) {
        if (clothing === null) {
            // Tell the player to hide the equip icon on the inventory slot of the item that was removed.
            this.socket.sendEvent('deactivate_clothing');

            // Object.entries(this.clothing.statBonuses).forEach(([statKey, statBonus]) => {
            //     this.stats[statKey].levelModifier -= statBonus;
            // });
        }
        else {
            // Tell the player to show the equip icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent('activate_clothing', clothing.slotIndex);

            // Object.entries(clothing.statBonuses).forEach(([statKey, statBonus]) => {
            //     this.stats[statKey].levelModifier += statBonus;
            // });
        }
        // Do this after, or this.clothing would have already been nulled, so won't have a slot key to send to the client.
        this.clothing = clothing;
    }

    modHolding(holding: Holdable|null) {
        if (holding === null) {
            // Tell the player to hide the equip icon on the inventory slot of the item that was removed.
            this.socket.sendEvent('deactivate_holding');
        }
        else {
            // Tell the player to show the equip icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent('activate_holding', holding.slotIndex);
        }
        // Do this after, or this.holding would have already been nulled, so won't have a slot key to send to the client.
        this.holding = holding;
    }

    modAmmunition(ammunition: Ammunition|null) {
        if (ammunition === null) {
            // Tell the player to hide the ammunition icon on the inventory slot of the item that was removed.
            this.socket.sendEvent('deactivate_ammunition');
        }
        else {
            // Tell the player to show the ammunition icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent('activate_ammunition', ammunition.slotIndex);
        }
        // Do this after, or this.ammunition would have already been nulled, so won't have a slot key to send to the client.
        this.ammunition = ammunition;
    }
}

export default Player;
