const Merchant = require("./Merchant");

class DwarfWeaponMerchant extends Merchant {}
module.exports = DwarfWeaponMerchant;

DwarfWeaponMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).DwarfWeapons();