const Shop = require("./Shop");

/**
 * Clan shops have only the amount of items that they add to the shop, and the price doesn't change.
 */
class ShopClan extends Shop {
    constructor() {
        super();

        this.maxStock = 20;
    }

    destroy() { }

    addStock(stockItem) {
        // Make sure the price isn't set. Only use the base price.
        stockItem.price = stockItem.basePrice;
        super.addStock(stockItem);
    }

    /**
     * Check that the item that a player wants to buy is valid.
     * If someone else buys the same item before they do, the ones next
     * along will be moved along, but their client might not have been
     * told that, so they could end up buying the wrong thing.
     * So check the index of the thing to buy, the type, and the price,
     * to make sure they are the same as what the player sees.
     * @param {Number} index - The index of the item in the clients stock list for this shop.
     * @param {String} itemTypeCode - The item on display.
     * @returns {Boolean} Whether the stock is valid.
     */
    checkStock(index, itemTypeCode) {
        const stockItem = this.stock[index];
        if (stockItem === undefined) return false;
        if (stockItem.ItemType.prototype.typeCode !== itemTypeCode) return false;

        return true;
    }

    removeStock() { }

    stockSold() {
        // Remove the item from the stock, as it is no longer available to buy.

    }
}

module.exports = ShopClan;
