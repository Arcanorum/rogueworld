const Utils = require("../Utils");
const Pickup = require("../entities/destroyables/pickups/Pickup");
const EntitiesList = require("../EntitiesList");
const { StatNames } = require("../stats/Statset").prototype;

const { getRandomIntInclusive } = Utils;
const typeNumberCounter = new Utils.Counter();

class Item {
    /**
     * @param {ItemConfig} config.itemConfig
     */
    constructor(config) {
        this.itemConfig = config.itemConfig;

        /**
         * The player that owns this item.
         * @type {Player|null}
         */
        this.owner = null;
    }

    static registerItemType() {
        this.prototype.typeNumber = typeNumberCounter.getNext();

        // Utils.message("Registering item type: ", this.prototype.typeNumber);
    }

    /**
     * Activate the effect of this item. i.e. Restore energy, equip armour, use tool.
     */
    use() {
        this.onUsed();
    }

    onUsed(direction) {
        // Something might have happened to the owner of this item when it was used by them.
        // Such as eating a greencap on 1HP to suicide, but then owner is null.
        if (this.owner === null) return;

        // Check if this item gives any stat exp when used.
        if (this.owner.stats[this.expGivenStatName] !== undefined) {
            this.owner.stats[this.expGivenStatName].gainExp(this.expGivenOnUse);
        }

        // Check if this item should lose durability when used.
        if (this.useDurabilityCost > 0) {
            if (this.expGivenStatName !== null) {
                // TODO: dunno about this, seems a bit lame now, make part of the update for chance for double items on gather, attack rate, etc.
                // Check if the durability cost should be waived based on stat level chance.
                const waiveChance = getRandomIntInclusive(0, 99);
                if (waiveChance <= this.owner.stats[this.expGivenStatName].level) {
                    return;
                }
            }
            this.modDurability(-this.useDurabilityCost);
        }

        // Tell the user the item was used. Might not have had an immediate effect, but
        // the client might like to know right away (i.e. to play a sound effect).
        this.owner.socket.sendEvent(
            this.owner.EventsList.item_used,
            { itemTypeNumber: this.typeNumber },
        );
    }

    equip() { }

    unequip() { }

    drop() {
        // If no pickup type set, destroy the item without leaving a pickup on the ground.
        if (this.PickupType === null) {
            this.destroy();
            return;
        }

        const { owner } = this;
        // Add a pickup entity of that item to the board.
        new this.PickupType({
            row: owner.row,
            col: owner.col,
            board: owner.board,
            durability: this.durability,
            maxDurability: this.maxDurability,
        }).emitToNearbyPlayers();

        owner.socket.sendEvent(this.owner.EventsList.item_dropped);

        this.destroy();
    }

    useGatheringTool() {
        // Get position of the grid tile in front of the owner of this item.
        const directionOffset = this.owner.board.directionToRowColOffset(this.owner.direction);

        const targetRow = this.owner.row + directionOffset.row;
        const targetCol = this.owner.col + directionOffset.col;

        // Get the static entity in that grid tile.
        const interactable = this.owner.board.grid[targetRow][targetCol].static;

        // Check the tile actually has a static on it.
        if (interactable === null) return;

        // Check it is an interactable.
        if (interactable.interaction === undefined) return;

        // This item is used on resource nodes, which are interactables.
        interactable.interaction(this.owner, this);
    }

    destroy() {
        // Prevent multiple destruction of items.
        if (this._destroyed === true) return;
        this._destroyed = true;

        // Remove the item from the character.
        this.owner.removeFromInventoryBySlotKey(this.slotKey);
        this.owner = null;
        this.slotKey = null;
        this.durability = null;
        this.maxDurability = null;
    }

    /**
     * @param {Number} amount
     */
    modQuantity(amount) {
        // Check a valid value was given.
        if (!amount) return;

        this.itemConfig.modQuantity(amount);

        // TODO: update client to show new quantity value for this item
    }

    /**
     * @param {Number} amount
     */
    modDurability(amount) {
        // Check a valid value was given.
        if (!amount) return;

        this.itemConfig.modDurability(amount);

        // Make sure it doesn't go above max durability if repaired.
        if (this.itemConfig.durability > this.itemConfig.maxDurability) {
            this.itemConfig.durability = this.itemConfig.maxDurability;
        }

        // Check if the item is now broken.
        if (this.itemConfig.durability < 1) {
            // Tell the player their item broke.
            this.owner.socket.sendEvent(this.owner.EventsList.item_broken);
            // Destroy this broken item.
            this.destroy();
        }
        else {
            // Tell the player the new durability.
            this.owner.socket.sendEvent(
                this.owner.EventsList.durability_value,
                { durability: this.itemConfig.durability, slotKey: this.slotKey },
            );
        }
    }

