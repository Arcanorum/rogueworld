const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../shops/ShopTypesList");

class Innkeeper extends Merchant {}

Innkeeper.prototype.shop = ShopTypesList.Inn;

module.exports = Innkeeper;
