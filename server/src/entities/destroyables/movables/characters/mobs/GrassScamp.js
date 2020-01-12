
const Mob = require('./Mob');

class GrassScamp extends Mob {}
module.exports = GrassScamp;

GrassScamp.prototype.registerEntityType();
GrassScamp.prototype.assignMobValues();
GrassScamp.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillScamps.taskID;