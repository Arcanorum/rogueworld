
const Mob = require('./Mob');

class Snoovir extends Mob {}
module.exports = Snoovir;

Snoovir.prototype.registerEntityType();
Snoovir.prototype.assignMobValues();
//Snoovir.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillSnoovirs.taskID; TODO add back