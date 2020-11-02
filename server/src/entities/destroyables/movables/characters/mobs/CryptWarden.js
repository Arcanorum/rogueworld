const Mob = require('./Mob');

class CryptWarden extends Mob {}
module.exports = CryptWarden;

CryptWarden.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;