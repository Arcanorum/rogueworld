const settings = require("../../../../../settings");
const Character = require("./Character");
const Utils = require("../../../../Utils");
const BoardsList = require("../../../../board/BoardsList");
const BankAccount = require("../../../../BankAccount");
const Statset = require("../../../../stats/Statset");
const Taskset = require("../../../../tasks/Taskset");
const Damage = require("../../../../gameplay/Damage");
const Inventory = require("../../../../inventory/Inventory");

const checkWebsocketConnectionIsAliveRate = 1000 * 60 * 60;
const wsCheckAge = 1000 * 60 * 60;
const playerMeleeModHitPointConfig = require("../../../../gameplay/ModHitPointConfigs").PlayerMelee;

const respawnEntranceName = settings.DEV_MODE ? "test-island" : "city-spawn";

class Player extends Character {
    /**
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Object} config.socket
     */
    constructor(config) {
        super(config);

        config.board.addPlayer(this);

        this.socket = config.socket;

        config.socket.entity = this;

        this.stats = new Statset(this);
        this.tasks = new Taskset(this);
        this.inventory = new Inventory(this);
        this.bankAccount = new BankAccount(this);
        this.bornTime = Date.now();

        /**
         * The entrance that this player entity will respawn into.
         * @type {Entrance}
         */
        this.respawnEntrance = (
            config.respawnEntrance
            || BoardsList.boardsObject.overworld.entrances[respawnEntranceName]
        );

        this.nextMoveTime = 0;
        this.isMovePending = false;
        this.pendingMove = { byRows: 0, byCols: 0 };

        /** @type {Number} The time after which this player can perform another action. */
        this.nextActionTime = 0;

        // Start the energy regen loop.
        if (this.energyRegenRate !== false) {
            this.energyRegenLoop = setTimeout(this.regenEnergy.bind(this), this.energyRegenRate);
        }

        /**
         * The dungeon manager instance that this player is either looking at or that is
         * managing the dungeon instance that this player is in, if they are in one.
         * @type {DungeonManager}
         */
        this.focusedDungeonManager = null;

        this.connectionCheckTimeout = setTimeout(
            this.checkWebsocketConnectionIsAlive.bind(this),
            checkWebsocketConnectionIsAliveRate,
        );
    }

    checkWebsocketConnectionIsAlive() {
        if (this.socket === undefined) {
            Utils.warning("Checking player entity websocket connection, is undefined.");
            this.destroy();
            return;
        }
        if (this.socket === null) {
            Utils.warning("Checking player entity websocket connection, is null.");
            this.destroy();
            return;
        }
        if (this.socket.entity !== this) {
            Utils.warning("Checking player entity websocket connection, entity is not this.");
            this.destroy();
            return;
        }
        // Only print for entities that have been around for a while.
        if (this.bornTime > Date.now() + wsCheckAge) {
            Utils.message("Connection is still alive for:", this.id, ", dn:", this.displayName);
        }
        this.connectionCheckTimeout = setTimeout(
            this.checkWebsocketConnectionIsAlive.bind(this),
            checkWebsocketConnectionIsAliveRate,
        );
    }

    onDestroy() {
        /** @type {Item} */
        let item;

        // Drop all items in inventory.
        // Don't need to check the board tile to drop on, as
        // if they player is already stood on it, it is valid.

        // TODO: items refactor
        // for (const slotKey in this.inventory) {
        //     if (this.inventory.hasOwnProperty(slotKey) === false) continue;
        //     item = this.inventory[slotKey];
        //     // Check the item slot is valid, and not empty.
        //     if (item === null) continue;
        //     // Add a pickup entity of that item to the board.
        //     item.drop();
        // }

        // If the player is currently in a dungeon, remove
        // them from it before leaving that dungeon board.
        if (this.board.dungeon) {
            this.board.dungeon.removePlayerFromParty(this);
        }

        this.board.removePlayer(this);

        super.onDestroy();
    }

