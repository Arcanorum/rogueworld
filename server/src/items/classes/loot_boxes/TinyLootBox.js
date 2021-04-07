const LootBox = require("./LootBox");

class TinyLootBox extends LootBox {}

TinyLootBox.prototype.amountGiven = 1;

module.exports = TinyLootBox;
