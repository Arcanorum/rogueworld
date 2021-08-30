const Weapon = require("./Weapon");
const { getRowColsToSides } = require("../../../../gameplay/Directions");
const { Burn } = require("../../../../gameplay/StatusEffects");

class Hellraiser extends Weapon {
    onUsed(direction) {
        // Burn the user.
        this.owner.addStatusEffect(Burn);

        // Check user is still alive after effect applied above.
        if (!this.owner || !this.owner.board) {
            return;
        }

        // Get the tile next to the user, in the direction they used this item in.
        const targetPosition = this.owner.board.getRowColInFront(
            direction,
            this.owner.row,
            this.owner.col,
        );
        // Get the positions to the sides of that position.
        const sidePositions = getRowColsToSides(
            direction,
            targetPosition.row,
            targetPosition.col,
        );
        // Make some more projectiles in the same direction, at those positions.
        sidePositions.forEach((position) => {
            new this.ProjectileType({
                row: position.row,
                col: position.col,
                board: this.owner.board,
                source: this.owner,
                direction,
            }).emitToNearbyPlayers();
        });

        super.onUsed(direction);
    }
}

module.exports = Hellraiser;
