
const ItemsList = require('./ItemsList');

class StockItem {
    constructor (itemType, basePrice, price) {
        /** @type {Function} */
        this.ItemType = itemType || ItemsList.ItemOakLogs;
        /** The minimum price of this item.
         * @type {Number} */
        this.basePrice = basePrice || 100;
        /** The glory cost of this item.
         * @type {Number} */
        this.price = price || basePrice;
    }
}

class Shop {
    constructor () {
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

    destroy () {

    }

    /**
     * @param {StockItem} stockItem
     */
    addStock (stockItem) {
        if(this.stock.length === this.maxStock) return;
        this.stock.push(stockItem);
        this.prices.push(stockItem.price);
    }

    stockSold () {

    }

    checkStock (index, itemTypeName, price) {
        //console.log("shop check stock");
        return true;
    }

    /**
     *
     * @param {Player} buyer - The player entity that wants to buy an item from this shop.
     * @param {Number} index - The index of the item in the clients stock list for this shop.
     * @param {String} itemTypeNumber - The item on display.
     * @param {Number} price - How much it is on display for.
     */
    sellStock (buyer, index, itemTypeNumber, price) {
        // Check the stock index is valid.
        if(this.stock[index] === undefined) return;

        if(this.checkStock(index, itemTypeNumber, price) === false) return;
        // Check they can afford the item.
        if(buyer.glory < price) return;
        // Check they have inventory space.
        if(buyer.isInventoryFull() === true) return;

        // Create a new item and give it to the entity.
        buyer.addToInventory(new this.stock[index].ItemType({}));
        // Take the cost from them.
        buyer.modGlory(-price);

        this.stockSold(index);
        //console.log("stock sold:", itemTypeNumber, ", for:", price);
    }

}

/**
 * Clan shops have only the amount of items that they add to the shop, and the price doesn't change.
 */
class ShopClan extends Shop {
    constructor () {
        super();

        this.maxStock = 20;
    }

    destroy () {

    }

    addStock (stockItem) {
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
     * @param {String} itemTypeNumber - The item on display.
     * @param {Number} price - How much it is on display for.
     * @returns {Boolean} Whether the stock is valid.
     */
    checkStock (index, itemTypeNumber, price) {
        const stockItem = this.stock[index];
        if(stockItem === undefined) return false;
        if(stockItem.ItemType.prototype.typeNumber !== itemTypeNumber) return false;
        if(stockItem.price !== price) return false;

        return true;
    }

    removeStock () {

    }

    stockSold () {
        // Remove the item from the stock, as it is no longer available to buy.

    }
}

/**
 * NPC shops have an infinite amount of the items that they stock, and the price changes.
 */
class ShopNPC extends Shop {
    constructor () {
        super();

        // Create a loop to constantly depreciate the stock.
        this.depreciateLoop = setInterval(this.depreciateStock.bind(this), 20000);
    }

    destroy () {
        clearInterval(this.depreciateLoop);
    }

    /**
     * If the price for an item is higher than the base price, make it lose value over time.
     */
    depreciateStock () {
        // For every item that is above its base price, reduce its price.
        for(let i=0; i<this.stock.length; i+=1){
            const item = this.stock[i];
            if(item.price > item.basePrice){
                item.price -= 5;
                // Make sure it doesn't go below the base price.
                if(item.price < item.basePrice){
                    item.price = item.basePrice;
                }
                // Update the price list.
                this.prices[i] = item.price;
            }
        }
    }

    stockSold (stockIndex) {
        // Increase the price of the item, so it becomes harder to buy if in high demand.
        // Round up so clients don't get crazy long decimal values.
        this.stock[stockIndex].price = Math.ceil(this.stock[stockIndex].price * 1.05);
        // Update the price list.
        this.prices[stockIndex] = this.stock[stockIndex].price;
    }
}

// Basic stuff for the tutorial zone.
class ShopTutorial extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemIronHatchet, 0));
        this.addStock(new StockItem(ItemsList.ItemIronPickaxe, 0));
    }
}

