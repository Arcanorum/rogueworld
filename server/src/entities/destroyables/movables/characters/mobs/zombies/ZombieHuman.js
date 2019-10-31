
const Zombie = require('./Zombie');

class ZombieHuman extends Zombie {}
module.exports = ZombieHuman;

ZombieHuman.prototype.registerEntityType();
ZombieHuman.prototype.assignMobValues("Zombie human", ZombieHuman.prototype);