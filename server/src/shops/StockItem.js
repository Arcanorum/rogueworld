const ItemsListByName = require("../items/ItemsList").BY_NAME;

class StockItem {
    /**
     * @param {Function} config.ItemType
     * @param {Number} config.basePrice
     * @param {Number} config.unitPrice
     * @param {Number} [config.price]
     * @param {Number} [config.quantity]
     * @param {Number} [config.durability]
     */
    constructor(config) {
        /** @type {Function} */
        this.ItemType = config.ItemType || ItemsListByName.OakLogs;

        /** The default/minimum price of this item.
         * @type {Number} */
        this.basePrice = config.basePrice || 0;

        /** The current glory cost of this item.
         * @type {Number} */
        this.price = config.price || this.basePrice;

        // Default the prices to 0 where not set.
        this.unitPrice = config.unitPrice || 0;

        this.quantity = config.quantity || null;
        this.durability = config.durability || null;
    }
}

module.exports = StockItem;
