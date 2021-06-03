const Mob = require("./Mob");

class SnowScamp extends Mob {}
module.exports = SnowScamp;

SnowScamp.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillScamps.taskId;
