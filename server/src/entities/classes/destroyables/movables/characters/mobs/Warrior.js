const Mob = require("./Mob");

class Warrior extends Mob {}
module.exports = Warrior;

Warrior.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillWarriors.taskId;
