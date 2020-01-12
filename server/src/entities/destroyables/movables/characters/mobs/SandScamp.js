
const Mob = require('./Mob');

class SandScamp extends Mob {}
module.exports = SandScamp;

SandScamp.prototype.registerEntityType();
SandScamp.prototype.assignMobValues();
SandScamp.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillScamps.taskID;