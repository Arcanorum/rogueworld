
// const CraftingStation = require('../crafting stations/CraftingStation');

// class Charter extends CraftingStation {

//     /**
//      * @param {Object} config
//      * @param {Number} config.row
//      * @param {Number} config.col
//      */
//     constructor (config) {
//         // Clans can only exist on the overworld.
//         config.board = boardsObject['overworld'];
//         //console.log("charter cont, board:", config.board); TODO this class is messed up, clean
//         super(config);

//         this.clan = new Clan(this);

//     }

//     onDestroy () {
//         // Destroy the clan.
//         this.clan.destroy();

//         super.onDestroy();
//     }

// }
// module.exports = Charter;

// Charter.prototype.registerEntityType();
// Charter.prototype.hitPoints = 50;
// Charter.prototype.maxHitPoints = 50;

// const Clan = require('../../../Clan');
// const boardsObject = require('./../../../BoardsList').boardsObject;