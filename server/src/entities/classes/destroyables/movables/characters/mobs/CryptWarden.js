const Mob = require("./Mob");

class CryptWarden extends Mob {}
module.exports = CryptWarden;

CryptWarden.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillZombies.taskId;
