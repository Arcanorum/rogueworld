const CraftingStation = require('./CraftingStation');

class Anvil extends CraftingStation {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Clan} config.clan
     */
    constructor (config) {
        super(config);

        // If it belongs to a clan, add the specific properties for clan structures. TODO clean up
        //if(config.clan !== undefined){
        //    this.clan = config.clan;
        //    this.clan.addStructure(this);
        //    this.hitPoints = 10;
        //    this.maxHitPoints = 10;
        //}
    }

}
module.exports = Anvil;