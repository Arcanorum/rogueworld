
const Mob = require('./Mob');

class Warrior extends Mob {}
module.exports = Warrior;

Warrior.prototype.registerEntityType();
Warrior.prototype.assignMobValues();
Warrior.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillWarriors.taskID;