// Everything, for nothing. Tester.
class ShopOmni extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemOakLogs, 0));
        this.addStock(new StockItem(ItemsList.ItemIronOre, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumOre, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisOre, 0));
        this.addStock(new StockItem(ItemsList.ItemCotton, 0));
        this.addStock(new StockItem(ItemsList.ItemFeathers, 0));
        this.addStock(new StockItem(ItemsList.ItemWindGem, 0));
        this.addStock(new StockItem(ItemsList.ItemFireGem, 0));
        this.addStock(new StockItem(ItemsList.ItemBloodGem, 0));

        this.addStock(new StockItem(ItemsList.ItemRedcap, 0));
        this.addStock(new StockItem(ItemsList.ItemGreencap, 0));
        this.addStock(new StockItem(ItemsList.ItemBluecap, 0));
        this.addStock(new StockItem(ItemsList.ItemHealthPotion, 0));
        this.addStock(new StockItem(ItemsList.ItemEnergyPotion, 0));
        this.addStock(new StockItem(ItemsList.ItemCurePotion, 0));

        this.addStock(new StockItem(ItemsList.ItemIronDagger, 0));
        this.addStock(new StockItem(ItemsList.ItemIronSword, 0));
        this.addStock(new StockItem(ItemsList.ItemIronHammer, 0));
        this.addStock(new StockItem(ItemsList.ItemIronArmour, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumDagger, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumSword, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumHammer, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumArmour, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisDagger, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisSword, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisHammer, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisArmour, 0));

        this.addStock(new StockItem(ItemsList.ItemVampireFang, 0));

        this.addStock(new StockItem(ItemsList.ItemShuriken, 0));
        this.addStock(new StockItem(ItemsList.ItemIronArrows, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumArrows, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisArrows, 0));
        this.addStock(new StockItem(ItemsList.ItemOakBow, 0));
        this.addStock(new StockItem(ItemsList.ItemCloak, 0));
        this.addStock(new StockItem(ItemsList.ItemNinjaGarb, 0));

        this.addStock(new StockItem(ItemsList.ItemFireStaff, 0));
        this.addStock(new StockItem(ItemsList.ItemSuperFireStaff, 0));
        this.addStock(new StockItem(ItemsList.ItemWindStaff, 0));
        this.addStock(new StockItem(ItemsList.ItemSuperWindStaff, 0));
        this.addStock(new StockItem(ItemsList.ItemBookOfLight, 0));
        this.addStock(new StockItem(ItemsList.ItemBookOfSouls, 0));
        this.addStock(new StockItem(ItemsList.ItemPlainRobe, 0));
        this.addStock(new StockItem(ItemsList.ItemMageRobe, 0));
        this.addStock(new StockItem(ItemsList.ItemNecromancerRobe, 0));

        this.addStock(new StockItem(ItemsList.ItemIronHatchet, 0));
        this.addStock(new StockItem(ItemsList.ItemIronPickaxe, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumHatchet, 0));
        this.addStock(new StockItem(ItemsList.ItemDungiumPickaxe, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisHatchet, 0));
        this.addStock(new StockItem(ItemsList.ItemNoctisPickaxe, 0));

        //this.addStock(new StockItem(ItemsList.ItemCharter, 0));
        //this.addStock(new StockItem(ItemsList.ItemWorkbench, 0));
        //this.addStock(new StockItem(ItemsList.ItemFurnace, 0));
        //this.addStock(new StockItem(ItemsList.ItemAnvil, 0));
        //this.addStock(new StockItem(ItemsList.ItemBankChest, 0));
        //this.addStock(new StockItem(ItemsList.ItemWoodWall, 0));
        //this.addStock(new StockItem(ItemsList.ItemWoodDoor, 0));
    }
}

/*class ShopRuler extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemCharter, 1000));
    }
}*/

// Gathering tools
class ShopTools extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemIronHatchet, 100));
        this.addStock(new StockItem(ItemsList.ItemIronPickaxe, 100));
        this.addStock(new StockItem(ItemsList.ItemDungiumHatchet, 400));
        this.addStock(new StockItem(ItemsList.ItemDungiumPickaxe, 400));
    }
}

