class BankItem {
    constructor() {
        /** @type {Number|null} */
        this.durability = null;
        /** @type {Number|null} */
        this.maxDurability = null;
        /** @type {String} The name of the class of this item.
         * Used to lookup the class in the item types list when rebuilding the item when withdrawn.
         * If null, then there is no item in this bank slot.
         * */
        this.itemTypeName = null;
    }
}

class BankAccount {
    constructor(player) {
        /** @type {Player} */
        this.player = player;
        /** @type {BankItem[]} */
        this.items = [];
        /** @type {Number} */
        this.itemsPerTab = 15;
        // Add sets of
        for (let i = 0; i < this.itemsPerTab; i += 1) this.items.push(new BankItem(false));
        // Add 3 sets of enough bank slots for a tab.
        for (let i = 0; i < this.itemsPerTab * 3; i += 1) this.items.push(new BankItem(true));
    }

    /**
     * Add an item to this bank account.
     * @param {Number} slotIndex
     * @param {Function} ItemType
     * @param {Number=null} durability
     * @param {Number=null} maxDurability
     */
    addItemToBankAccount(slotIndex, ItemType, durability, maxDurability) {
        if (slotIndex === undefined) return;
        if (ItemType === undefined) return;
        /** @type {BankItem} */
        const bankItem = this.items[slotIndex];
        bankItem.itemTypeName = ItemType.prototype.typeName;
        bankItem.durability = durability || ItemType.prototype.baseDurability || null;
        bankItem.maxDurability = maxDurability || ItemType.prototype.baseDurability || null;
    }

    /**
     * Empties a bank account slot.
     * @param {Number} slotIndex
     */
    removeItemFromBankAccount(slotIndex) {
        if (slotIndex === undefined) return;
        /** @type {BankItem} */
        const bankItem = this.items[slotIndex];
        bankItem.itemTypeName = null;
        bankItem.durability = null;
        bankItem.maxDurability = null;
    }

    addStarterItems() {
        this.addItemToBankAccount(0, ItemsList.BY_NAME.IronSword);
        this.addItemToBankAccount(1, ItemsList.BY_NAME.HealthPotion);
        this.addItemToBankAccount(5, ItemsList.BY_NAME.OakBow);
        this.addItemToBankAccount(6, ItemsList.BY_NAME.IronArrows);
    }

    /**
     * @param {String} inventorySlotKey
     * @param {Number} bankSlotIndex
     */
    depositItem(inventorySlotKey, bankSlotIndex) {
        if (BankChest === undefined) return;
        // Check they are next to a bank terminal.
        if (this.player.isAdjacentToStaticType(BankChest.prototype.typeNumber) === false) return;

        /** @type {Item} The inventory item to deposit. */
        const inventoryItem = this.player.inventory[inventorySlotKey];
        if (inventoryItem === undefined) return;
        if (inventoryItem === null) return;
        /** @type {BankItem} The bank item slot to deposit to. */
        const bankItem = this.items[bankSlotIndex];
        if (bankItem === undefined) return;

        // The data to store, before the item is destroyed.
        const { durability } = inventoryItem;
        const { maxDurability } = inventoryItem;
        const itemTypeName = inventoryItem.typeName;

        // Destroy the deposited item from the inventory.
        inventoryItem.destroy();

        // If there is something already in this bank slot, withdraw it to the inventory in place of the item being deposited.
        if (bankItem.itemTypeName !== null) {
            // Create a new item of the type that was stored in this slot in the bank.
            this.player.addToInventory(new ItemsList.BY_NAME[bankItem.itemTypeName]({ durability: bankItem.durability, maxDurability: bankItem.maxDurability }), inventorySlotKey);
        }

        // Add the data of the item being deposited to the bank slot.
        this.addItemToBankAccount(
            bankSlotIndex,
            ItemsList.BY_NAME[itemTypeName],
            durability,
            maxDurability,
        );

        this.player.socket.sendEvent(this.player.EventsList.bank_item_deposited, {
            slotIndex: bankSlotIndex,
            typeCode: inventoryItem.typeCode,
            durability: bankItem.durability,
            maxDurability: bankItem.maxDurability,
        });
    }

