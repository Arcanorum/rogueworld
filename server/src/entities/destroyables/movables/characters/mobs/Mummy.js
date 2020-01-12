
const Mob = require('./Mob');

class Mummy extends Mob {}
module.exports = Mummy;

Mummy.prototype.registerEntityType();
Mummy.prototype.assignMobValues();
Mummy.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;