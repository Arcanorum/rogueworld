const Mob = require('./Mob');

class Boss extends Mob { }
module.exports = Boss;

Boss.prototype.dropAmount = 3;
Boss.prototype.spawnRate = 60000 * 10;