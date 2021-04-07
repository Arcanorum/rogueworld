const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { v4: uuidv4 } = require("uuid");
const Utils = require("../Utils");
const ShopTypesList = require("./ShopTypesList");
const ItemsList = require("../items/ItemsList");
const ShopNPC = require("./ShopNPC");
const StockItem = require("./StockItem");

const populateList = () => {
    Utils.message("Populating shops list.");

    try {
        // Load all of the shop configs.
        const shopConfigs = yaml.safeLoad(
            fs.readFileSync(
                path.resolve("./src/configs/Shops.yml"), "utf8",
            ),
        );

        shopConfigs.forEach((config) => {
            // Check there isn't already a shop type with this name.
            if (ShopTypesList[config.name]) {
                Utils.error("Invalid shop type. Shop type already exists for name:", config.name);
            }

            ShopTypesList[config.name] = new ShopNPC();
        });
    }
    catch (error) {
        Utils.error(error);
    }

    Utils.message("Finished populating shops list.");
};

const initialiseList = () => {
    Utils.message("Initialising shops list.");

    try {
        // Load all of the shop configs again to finish setting them up, now that the classes are created
        const shopConfigs = yaml.safeLoad(
            fs.readFileSync(
                path.resolve("./src/configs/Shops.yml"), "utf8",
            ),
        );

        shopConfigs.forEach((config) => {
            // Validate each stock item.
            config.stock.forEach((stockConfig) => {
                const StockItemType = ItemsList.BY_NAME[stockConfig.itemName];

                // Check it is a valid item.
                if (!StockItemType) {
                    Utils.error("Invalid shop type. Stock item type doesn't exist in the item types list for config:", stockConfig);
                }

                const stockItemConfig = {
                    ItemType: StockItemType,
                    basePrice: stockConfig.unitPrice,
                    quantity: stockConfig.quantity || StockItemType.prototype.baseQuantity,
                    durability: stockConfig.durability || StockItemType.prototype.baseDurability,
                };

                // Check the cost is a positive number.
                if (stockConfig.unitPrice && (
                    !Number.isFinite(stockConfig.unitPrice) || stockConfig.unitPrice < 0)
                ) {
                    Utils.error("Invalid shop type. Stock item unit price isn't a positive number:", stockConfig);
                }

                // If any specific quantity or durability is set for this stock item, then check
                // the item type can have the given quantity or durability property (is stackable or not).
                if (stockConfig.quantity) {
                    if (!StockItemType.prototype.baseQuantity) {
                        Utils.error("Invalid shop type. Stock item quantity given for an unstackable item type. Stock config:", stockConfig);
                    }
                    // Check it is a positive number.
                    if (stockConfig.quantity && (
                        !Number.isFinite(stockConfig.quantity) || stockConfig.quantity < 0)
                    ) {
                        Utils.error("Invalid shop type. Stock item unit price isn't a positive number:", stockConfig);
                    }

                    stockItemConfig.quantity = stockConfig.quantity;
                    stockItemConfig.basePrice = stockConfig.quantity * stockConfig.unitPrice;
                }
                else if (stockConfig.durability) {
                    if (!StockItemType.prototype.baseDurability) {
                        Utils.error("Invalid shop type. Stock item durability given for a stackable item type. Stock config:", stockConfig);
                    }
                    // Check it is a positive number.
                    if (stockConfig.durability && (
                        !Number.isFinite(stockConfig.durability) || stockConfig.durability < 0)
                    ) {
                        Utils.error("Invalid shop type. Stock item unit price isn't a positive number:", stockConfig);
                    }

                    stockItemConfig.durability = stockConfig.durability;
                }

                // Stock item is good to go, add it to the shop.
                ShopTypesList[config.name].addStock(new StockItem(stockItemConfig));
            });
        });
    }
    catch (error) {
        Utils.error(error);
    }

    Utils.message("Finished initialising shops list. ShopTypesList is ready to use.");
};

const createCatalogue = () => {
    // Write the recipes to the client.
    let dataToWrite = {};

    Object.entries(ShopTypesList).forEach(([shopName, shopType]) => {
        // Add this recipe to the recipes catalogue.
        dataToWrite[shopName] = {
            stock: shopType.stock.map((stockItem, index) => ({
                // Add a unique id to stop React crying when this stock item is used in displaying a list...
                id: uuidv4(),
                index, // Add the index of this entry in the stock list, so the client can send it to identify the item to buy.
                typeCode: stockItem.ItemType.prototype.typeCode,
                quantity: stockItem.quantity || undefined,
                durability: stockItem.durability || undefined,
                totalWeight: (
                    stockItem.quantity
                        // For stackables, calculate the weight of the stack.
                        ? (stockItem.quantity * stockItem.ItemType.prototype.unitWeight)
                        // For unstackables, one item is just the unit weight.
                        : stockItem.ItemType.prototype.unitWeight
                ),
            })),
        };
    });

    dataToWrite = JSON.stringify(dataToWrite);

    Utils.checkClientCataloguesExists();

    // Write the data to the file in the client files.
    fs.writeFileSync("../client/src/catalogues/NPCShopTypes.json", dataToWrite);

    Utils.message("Shop types catalogue written to file.");
};

module.exports = {
    populateList,
    initialiseList,
    createCatalogue,
};
