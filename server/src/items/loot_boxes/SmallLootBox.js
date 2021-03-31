const LootBox = require("./LootBox");

class SmallLootBox extends LootBox {}

SmallLootBox.prototype.amountGiven = 2;

module.exports = SmallLootBox;
