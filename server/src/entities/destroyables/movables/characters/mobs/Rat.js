
const Mob = require('./Mob');

class Rat extends Mob {}
module.exports = Rat;

Rat.prototype.registerEntityType();
Rat.prototype.assignMobValues("Rat", Rat.prototype);
Rat.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillRats.taskID;
Rat.prototype.dropList = [
];