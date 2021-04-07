const LootBox = require("./LootBox");

class MediumLootBox extends LootBox {}

MediumLootBox.prototype.amountGiven = 3;

module.exports = MediumLootBox;
