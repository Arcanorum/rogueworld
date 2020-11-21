const Mob = require("./Mob");

class Boss extends Mob { }
module.exports = Boss;

Boss.abstract = true;

Boss.prototype.spawnRate = 60000 * 10;