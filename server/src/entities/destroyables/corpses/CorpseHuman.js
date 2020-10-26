const Corpse = require('./Corpse');

/**
 * @category Corpse
 * 
 * @param {Object} config
 * @param {Number} config.row The row to create this entity on.
 * @param {Number} config.col The column to create this entity on.
 * @param {Board} config.board The board to create this entity on.
 */
class CorpseHuman extends Corpse {}

CorpseHuman.prototype.ZombieType = require('../movables/characters/mobs/zombies/ZombieHuman');

module.exports = CorpseHuman;