const Mob = require("./Mob");

class GrassScamp extends Mob {}
module.exports = GrassScamp;

GrassScamp.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillScamps.taskId;
