const Merchant = require("./Merchant");

class ArenaMaster extends Merchant {}
module.exports = ArenaMaster;

ArenaMaster.prototype.shop = new (require("../../../../../../gameplay/Shops")).Arena();
