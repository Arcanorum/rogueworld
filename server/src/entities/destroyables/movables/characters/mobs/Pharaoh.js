
const Boss = require('./Boss');

class Pharaoh extends Boss {}
module.exports = Pharaoh;

Pharaoh.prototype.registerEntityType();
Pharaoh.prototype.assignMobValues();
Pharaoh.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;