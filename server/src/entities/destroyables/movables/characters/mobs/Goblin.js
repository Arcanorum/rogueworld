const Mob = require("./Mob");

class Goblin extends Mob {}
module.exports = Goblin;

Goblin.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillGoblins.taskId;