    /**
     *
     * @param {Number} bankSlotIndex
     * @param {String} [inventorySlotKey]
     */
    withdrawItem(bankSlotIndex, inventorySlotKey) {
        if (BankChest === undefined) return;
        // Check they are next to a bank terminal.
        if (this.player.isAdjacentToStaticType(BankChest.prototype.typeNumber) === false) return;

        const bankItem = this.items[bankSlotIndex];
        if (bankItem === undefined) return;
        if (bankItem.itemTypeName === null) return;

        // Check there is space in the inventory to put the withdrawn item.
        // if (this.player.isInventoryFull() === true) return;

        // If a specific inventory slot wasn't given to withdraw to, no need to check if it has something in it as the first empty slot will be used.
        if (inventorySlotKey === undefined) {
            // Withdraw the item.
            this.player.addToInventory(new ItemsList.BY_NAME[bankItem.itemTypeName]({ durability: bankItem.durability, maxDurability: bankItem.maxDurability }));
            // Empty the bank slot, as nothing is being put in it from the inventory.
            this.removeItemFromBankAccount(bankSlotIndex);

            this.player.socket.sendEvent(this.player.EventsList.bank_item_withdrawn, bankSlotIndex);
        }
        // A specific inventory slot was given.
        else {
            /** @type {Item} */
            const inventoryItem = this.player.inventory[inventorySlotKey];
            // Check it is valid.
            if (inventoryItem === undefined) return;
            // Check if it already has an item in it. If so, deposit that item.
            if (inventoryItem !== null) {
                // The data to store, before the item is destroyed.
                const { durability, maxDurability, typeCode } = inventoryItem;
                const itemTypeName = inventoryItem.typeName;

                // Remove the item from the inventory slot.
                inventoryItem.destroy();

                // Withdraw the item.
                this.player.addToInventory(new ItemsList.BY_NAME[bankItem.itemTypeName]({ durability: bankItem.durability, maxDurability: bankItem.maxDurability }), inventorySlotKey);
                // Add the data of the item being deposited to the bank slot.
                this.addItemToBankAccount(
                    bankSlotIndex,
                    ItemsList.BY_NAME[bankItem.itemTypeName],
                    durability,
                    maxDurability,
                );
                // Tell the client the item that was in the slot they withdrew to is now in the bank.
                this.player.socket.sendEvent(this.player.EventsList.bank_item_deposited, {
                    slotIndex: bankSlotIndex,
                    typeCode,
                    durability,
                    maxDurability,
                });
            }
            // Inventory slot is empty.
            else {
                // Withdraw the item.
                this.player.addToInventory(new ItemsList.BY_NAME[bankItem.itemTypeName]({ durability: bankItem.durability, maxDurability: bankItem.maxDurability }), inventorySlotKey);
                // The items has been withdrawn, empty the bank slot.
                this.removeItemFromBankAccount(bankSlotIndex);

                this.player.socket.sendEvent(this.player.EventsList.bank_item_withdrawn, bankSlotIndex);
            }
        }
    }

    /**
     * Swap the contents of two bank slots.
     * @param {Number} fromSlotIndex
     * @param {Number} toSlotIndex
     */
    swapItems(fromSlotIndex, toSlotIndex) {
        if (this.items[fromSlotIndex] === undefined) return;
        if (this.items[toSlotIndex] === undefined) return;

        const slotFrom = this.items[fromSlotIndex];

        this.items[fromSlotIndex] = this.items[toSlotIndex];

        this.items[toSlotIndex] = slotFrom;
    }

    /**
     * Returns all of the items in the player's bank, in a form that is ready to be emitted.
     * @returns {Array}
     */
    getEmittableItems() {
        const emittableItems = [];
        let item;

        for (let i = 0, len = this.items.length; i < len; i += 1) {
            // Skip empty slots.
            if (this.items[i].itemTypeName === null) continue;

            item = this.items[i];

            emittableItems.push({
                typeCode: ItemsList.BY_NAME[item.itemTypeName].prototype.typeCode,
                slotIndex: i,
                durability: item.durability,
                maxDurability: item.maxDurability,
            });
        }

        return emittableItems;
    }
}

module.exports = BankAccount;

const BankChest = require("./entities/statics/interactables/breakables/BankChest");
const ItemsList = require("./ItemsList");
