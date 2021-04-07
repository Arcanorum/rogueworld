const Mob = require("./Mob");

class Mummy extends Mob {}
module.exports = Mummy;

Mummy.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillZombies.taskId;
