const Mob = require("./Mob");

class SandScamp extends Mob {}
module.exports = SandScamp;

SandScamp.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillScamps.taskId;
