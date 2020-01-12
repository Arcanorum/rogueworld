
const Mob = require('./Mob');

class Hawk extends Mob {}
module.exports = Hawk;

Hawk.prototype.registerEntityType();
Hawk.prototype.assignMobValues();
Hawk.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillHawks.taskID;