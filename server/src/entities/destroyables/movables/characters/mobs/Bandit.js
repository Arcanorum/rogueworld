const Mob = require("./Mob");

class Bandit extends Mob {}
module.exports = Bandit;

Bandit.prototype.taskIDKilled = require("../../../../../tasks/TaskTypes").KillOutlaws.taskID;
