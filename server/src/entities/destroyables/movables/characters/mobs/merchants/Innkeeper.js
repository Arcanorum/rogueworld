const Merchant = require("./Merchant");

class Innkeeper extends Merchant {}
module.exports = Innkeeper;

Innkeeper.prototype.shop = new (require("../../../../../../gameplay/Shops")).Inn();
