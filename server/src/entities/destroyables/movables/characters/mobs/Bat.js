
const Mob = require('./Mob');

class Bat extends Mob {}
module.exports = Bat;

Bat.prototype.registerEntityType();
Bat.prototype.assignMobValues("Bat", Bat.prototype);
Bat.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillBats.taskID;
Bat.prototype.dropList = [
];