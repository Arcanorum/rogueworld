
const Mob = require('./Mob');

class Dwarf extends Mob { }
module.exports = Dwarf;

Dwarf.prototype.registerEntityType();
Dwarf.prototype.assignMobValues();