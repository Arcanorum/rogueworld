const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../shops/ShopTypesList");

class DwarfWeaponMerchant extends Merchant {}

DwarfWeaponMerchant.prototype.shop = ShopTypesList.DwarfWeapons;

module.exports = DwarfWeaponMerchant;
