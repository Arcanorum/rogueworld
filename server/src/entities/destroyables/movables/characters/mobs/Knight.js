
const Mob = require('./Mob');

class Knight extends Mob {}
module.exports = Knight;

Knight.prototype.registerEntityType();
Knight.prototype.assignMobValues();