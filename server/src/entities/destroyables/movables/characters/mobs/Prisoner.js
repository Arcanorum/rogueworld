
const Mob = require('./Mob');

class Prisoner extends Mob {}
module.exports = Prisoner;

Prisoner.prototype.registerEntityType();
Prisoner.prototype.assignMobValues();
Prisoner.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;