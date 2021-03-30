const EventsList = require("../EventsList");
const ItemConfig = require("../inventory/ItemConfig");
const Utils = require("../Utils");

class Shop {
    constructor() {
        /** @type {Number} How many items can this shop have in stock max. */
        this.maxStock = 9999;
        /** @type {Array} The types of items this shop is selling. */
        this.stock = [];
        /**
         * A periodically updated list of the prices of all items, to send to clients on request.
         * Saves having a spam of requests for the same data, even when it hasn't changed.
         * @type {Array} */
        this.prices = [];
    }

    destroy() { }

    /**
     * @param {StockItem} stockItem
     */
    addStock(stockItem) {
        if (this.stock.length === this.maxStock) return;
        this.stock.push(stockItem);
        this.prices.push(stockItem.price);
    }

    stockSold() { }

    checkStock(index, itemTypeName) {
        return true;
    }

    /**
     *
     * @param {Player} buyer - The player entity that wants to buy an item from this shop.
     * @param {Number} index - The index of the item in the clients stock list for this shop.
     * @param {String} itemTypeCode - The item on display.
     */
    sellStock(buyer, index, itemTypeCode) {
        const stockItem = this.stock[index];
        // Check the stock index is valid.
        if (stockItem === undefined) return;

        if (this.checkStock(index, itemTypeCode) === false) return;
        // Check they can afford the item.
        if (buyer.glory < stockItem.price) return;

        const itemConfig = new ItemConfig({
            ItemType: stockItem.ItemType,
            quantity: stockItem.quantity,
            durability: stockItem.durability,
        });

        // Check there is enough space to fit this item.
        if (!buyer.inventory.canItemBeAdded(itemConfig)) return;

        try {
            buyer.inventory.addItem(itemConfig);
        }
        catch (error) {
            Utils.warning("Cannot add item to player inventory. Error:", error);
        }

        // Take the cost from them.
        buyer.modGlory(-stockItem.price);

        this.stockSold(index);

        // The price of an item changes when bought, so tell them the new prices.
        buyer.socket.sendEvent(EventsList.shop_prices, this.prices);
    }
}

module.exports = Shop;
