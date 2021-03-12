const Mob = require("./Mob");

class Warrior extends Mob {}
module.exports = Warrior;

Warrior.prototype.taskIDKilled = require("../../../../../tasks/TaskTypes").KillWarriors.taskID;
