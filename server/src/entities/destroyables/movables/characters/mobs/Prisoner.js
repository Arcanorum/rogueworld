const Mob = require("./Mob");

class Prisoner extends Mob {}
module.exports = Prisoner;

Prisoner.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;