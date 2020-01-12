
const Mob = require('./Mob');

class Citizen extends Mob {}
module.exports = Citizen;

Citizen.prototype.registerEntityType();
Citizen.prototype.assignMobValues();