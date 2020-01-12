
const Mob = require('./Mob');

class Goblin extends Mob {}
module.exports = Goblin;

Goblin.prototype.registerEntityType();
Goblin.prototype.assignMobValues();
Goblin.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillGoblins.taskID;