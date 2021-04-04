const Mob = require("./Mob");

class DwarfWarrior extends Mob { }
module.exports = DwarfWarrior;

DwarfWarrior.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillWarriors.taskId;
