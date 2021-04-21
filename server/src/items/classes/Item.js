const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const Utils = require("../../Utils");
const Pickup = require("../../entities/classes/destroyables/pickups/Pickup");
const EntitiesList = require("../../entities/EntitiesList");
const { StatNames } = require("../../stats/Statset").prototype;
const EventsList = require("../../EventsList");
const TaskTypes = require("../../tasks/TaskTypes");

const { getRandomIntInclusive } = Utils;

class Item {
    /**
     * @param {ItemConfig} config.itemConfig
     */
    constructor(config) {
        this.itemConfig = config.itemConfig;

        this.slotIndex = config.slotIndex;

        /**
         * The player that owns this item.
         * @type {Player|null}
         */
        this.owner = config.owner;
    }

    /**
     * Activate the effect of this item. i.e. Restore energy, equip armour, use tool.
     */
    use() {
        if (this.checkUseCriteria()) {
            this.onUsed();
        }
    }

    checkUseCriteria() {
        const { owner } = this;

        if (owner.energy < this.useEnergyCost) return false;
        if (owner.glory < this.useGloryCost) return false;

        return true;
    }

    onUsed() {
        // Keep a reference to the owner, as if the item gets destroyed when used
        // here, owner will be nulled, but still want to be able to send events.
        const { owner } = this;

        // Something might have happened to the owner of this item when it was used by them.
        // Such as eating a greencap on 1HP to suicide, but then owner is null.
        if (owner === null) return;

        if (this.useEnergyCost) owner.modEnergy(-this.useEnergyCost);
        if (this.useGloryCost) owner.modGlory(-this.useGloryCost);

        if (this.hasUseEffect) {
            // Check if this item gives any stat exp when used.
            if (owner.stats[this.expGivenStatName] !== undefined) {
                owner.stats[this.expGivenStatName].gainExp(this.expGivenOnUse);
            }

            if (this.itemConfig.quantity) {
                this.modQuantity(-1);
            }
            else if (this.itemConfig.durability) {
                // if (this.expGivenStatName !== null) {
                //     // TODO: dunno about this, seems a bit lame now, make part of the update for chance for double items on gather, attack rate, etc.
                //     // Check if the durability cost should be waived based on stat level chance.
                //     const waiveChance = getRandomIntInclusive(0, 99);
                //     if (waiveChance <= owner.stats[this.expGivenStatName].level) {
                //         return;
                //     }
                // }
                this.modDurability(-1);
            }

            // Tell the user the item was used. Might not have had an immediate effect, but
            // the client might like to know right away (i.e. to play a sound effect).
            owner.socket.sendEvent(
                EventsList.item_used,
                { itemTypeCode: this.typeCode },
            );
        }
    }

    equip() { }

    unequip() { }

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