    /**
     * Special function for players, so the inventory isn't dropped when they close the game,
     * otherwise the inventory would be saved and also dropped so would duplicate items.
     * Called in World.removePlayer when the client is closed (by user or timeout, etc.).
     */
    remove() {
        // If the player is looking at a dungeon interface, they
        // might be in a party, so they need removing from that.
        if (this.focusedDungeonManager) {
            this.focusedDungeonManager.removePlayerFromParty(this);
        }

        if (this.clan !== null) {
            this.clan.memberLeft(this);
            this.clan = null;
        }

        clearTimeout(this.connectionCheckTimeout);

        // They might be dead when they disconnect, and so will already be removed from the board.
        // Check they are on the board/alive first.
        if (this.board) {
            this.board.removePlayer(this);

            // Call Destroyable.onDestroy directly, without going through the whole
            // onDestroy chain, so skips Player.onDestroy (no duplicate dropped items).
            super.onDestroy();
        }
    }

    getEmittableProperties(properties) {
        if (this.clothing !== null) properties.clothingTypeCode = this.clothing.typeCode;
        return super.getEmittableProperties(properties);
    }

    /**
     * Returns all of the items in the player's inventory, in a form that is ready to be emitted.
     * @returns {Array}
     */
    getEmittableInventory() {
        const emittableInventory = [];
        let item;

        // TODO: items refactor, move to inventory class
        // for (const slotKey in this.inventory) {
        //     if (this.inventory.hasOwnProperty(slotKey) === false) continue;
        //     // Skip empty slots.
        //     if (this.inventory[slotKey] === null) continue;
        //     item = this.inventory[slotKey];
        //     emittableInventory.push({
        //         typeCode: item.typeCode, slotKey: item.slotKey, durability: item.durability, maxDurability: item.maxDurability,
        //     });
        // }

        return emittableInventory;
    }

    respawn() {
        this.hitPoints = this.maxHitPoints;
        this.energy = this.maxEnergy;
        // Players are a special case that can be undestroyed.
        this._destroyed = false;
        this.regenEnergy();

        // Reposition them to somewhere within the respawn entrance bounds.
        const position = this.respawnEntrance.getRandomPosition();

        this.changeBoard(this.board, this.respawnEntrance.board, position.row, position.col);

        this.socket.sendEvent(this.EventsList.player_respawn);
    }

    regenEnergy() {
        if (this.energy < this.maxEnergy) {
            this.modEnergy(+1);
        }
        this.energyRegenLoop = setTimeout(this.regenEnergy.bind(this), this.energyRegenRate);
    }

    reposition(toRow, toCol) {
        this.board.removePlayer(this);
        super.reposition(toRow, toCol);
        this.board.addPlayer(this);
    }

