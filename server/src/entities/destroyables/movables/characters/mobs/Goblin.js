const Mob = require("./Mob");

class Goblin extends Mob {}
module.exports = Goblin;

Goblin.prototype.taskIDKilled = require("../../../../../tasks/TaskTypes").KillGoblins.taskID;
