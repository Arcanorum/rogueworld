const Boss = require('./Boss');

class BanditLeader extends Boss { }
module.exports = BanditLeader;

BanditLeader.prototype.registerEntityType();
BanditLeader.prototype.assignMobValues();
BanditLeader.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;