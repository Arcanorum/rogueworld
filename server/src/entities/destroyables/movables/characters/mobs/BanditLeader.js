const Boss = require("./Boss");

class BanditLeader extends Boss { }
module.exports = BanditLeader;

BanditLeader.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillOutlaws.taskId;
