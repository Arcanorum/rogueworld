const Mob = require("./Mob");

class DwarfWarrior extends Mob { }
module.exports = DwarfWarrior;

DwarfWarrior.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillWarriors.taskID;