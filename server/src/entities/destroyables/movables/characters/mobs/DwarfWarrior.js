
const Mob = require('./Mob');

class DwarfWarrior extends Mob { }
module.exports = DwarfWarrior;

DwarfWarrior.prototype.registerEntityType();
DwarfWarrior.prototype.assignMobValues();
DwarfWarrior.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillWarriors.taskID;