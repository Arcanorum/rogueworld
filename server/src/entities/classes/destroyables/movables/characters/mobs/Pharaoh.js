const Boss = require("./Boss");

class Pharaoh extends Boss {}
module.exports = Pharaoh;

Pharaoh.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillZombies.taskId;
