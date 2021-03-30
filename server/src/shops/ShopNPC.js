const settings = require("../../settings");
const Shop = require("./Shop");

/**
 * NPC shops have an infinite amount of the items that they stock, and the price changes.
 */
class ShopNPC extends Shop {
    constructor() {
        super();

        // Create a loop to constantly depreciate the stock.
        this.depreciateLoop = setInterval(this.depreciateStock.bind(this), 20000);
    }

    destroy() {
        clearInterval(this.depreciateLoop);
    }

    /**
     * If the price for an item is higher than the base price, make it lose value over time.
     */
    depreciateStock() {
        // For every item that is above its base price, reduce its price.
        for (let i = 0; i < this.stock.length; i += 1) {
            const item = this.stock[i];
            if (item.price > item.basePrice) {
                item.price -= 5;
                // Make sure it doesn't go below the base price.
                if (item.price < item.basePrice) {
                    item.price = item.basePrice;
                }
                // Update the price list.
                this.prices[i] = item.price;
            }
        }
    }

    stockSold(stockIndex) {
        // Increase the price of the item, so it becomes harder to buy if in high demand.
        // Round up so clients don't get crazy long decimal values.
        this.stock[stockIndex].price = Math.ceil(
            this.stock[stockIndex].price * (settings.SHOP_PRICE_INCREASE_MULTIPLIER || 1.05),
        );
        // Update the price list.
        this.prices[stockIndex] = this.stock[stockIndex].price;
    }
}

module.exports = ShopNPC;
