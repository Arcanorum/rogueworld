
const Mob = require('./Mob');

class Mage extends Mob {}
module.exports = Mage;

Mage.prototype.registerEntityType();
Mage.prototype.assignMobValues();