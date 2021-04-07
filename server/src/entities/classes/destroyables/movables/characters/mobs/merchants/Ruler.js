const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../../shops/ShopTypesList");

class Ruler extends Merchant { }

Ruler.prototype.shop = ShopTypesList.Ruler;

module.exports = Ruler;