    move(byRows, byCols) {
        // Check if this player can move yet.
        if (Date.now() < this.nextMoveTime) {
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

        this.nextMoveTime = Date.now() + this.moveDelay;

        // Check if the entity can move as a character.
        if (super.move(byRows, byCols) === true) {
            // Don't move if dead.
            if (this.hitPoints < 1) return false;

            const dynamicsAtViewRangeData = this.board.getDynamicsAtViewRangeData(
                this.row,
                this.col,
                this.direction,
            );

            // Don't bother sending the event if no dynamics were found.
            if (dynamicsAtViewRangeData !== false) {
                // Tell the player any dynamics that they can now see in the direction they moved.
                this.socket.sendEvent(
                    this.EventsList.add_entities,
                    dynamicsAtViewRangeData,
                );
            }
        }

        return true;
    }

    push(byRows, byCols) {
        // Don't let this player be pushed if they are in a safe zone.
        if (this.isInSafeZone() === false) {
            super.push(byRows, byCols);
        }
    }

    /**
     * Gets whether this player is in a safe zone.
     * @returns {Boolean}
     */
    isInSafeZone() {
        // Disable PvP in dungeon instances, as they are in a party together.
        if (this.board.dungeon) return true;

        return this.board.grid[this.row][this.col].safeZone;
    }

    /**
     * Limits the rate that a player can perform actions.
     * @param {Function} action - A function of the thing to do, such as use the held item.
     * @param {Object} context - The context to run the action in. Usually an entity or item.
     * @param {Object} config - Any additional inputs that the action requires.
     */
    performAction(action, context, config) {
        if (Date.now() > this.nextActionTime) {
            this.nextActionTime = Date.now() + 500;
            action.call(context, config);
        }
    }

    /**
     * @param {Damage} damage
     * @param {Entity} damagedBy
     */
    damage(damage, damagedBy) {
        if (damagedBy !== undefined && damagedBy !== null) {
            // If damaged by another player in a safe zone, ignore the damage.
            if (damagedBy instanceof Player) {
                if (this.isInSafeZone() === true) return;
            }
            // If damaged by something that has a player controlling it in a safe zone, ignore the damage.
            if (damagedBy.master instanceof Player) {
                if (this.isInSafeZone() === true) return;
            }
        }
        // Damage any clothes being worn.
        if (this.clothing !== null) {
            // Clothing only takes 25% of damage taken from the wearer.
            this.clothing.damage(
                new Damage({
                    amount: Math.floor(damage.amount * 0.25),
                    types: damage.types,
                    armourPiercing: damage.armourPiercing,
                }),
                damagedBy,
            );
        }

        super.damage(damage, damagedBy);
    }

    /**
     * Move this entity from the current board to another one.
     * @param {Board} toBoard - The board to move the entity to.
     * @param {Number} toRow - The board grid row to reposition the entity to.
     * @param {Number} toCol - The board grid col to reposition the entity to.
     */
    changeBoard(fromBoard, toBoard, toRow, toCol) {
        // Need to check if there is a board, as the board will be nulled if the player dies, but they can be revived.
        if (fromBoard) {
            fromBoard.removePlayer(this);
        }

        super.changeBoard(fromBoard, toBoard, toRow, toCol);

        // If the player is currently in a dungeon, remove
        // them from it before leaving that dungeon board.
        // If they are respawning after dying as the last
        // person in the dungeon, then the dungeon would have
        // already been destroyed, so check the board exists too.
        if (fromBoard && fromBoard.dungeon) {
            fromBoard.dungeon.removePlayerFromParty(this);
        }

        this.board.addPlayer(this);

        // Tell the client to load the new board map.
        this.socket.sendEvent(this.EventsList.change_board, {
            boardName: this.board.name,
            boardAlwaysNight: this.board.alwaysNight,
            boardIsDungeon: !!this.board.dungeon,
            playerRow: this.row,
            playerCol: this.col,
            dynamicsData: this.board.getNearbyDynamicsData(this.row, this.col),
        });
    }

    modGlory(amount) {
        this.glory += amount;
        this.glory = Math.floor(this.glory);

        if (this.glory < 0) {
            this.glory = 0;
        }

        // Tell the player their new glory amount.
        this.socket.sendEvent(this.EventsList.glory_value, this.glory);
    }

    modHitPoints(amount, source) {
        // If damaged by another player in a safe zone, ignore the damage.
        if (source instanceof Player) {
            if (this.board.grid[this.row][this.col].safeZone === true) {
                return;
            }
        }
        super.modHitPoints(amount);
        // Tell the player their new HP amount.
        this.socket.sendEvent(this.EventsList.hit_point_value, this.hitPoints);
    }

    modEnergy(amount) {
        this.energy += amount;
        this.energy = Math.floor(this.energy);

        // Make sure they can't go above max energy.
        if (this.energy > this.maxEnergy) {
            this.energy = this.maxEnergy;
        }

        // Tell the player their new energy amount.
        this.socket.sendEvent(this.EventsList.energy_value, this.energy);
    }

    modDefence(amount) {
        super.modDefence(amount);
        // Tell the player their new defence amount.
        this.socket.sendEvent(this.EventsList.defence_value, this.defence);
    }

    /**
     * @param {Clothes} clothing
     */
    modClothing(clothing) {
        if (clothing === null) {
            // Tell the player to hide the equip icon on the inventory slot of the item that was removed.
            this.socket.sendEvent(this.EventsList.deactivate_clothing);

            Object.entries(this.clothing.statBonuses).forEach(([statKey, statBonus]) => {
                this.stats[statKey].levelModifier -= statBonus;
            });
        }
        else {
            // Tell the player to show the equip icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent(this.EventsList.activate_clothing, clothing.slotIndex);

            Object.entries(clothing.statBonuses).forEach(([statKey, statBonus]) => {
                this.stats[statKey].levelModifier += statBonus;
            });
        }
        // Do this after, or this.clothing would have already been nulled, so won't have a slot key to send to the client.
        this.clothing = clothing;
    }

    /**
     * @param {Holdable} holding
     */
    modHolding(holding) {
        if (holding === null) {
            // Tell the player to hide the equip icon on the inventory slot of the item that was removed.
            this.socket.sendEvent(this.EventsList.deactivate_holding);
        }
        else {
            // Tell the player to show the equip icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent(this.EventsList.activate_holding, holding.slotIndex);
        }
        // Do this after, or this.holding would have already been nulled, so won't have a slot key to send to the client.
        this.holding = holding;
    }

    /**
     * @param {Ammunition} ammunition
     */
    modAmmunition(ammunition) {
        if (ammunition === null) {
            // Tell the player to hide the ammunition icon on the inventory slot of the item that was removed.
            this.socket.sendEvent(this.EventsList.deactivate_ammunition);
        }
        else {
            // Tell the player to show the ammunition icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent(this.EventsList.activate_ammunition, ammunition.slotIndex);
        }
        // Do this after, or this.ammunition would have already been nulled, so won't have a slot key to send to the client.
        this.ammunition = ammunition;
    }

    /**
     * Swap the contents of two slots. They can be empty or occupied.
     * @param {String} slotIndexFrom
     * @param {String} slotIndexTo
     */
    // TODO: rework
    // swapInventorySlots(slotIndexFrom, slotIndexTo) {
    //     if (this.inventory[slotIndexFrom] === undefined) return;
    //     if (this.inventory[slotIndexTo] === undefined) return;

    //     const slotFrom = this.inventory[slotIndexFrom];

    //     this.inventory[slotIndexFrom] = this.inventory[slotIndexTo];

    //     this.inventory[slotIndexTo] = slotFrom;

    //     if (this.inventory[slotIndexTo] !== null) {
    //         this.inventory[slotIndexTo].slotIndex = slotIndexTo;
    //     }
    //     if (this.inventory[slotIndexFrom] !== null) {
    //         this.inventory[slotIndexFrom].slotIndex = slotIndexFrom;
    //     }
    // }

    attackMelee(direction) {
        // Check the direction is valid.
        if (this.OppositeDirections[direction] === undefined) return;

        // Face the direction.
        this.modDirection(direction);

        // Get the first damagable entity in that direction.
        const boardTile = this.board.getTileInFront(direction, this.row, this.col);
        if (!boardTile) return;

        // Find the first entity that has some HP.
        const target = Object.values(boardTile.destroyables).find((entity) => entity.hitPoints);

        if (!target) return;

        target.damage(new Damage({
            amount: playerMeleeModHitPointConfig.damageAmount,
            types: playerMeleeModHitPointConfig.damageTypes,
        }), this);
    }

    /**
     * Use the item at the given slot.
     * @param {String} slotIndex
     */
    useItem(slotIndex) {
        // Check that slot is valid.
        if (this.inventory[slotIndex] === undefined) return false;

        this.inventory[slotIndex].use();

        return true;
    }

    /**
     * @static
     */
    pickUpItem() {
        // Get the tile the character is standing on.
        const boardTile = this.getBoardTile();

        // Get the first entity in the pickups list.
        const pickup = Object.values(boardTile.pickups)[0];

        // Check it has a pickup item on it. Might be nothing there.
        if (!pickup) return;

        const { itemConfig } = pickup;

        // Check there is enough space to fit this item.
        if (!this.inventory.canItemBeAdded(itemConfig)) {
            return;
        }

        try {
            this.inventory.addItem(itemConfig);
        }
        catch (error) {
            Utils.warning("Cannot add item to player inventory. Error:", error);
        }

        pickup.destroy();
    }

    /**
     * Get the key of the first empty slot in the inventory.
     * Throws an error if no slots are empty. Should be used after Player.isInventoryFull.
     * @return {String}
     */
    // TODO: items refactor
    // getEmptyInventorySlotKey() {
    //     for (const slotKey in this.inventory) {
    //         if (this.inventory.hasOwnProperty(slotKey) === false) continue;
    //         // If an empty slot is found, return the key for it.
    //         if (this.inventory[slotKey] === null) {
    //             return slotKey;
    //         }
    //     }
    //     // All slots are occupied. Throw an error.
    //     Utils.error("getEmptyInventorySlotKey, no inventory slots are empty. Should use Player.isInventoryFull before to check if a slot is empty.");
    // }

    /**
     * Returns whether the inventory is full (all slots occupied).
     * @return {Boolean}
     */
    // TODO: items refactor
    // isInventoryFull() {
    //     // Check that the character that interacted with this node has space in their inventory.
    //     for (const slot in this.inventory) {
    //         if (this.inventory.hasOwnProperty(slot) === false) continue;
    //         // If an empty slot is found, stop looping.
    //         if (this.inventory[slot] === null) return false;
    //     }
    //     // All slot are occupied. Inventory is full.
    //     // Tell the player.
    //     this.socket.sendEvent(this.EventsList.inventory_full);

    //     return true;
    // }

    /**
     * Clears the first inventory slot found that contains an instance of the specified class.
     * @param {Function} Item - The class to check for instances of. NOT an instance of the class.
     */
    // TODO: items refactor
    // removeFromInventoryByItemType(Item) {
    //     for (const slot in this.inventory) {
    //         if (this.inventory.hasOwnProperty(slot) === false) continue;
    //         if (this.inventory[slot] instanceof Item) {
    //             this.inventory[slot].destroy();
    //             // Item type was found and removed.
    //             return true;
    //         }
    //     }
    //     // No item of the given type was found.
    //     return false;
    // }
}
module.exports = Player;

// Give each player easy access to the events list.
Player.prototype.ChatWarnings = require("../../../../ChatWarnings");
/** @type {Number} How long between each move. */
Player.prototype.moveDelay = settings.PLAYER_MOVE_DELAY || 250;
/** @type {Number} Set this for it to be sent to the client too, so it can tween/animate at the right speed. */
Player.prototype.moveRate = settings.PLAYER_MOVE_DELAY || 250;
/** @type {Number} */
Player.prototype.maxHitPoints = settings.PLAYER_MAX_HITPOINTS || 200;
/** @type {Number} */
Player.prototype.hitPoints = Player.prototype.maxHitPoints;
/** @type {Number} */
Player.prototype.maxEnergy = settings.PLAYER_MAX_ENERGY || 20;
/** @type {Number} */
Player.prototype.energy = Player.prototype.maxEnergy;
/** @type {Number} */
Player.prototype.energyRegenRate = settings.PLAYER_ENERGY_REGEN_RATE || 1000;
/** @type {Number|null} */
Player.prototype.energyRegenLoop = null;
/** @type {Number} */
Player.prototype.glory = settings.PLAYER_STARTING_GLORY || 0;
/** @type {Function} */
Player.prototype.CorpseType = require("../../corpses/CorpseHuman");

/**
 * What this player is wearing. Such as armour, robes, cloak, disguise, apron.
 * A reference to an item in their inventory.
 * @type {Clothes}
 */
Player.prototype.clothing = null;

/**
 * What this player is holding. Mostly weapons.
 * A reference to an item in their inventory.
 * @type {Holdable}
 */
Player.prototype.holding = null;

/**
 * What this player is using as ammunition. Mostly arrows.
 * A reference to an item in their inventory.
 * @type {Ammunition}
 */
Player.prototype.ammunition = null;

/**
 * The clan this player is in, if they are in one.
 * @type {Clan}
 */
Player.prototype.clan = null;

/** @type {Number} How far can a player entity see, and how much data to send to their client. */
Player.viewRange = 15;
