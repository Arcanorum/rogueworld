const Mob = require("./Mob");

class Prisoner extends Mob {}
module.exports = Prisoner;

Prisoner.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillOutlaws.taskId;
