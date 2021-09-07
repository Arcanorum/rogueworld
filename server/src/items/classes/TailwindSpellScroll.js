const Item = require("./Item");
const EntitiesList = require("../../entities/EntitiesList");
const { OppositeDirections } = require("../../gameplay/Directions");

class TailwindSpellScroll extends Item {
    onUsed() {
        // Get the tile behind the player.
        const offset = this.owner.board.getRowColInFront(
            OppositeDirections[this.owner.direction],
            this.owner.row,
            this.owner.col,
        );

        // Spawn a neutral wind facing the player.
        new EntitiesList.ProjTailwind({
            board: this.owner.board,
            row: offset.row,
            col: offset.col,
            direction: this.owner.direction,
            // source: this.owner,
        }).emitToNearbyPlayers();

        super.onUsed();
    }
}

module.exports = TailwindSpellScroll;
