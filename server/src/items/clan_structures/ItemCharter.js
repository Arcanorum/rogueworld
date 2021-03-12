// const Item = require("./Item");

// class ItemCharter extends Item {

//     onUsed () {
//         // Check this player isn't already in a clan.
//         if(this.owner.clan !== null){
//             // Tell them they are already in a clan.
//             this.owner.socket.sendEvent(this.owner.EventsList.chat_warning, this.owner.ChatWarnings["Already in clan warning"]);
//             return;
//         }
//         // Place the charter in front of the player to create a clan.
//         const frontOffset = this.owner.board.getRowColInFront(this.owner.direction, this.owner.row, this.owner.col);

//         // Check there is nothing in the way.
//         if(this.owner.board.isTileBuildable(frontOffset.row, frontOffset.col) === false) return;

//         const charter = new this.EntitiesList.Charter({row: frontOffset.row, col: frontOffset.col}).emitToNearbyPlayers();
//         // Add the creator to the clan they created.
//         charter.clan.addMember(this.owner);

//         super.onUsed();
//         this.destroy();
//     }

// }
//
// module.exports = ItemCharter;

// ItemCharter.prototype.registerItemType();
// ItemCharter.translationID = "Charter";
// ItemCharter.prototype.PickupType = require('../entities/pickups/PickupCharter');
// //ItemCharter.prototype.baseValue = 20;
// ItemCharter.iconSource = "icon-charter";
