
const Mob = require('./Mob');

class CryptWarden extends Mob {}
module.exports = CryptWarden;

CryptWarden.prototype.registerEntityType();
CryptWarden.prototype.assignMobValues();
CryptWarden.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;