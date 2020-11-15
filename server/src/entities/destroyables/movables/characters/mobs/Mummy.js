const Mob = require("./Mob");

class Mummy extends Mob {}
module.exports = Mummy;

Mummy.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;