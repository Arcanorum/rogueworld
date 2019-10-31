
const Corpse = require('./Corpse');

class CorpseHuman extends Corpse {}
module.exports = CorpseHuman;

CorpseHuman.prototype.registerEntityType();

CorpseHuman.prototype.ZombieType = require('../movables/characters/mobs/zombies/ZombieHuman');