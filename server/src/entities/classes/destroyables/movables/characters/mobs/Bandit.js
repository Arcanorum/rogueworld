const Mob = require("./Mob");

class Bandit extends Mob {}
module.exports = Bandit;

Bandit.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillOutlaws.taskId;
