const Breakable = require('./Breakable');

class BankChest extends Breakable {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Clan} config.clan
     */
    constructor (config) {
        super(config);

        // If it belongs to a clan, add the specific properties for clan structures.
        //if(config.clan !== undefined){
        //    this.clan = config.clan;
        //    this.clan.addStructure(this); TODO clean
        //    this.hitPoints = 10;
        //    this.maxHitPoints = 10;
        //}
    }

}
module.exports = BankChest;