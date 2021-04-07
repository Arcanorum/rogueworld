// const Interactable = require('./Interactable');

// class Generator extends Interactable {

//     /**
//      * @param {Object} config
//      * @param {Number} config.row
//      * @param {Number} config.col
//      * @param {Board} config.board
//      * @param {Clan} config.clan
//      */
//     constructor (config) {
//         super(config);

//         this.clan = config.clan;
//         this.clan.addStructure(this);
//         // Let the clan know they have gained a generator, in case they didn't already have any, so now power is available.
//         this.clan.modGeneratorCount(+1);
//     }

//     onDestroy () {
//         // Let the clan know they have lost a generator, in case they have none left so the power needs to stop.
//         this.clan.modGeneratorCount(-1);
//         this.clan.removeStructure(this);

//         super.onDestroy();
//     }

// }
// module.exports = Generator;

// Generator.prototype.hitPoints = 10;
// Generator.prototype.maxHitPoints = 10;
