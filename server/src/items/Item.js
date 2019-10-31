
const StatNames = require('../stats/Statset').prototype.StatNames;
const getRandomIntInclusive = require('../Utils').getRandomIntInclusive;

class Item {

    /**
     * @param {Number} [config.durability = null]
     * @param {Number} [config.maxDurability = null]
     */
    constructor (config) {

        const durability = parseInt(config.durability);
        const maxDurability = parseInt(config.maxDurability);

        /**
         * How much durability this item has.
         * @type {Number|null}
         */
        this.durability = durability || maxDurability || this.baseDurability;

        /**
         * How much durability this item can have. Can change, such as when crafted by a player with levels in the crafting stat used.
         * @type {Number|null}
         */
        this.maxDurability = maxDurability || durability || this.baseDurability;

        /**
         * The player that owns this item.
         * @type {Player|null}
         */
        this.owner = null;

        /**
         * The key of the inventory slot that this item is in.
         * @type {String|null}
         */
        this.slotKey = null;

    }

    /**
     * Activate the effect of this item. i.e. Restore energy, equip armour, use tool.
     */
    use () {
        this.onUsed();
    }

    onUsed () {
        // Something might have happened to the owner of this item when it was used by them.
        // Such as eating a greencap on 1HP to suicide, but then owner is null.
        if(this.owner === null) return;

        // Check if this item gives any stat exp when used.
        if(this.owner.stats[this.expGivenStatName] !== undefined){
            this.owner.stats[this.expGivenStatName].gainExp(this.expGivenOnUse);
        }

        // Check if this item should lose durability when used.
        if(this.useDurabilityCost > 0){
            if(this.expGivenStatName !== null){
                // Check if the durability cost should be waived based on stat level chance.
                const waiveChance = getRandomIntInclusive(0, 99);
                if(waiveChance <= this.owner.stats[this.expGivenStatName].level){
                    return;
                }
            }
            this.modDurability(-this.useDurabilityCost);
        }
    }

    equip () {

    }

    unequip () {

    }

    drop () {
        // If no pickup type set, destroy the item without leaving a pickup on the ground.
        if(this.PickupType === null){
            this.destroy();
            return;
        }

        const owner = this.owner;
        // Add a pickup entity of that item to the board.
        new this.PickupType({row: owner.row, col: owner.col, board: owner.board, durability: this.durability, maxDurability: this.maxDurability}).emitToNearbyPlayers();

        this.destroy();
    }

    useGatheringTool () {
        // Get position of the grid tile in front of the owner of this item.
        const directionOffset = this.owner.board.directionToRowColOffset(this.owner.direction);

        // Get the static entity in that grid tile.
        const interactable = this.owner.board.grid[this.owner.row + directionOffset.row][this.owner.col + directionOffset.col].static;

        // Check the tile actually has a static on it.
        if(interactable === null) return;

        // Check it is an interactable.
        if(interactable.interaction === undefined) return;

        // This item is used on resource nodes, which are interactables.
        interactable.interaction(this.owner, this);
    }

    destroy () {
        // Prevent multiple destruction of items.
        if(this._destroyed === true) return;
        this._destroyed = true;

        // Remove the item from the character.
        this.owner.removeFromInventoryBySlotKey(this.slotKey);
        this.owner = null;
        this.slotKey = null;
        this.durability = null;
        this.maxDurability = null;
    }

    /**
     *
     * @param {Number} amount
     */
    modDurability (amount) {
        //console.log("mod durability, amount:", amount);
        // Check a valid value was given.
        if(!amount) return;

        this.durability += amount;

        // Make sure it doesn't go above max durability if repaired.
        if(this.durability > this.maxDurability){
            this.durability = this.maxDurability;
        }

        // Check if the item is now broken.
        if(this.durability < 1){
            // Tell the player their item broke.
            this.owner.socket.sendEvent(this.owner.EventsList.item_broken);
            // Destroy this broken item.
            this.destroy();
        }
        else {
            // Tell the player the new durability.
            this.owner.socket.sendEvent(this.owner.EventsList.durability_value, {durability: this.durability, slotKey: this.slotKey});
        }
    }

}

// Give all Items easy access to the finished EntitiesList. Needs to be done when all entities are finished initing, or accessing entities causes errors. Done in index.js.
Item.prototype.EntitiesList = {};

var typeNumberCounter = 1;
// A type number is an ID for this kind of item, so the client knows which item to add to the inventory bar.
// Used to send a number to get the item name from the item type catalogue, instead of a lengthy string of the item name.
// All items that appear on the client must be registered with Item.prototype.registerItemType().
Item.prototype.typeNumber = 'Type not registered.';

/**
 * Whether this item has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
 * @type {Boolean}
 */
Item.prototype._destroyed = false;

/**
 * The ID of this item in the language text definitions file.
 * Just the item name itself, which is added onto the "Item name: " prefix to get the actual ID.
 * @type {String}
 */
Item.prototype.idName = 'ID name not set.';

/**
 * The coin value of this item at full durability when sold to an NPC trader.
 * @type {Number}
 */
Item.prototype.baseValue = 0;

/**
 * The lowest durability this item can have at full durability.
 * @type {Number}
 */
Item.prototype.baseDurability = null;

/**
 * How much durability is taken from this item when it is used.
 * If this is a gathering tool, the durability cost is on the resource node entity it is used on instead.
 * @type {Number}
 */
Item.prototype.useDurabilityCost = 0;

Item.prototype.iconSource = "Icon source not set.";

/**
 * How much crafting exp this item contributes to the recipe it is used in.
 * @type {Number}
 */
Item.prototype.craftingExpValue = 10;

Item.prototype.StatNames = StatNames;
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
    RedKey: "RedKey",
    BlueKey: "BlueKey",
    GreenKey: "GreenKey",
    YellowKey: "YellowKey",
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

Item.prototype.registerItemType = function () {

    this.typeNumber = typeNumberCounter;

    typeNumberCounter+=1;

    //console.log("* Registering item type: ", this);

};

module.exports = Item;