        this.owner = null;
        this.itemConfig = null;
        this.slotIndex = null;
    }

    /**
     * @param {Number} amount
     */
    modQuantity(amount) {
        // Check a valid value was given.
        if (!amount) return;

        this.itemConfig.modQuantity(amount);

        // Check if the stack is now empty.
        if (this.itemConfig.quantity < 1) {
            // Remove this empty item stack.
            // This needs to be done here as some items can use each other (e.g. bows using arrows).
            this.owner.inventory.removeItemBySlotIndex(this.slotIndex);
        }
        else {
            // Tell the player the new quantity.
            this.owner.socket.sendEvent(
                EventsList.modify_inventory_item,
                {
                    slotIndex: this.slotIndex,
                    quantity: this.itemConfig.quantity,
                    totalWeight: this.itemConfig.totalWeight,
                },
            );

            // If this player has an account, save the new quantity.
            if (this.owner.socket.account) {
                this.owner.socket.account.inventoryItems[this.slotIndex].quantity = (
                    this.itemConfig.quantity
                );
            }
        }
    }

    /**
     * @param {Number} amount
     */
    modDurability(amount) {
        // Check a valid value was given.
        if (!amount) return;

        this.itemConfig.modDurability(amount);

        // Check if the item is now broken.
        if (this.itemConfig.durability < 1) {
            // Tell the player their item broke.
            this.owner.socket.sendEvent(EventsList.item_broken);
            // Remove this broken item.
            // This needs to be done here as some items can use each other (e.g. bows using arrows).
            this.owner.inventory.removeItemBySlotIndex(this.slotIndex);
        }
        else {
            // Tell the player the new durability.
            this.owner.socket.sendEvent(
                EventsList.modify_inventory_item,
                {
                    slotIndex: this.slotIndex,
                    durability: this.itemConfig.durability,
                },
            );

            // If this player has an account, save the new durability.
            if (this.owner.socket.account) {
                this.owner.socket.account.inventoryItems[this.slotIndex].durability = (
                    this.itemConfig.durability
                );
            }
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

            if (key === "code") {
                this.prototype.typeCode = value;
                return;
            }

            // Needs to be converted from just the ids into actual task type references.
            if (key === "craftTasks") {
                if (!Array.isArray(value)) {
                    Utils.error("Item config property `craftTasks` must be an array:", config);
                }

                // Set own property for this item type, to prevent pushing into the parent (Item class) one.
                this.prototype.craftTaskIds = [];

                value.forEach((taskName) => {
                    const taskId = `Craft${taskName}`;
                    // Check the task type is valid.
                    if (!TaskTypes[taskId]) {
                        Utils.error("Invalid task name in `craftTasks` list. Check it is in the task types list:", taskName);
                    }

                    this.prototype.craftTaskIds.push(taskId);
                });

                return;
            }

            // Load whatever properties that have the same key in the config as on this class.
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

        // Check for any items that are referencing a weight class by name.
        if (typeof this.prototype.unitWeight === "string") {
            // Use the weight value for the corresponding weight class.

            // Load all of the weight classes.
            const WeightClasses = yaml.safeLoad(
                fs.readFileSync(
                    path.resolve("./src/configs/ItemWeightClasses.yml"), "utf8",
                ),
            );

            if (WeightClasses[this.prototype.unitWeight] === undefined) {
                Utils.error("Item weight class name does not exist in the item weight classes list: ", this.prototype.unitWeight);
            }

            if (typeof WeightClasses[this.prototype.unitWeight] !== "number") {
                Utils.error("The entry in the item weight class list is not a number. All weight classes must be numbers: ", this.prototype.unitWeight);
            }

            this.prototype.unitWeight = WeightClasses[this.prototype.unitWeight];
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

/**
 * A convenience debug property of the name of this type of item. i.e. IronDagger.
 * Should NOT be saved anywhere for anything persistent. Use `Item.prototype.typeCode` instead.
 * @type {String}
 */
Item.prototype.typeName = null;

/**
 * The unique identifier of this type of item. Should be set in the item values list and never
 * changed, as changing this would invalidate all saved items in player accounts.
 * @type {String}
 */
Item.prototype.typeCode = null;

/**
 * Give all Items easy access to the finished EntitiesList.
 * Needs to be done when all entities are finished initing,
 * or accessing entities causes errors. Done in index.js.
 * @type {Object}
 */
Item.prototype.EntitiesList = {};

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
 * How much crafting exp this item contributes to the recipe it is used in.
 * @type {Number}
 */
Item.prototype.craftingExpValue = 10;

/**
 * The ids of the task types that will be progressed on a player that crafts this item, from any recipe it is a result of.
 * Can be multiple, i.e. crafting iron arrows would progress both "CraftIronGear" and "CraftArrows" tasks.
 * @type {Array.<String>}
 */
Item.prototype.craftTaskIds = [];

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

/**
 * A flag of wether this item type does something when used, such as creating a projectile, restoring HP, or giving stat exp.
 * Not all items are "usable" as such, e.g. materials.
 * @type {Boolean}
 */
Item.prototype.hasUseEffect = false;

/**
 * How much energy it costs for a character to use this item.
 * @type {Number}
 */
Item.prototype.useEnergyCost = 0;

/**
 * How much glory it costs for a character to use this item.
 * @type {Number}
 */
Item.prototype.useGloryCost = 0;

module.exports = Item;
