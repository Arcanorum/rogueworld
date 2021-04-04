const Mob = require("./Mob");

class Bat extends Mob {}
module.exports = Bat;

Bat.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillBats.taskId;
