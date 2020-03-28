
const Merchant = require('./Merchant');

class DwarfWeaponMerchant extends Merchant {}
module.exports = DwarfWeaponMerchant;

DwarfWeaponMerchant.prototype.registerEntityType();
DwarfWeaponMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
DwarfWeaponMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).DwarfWeapons();