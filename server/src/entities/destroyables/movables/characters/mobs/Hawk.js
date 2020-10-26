const Mob = require('./Mob');

class Hawk extends Mob {}
module.exports = Hawk;

Hawk.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillHawks.taskID;