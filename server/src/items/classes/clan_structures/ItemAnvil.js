// const Item = require("../Item");

// class ItemAnvil extends Item {

//     onUsed () {
//         // Check this player is in a clan.
//         if(this.owner.clan === null){
//             // Tell them they must be in a clan to build.
//             this.owner.socket.sendEvent(this.owner.EventsList.chat_warning, this.owner.ChatWarnings["No clan build warning"]);
//             return;
//         }

//         // Place the charter in front of the player to create a clan.
//         const frontOffset = this.owner.board.getRowColInFront(this.owner.direction, this.owner.row, this.owner.col);

//         // Check it would be within range of the charter and max structures isn't reached.
//         if(this.owner.clan.canBuild(frontOffset.row, frontOffset.col, this.owner.board) === false) return;

//         new Anvil({row: frontOffset.row, col: frontOffset.col, board: this.owner.board, clan: this.owner.clan}).emitToNearbyPlayers();

//         super.onUsed();
//         this.destroy();
//     }

// }
//
// module.exports = ItemAnvil;

// const Anvil = require('../entities/interactables/crafting stations/Anvil');

// ItemAnvil.prototype.registerItemType();
// ItemAnvil.translationID = "Anvil";
// ItemAnvil.prototype.PickupType = require('../entities/pickups/PickupAnvil');
// //ItemAnvil.prototype.baseValue = 20;
// ItemAnvil.iconSource = "icon-anvil";
