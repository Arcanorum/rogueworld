const Mob = require("./Mob");

class Hawk extends Mob {}
module.exports = Hawk;

Hawk.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillHawks.taskId;