    static assignPickupType(itemName) {
        // Don't bother having a pickup type file. Just create one for each item
        // type, as it will always be 1-1 (except items that cannot be dropped).
        class GenericPickup extends Pickup { }
        GenericPickup.prototype.ItemType = this;

        GenericPickup.registerEntityType();

        this.prototype.PickupType = GenericPickup;

        // Add the pickup to the entities list, so it can still be manually instantiated, for spawners.
        EntitiesList[`Pickup${itemName}`] = GenericPickup;
    }

    static loadConfig(config) {
        // Load anything else that hasn't already been set by the loadConfig method of a subclass.

        this.translationID = config.translationID;
        this.iconSource = config.iconSource;
        this.soundType = config.soundType;

        Object.entries(config).forEach(([key, value]) => {
            if (key === "name") {
                this.prototype.typeName = value;
                return;
            }

            // Only load properties that should actually exist on this class.
            if (this.prototype[key] !== undefined) {
                // Check if the property has already been loaded by a
                // subclass, or set on the class prototype for class files.
                if (Object.getPrototypeOf(this).prototype[key] === this.prototype[key]) {
                    this.prototype[key] = value;
                }
            }
        });

        // Check for conflicting config properties.
        // Can only have the stackable properties or the unstackable properties, never both.
        if (this.prototype.baseQuantity && this.prototype.baseDurability) {
            Utils.error("Item type cannot have both `baseQuantity` and `baseDurability`. Item:", this);
        }

        // If neither have been set, then assume it is a single unit of a stackable
        // item, as that is the most common kind of item type and it would be
        // annoying to have to set `baseQuantity: 1` on so many item configs.
        if (!this.prototype.baseQuantity && !this.prototype.baseDurability) {
            this.prototype.baseQuantity = 1;
        }
    }
}

Item.abstract = true;

/**
 * The ID of this item in the language text definitions file.
 * Just the item name itself, which is added onto the "Item name: " prefix
 * on the client to get the actual ID.
 * @type {String}
 */
Item.translationID = "Translation ID name not set.";

Item.iconSource = "Icon source not set.";

Item.prototype.typeName = "Type name not set.";

// Give all Items easy access to the finished EntitiesList.
// Needs to be done when all entities are finished initing,
// or accessing entities causes errors. Done in index.js.
Item.prototype.EntitiesList = {};

// A type number is an ID for this kind of item, so the client knows which item to add to the inventory bar.
// Used to send a number to get the item name from the item type catalogue, instead of a lengthy string of the item name.
// All items that appear on the client must be registered with [ITEM_TYPE].registerItemType().
Item.prototype.typeNumber = "Type not registered.";

/**
 * Whether this item has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
 * @type {Boolean}
 */
Item.prototype._destroyed = false;

/**
 * The default durability for this item when no specific durability is specified.
 * Defined in the item config values list.
 * @type {Number}
 */
Item.prototype.baseDurability = null;

/**
 * The default quantity for this item when no specific quantity is specified.
 * Defined in the item config values list.
 * @type {Number}
 */
Item.prototype.baseQuantity = null;

/**
 * How much this item (or each unit of a stack) contributes to the total weight of the owner.
 * @type {Number}
 */
Item.prototype.unitWeight = 0;

/**
 * How much durability is taken from this item when it is used.
 * If this is a gathering tool, the durability cost is on the resource node entity it is used on instead.
 * @type {Number}
 */
Item.prototype.useDurabilityCost = 0;

/**
 * How much crafting exp this item contributes to the recipe it is used in.
 * @type {Number}
 */
Item.prototype.craftingExpValue = 10;

Item.prototype.StatNames = StatNames;

// TODO: make this a config list, allow multiple kinds of exp to be gained.
// - statName: Toolery
//   expGiven: 15
// - statName: Weaponry
//   expGiven: 20
Item.prototype.expGivenStatName = null;
Item.prototype.expGivenOnUse = 0;

/**
 * Useful for grouping similar items for checking if a certain kind of tool was used, regardless of what specific tool it was. i.e. any hatchet can be used to cut a tree.
 * @type {{Hatchet: string, Pickaxe: string, Weapon: string, Clothing: string}}
 */
Item.prototype.categories = {
    Hatchet: "Hatchet",
    Pickaxe: "Pickaxe",
    Weapon: "Weapon",
    Clothing: "Clothing",
    FighterKey: "FighterKey",
    PitKey: "PitKey",
};
Item.prototype.category = null;

/**
 * The type of entity to be added to the board if this item is dropped on the ground. The class itself, NOT an instance of it.
 * If left null, the item to drop will disappear and won't leave anything on the ground.
 * @type {Function}
 */
Item.prototype.PickupType = null;

module.exports = Item;
