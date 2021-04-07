const Mob = require("./Mob");

class Rat extends Mob {}
module.exports = Rat;

Rat.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillRats.taskId;