// Melee combat gear
class ShopMelee extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemIronDagger, 100));
        this.addStock(new StockItem(ItemsList.ItemIronSword, 200));
        this.addStock(new StockItem(ItemsList.ItemIronHammer, 250));
        this.addStock(new StockItem(ItemsList.ItemIronArmour, 500));
    }
}

// Ranged combat gear
class ShopRanged extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemFeathers, 50));
        this.addStock(new StockItem(ItemsList.ItemOakBow, 300));
        this.addStock(new StockItem(ItemsList.ItemIronArrows, 150));
        this.addStock(new StockItem(ItemsList.ItemShuriken, 200));
        this.addStock(new StockItem(ItemsList.ItemCloak, 500));
    }
}

// Magic combat gear
class ShopMagic extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemFireStaff, 500));
        this.addStock(new StockItem(ItemsList.ItemWindStaff, 350));
        this.addStock(new StockItem(ItemsList.ItemBookOfLight, 1000));
        this.addStock(new StockItem(ItemsList.ItemPlainRobe, 250));
        this.addStock(new StockItem(ItemsList.ItemMageRobe, 500));
    }
}

// Inn/bar
class ShopInn extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemHealthPotion, 200));
        this.addStock(new StockItem(ItemsList.ItemEnergyPotion, 200));
    }
}

// PvP arena
class ShopArena extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemFighterKey, 1000));
    }
}

// Raw materials
class ShopMaterials extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemIronOre, 50));
        this.addStock(new StockItem(ItemsList.ItemOakLogs, 40));
        this.addStock(new StockItem(ItemsList.ItemFeathers, 30));
        this.addStock(new StockItem(ItemsList.ItemCotton, 30));
    }
}

// Dwarf weapons
class ShopDwarfWeapons extends ShopNPC {
    constructor () {
        super();

        this.addStock(new StockItem(ItemsList.ItemIronHatchet, 400));
        this.addStock(new StockItem(ItemsList.ItemIronArrows, 400));
        this.addStock(new StockItem(ItemsList.ItemIronSword, 600));
        this.addStock(new StockItem(ItemsList.ItemIronHammer, 600));
        this.addStock(new StockItem(ItemsList.ItemIronArmour, 1500));
        this.addStock(new StockItem(ItemsList.ItemDungiumSword, 1200));
        this.addStock(new StockItem(ItemsList.ItemDungiumHammer, 1200));
    }
}

const ShopTypes = {
    Tutorial: ShopTutorial,
    Omni: ShopOmni,
    Clan: ShopClan,
    //Ruler: ShopRuler,
    Tools: ShopTools,
    Melee: ShopMelee,
    Ranged: ShopRanged,
    Magic: ShopMagic,
    Inn: ShopInn,
    Arena: ShopArena,
    DwarfWeapons: ShopDwarfWeapons,
    //Materials: ShopMaterials,
};


// Write the shops data to the client, so the client knows what items/prices to show for each shop ID name.
// The shop ID name isn't sent to the client, it is a property of each entity type, so they already know
// what shop data to show in the shop panel for each type of trader.
const fs = require('fs');
let dataToWrite = {};

for(let shopKey in ShopTypes){
    // Don't check prototype properties.
    if(ShopTypes.hasOwnProperty(shopKey) === false) continue;
    // Only add NPC shop types.
    if(ShopTypes[shopKey].prototype instanceof ShopNPC === false) continue;
    // Create an instance of each shop type, so it will be given an actual stock to save.
    const shop = new ShopTypes[shopKey]();

    // Add this shop ID name to the catalogue.
    // The ID name of the shop will be the key, and the stock items type numbers will be the values.
    // Prices are not added, as they can change, so needs to be sent on request.
    dataToWrite[shopKey] = [];

    const stock = shop.stock;
    // For every item in the stock.
    for(let i=0; i<stock.length; i+=1){
        if(!stock[i].ItemType.prototype){
            console.log("* Invalid item type on shop. Check all items defined in ItemsList are valid.");
        }

        dataToWrite[shopKey][i] = stock[i].ItemType.prototype.typeNumber;
    }

}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

require('./Utils').checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync('../client/src/catalogues/NPCShopTypes.json', dataToWrite);

console.log("* NPC shop types catalogue written to file.");

module.exports = ShopTypes;
