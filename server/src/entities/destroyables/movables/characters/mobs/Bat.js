const Mob = require("./Mob");

class Bat extends Mob {}
module.exports = Bat;

Bat.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillBats.taskID;