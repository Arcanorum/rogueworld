
// const Interactable = require('./Interactable');

// class WoodWallTorch extends Interactable {

//     /**
//      * @param {Object} config
//      * @param {Number} config.row
//      * @param {Number} config.col
//      * @param {Board} config.board
//      */
//     constructor (config) {
//         super(config);
//     }

//     interaction (interactedBy) {

//         // TODO v all this shit is wrong, looks buggy too. blocking being changed on a torch? lol what
//         // Don't do anything if the character doesn't have enough energy to interact with this object.
//         if(interactedBy.energy < this.interactionEnergyCost) return;

//         // Reduce their energy by the interaction cost.
//         interactedBy.modEnergy(-this.interactionEnergyCost);

//         // Reverse the active state, so it turns on if off, and off if on.
//         this.activeState = !this.activeState;

//         this.blocking = this.activeState;

//         // Tell any nearby players the state of this object.
//         this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.active_state, {id: this.id, activeState: this.activeState});
//     }
// }
// module.exports = WoodWallTorch;

// WoodWallTorch.prototype.registerEntityType();
// WoodWallTorch.prototype.interactionEnergyCost = 1;