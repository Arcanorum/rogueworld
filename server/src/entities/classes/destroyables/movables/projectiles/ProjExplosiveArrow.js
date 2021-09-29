const Projectile = require("./Projectile");
const EntitiesList = require("../../../../EntitiesList");
const explosion = require("../../../../../gameplay/Explosion");

class ProjExplosiveArrow extends Projectile {
    /**
     * Custom collision checker to check tile in advance, otherwise the explosion would be blocked entirely.
     */
    checkCollisions() {
        if (!super.checkCollisions()) return false;

        // Also check if it is ABOUT TO hit an interactable.
        const nextRowCol = this.board.getRowColInFront(this.direction, this.row, this.col);

        const boardTileInFront = this.board.grid[nextRowCol.row][nextRowCol.col];

        // Check if it is about to hit something that blocks high things.
        if (boardTileInFront.isHighBlocked() === true) {
            this.handleCollision(boardTileInFront.static);
        }

        return this.shouldContinueCheckCollisionsChain();
    }

    handleCollision(collidee) {
        // Ignore pickups.
        if (collidee instanceof EntitiesList.AbstractClasses.Pickup) return;
        // Ignore corpses.
        if (collidee instanceof EntitiesList.AbstractClasses.Corpse) return;
        // Ignore previous fire blasts, or the effect can block the arrow.
        if (collidee instanceof EntitiesList.FireBlast) return;
        // Ignore statics that are not high blocking.
        if (collidee instanceof EntitiesList.Static) {
            if (collidee.isHighBlocked() === false) return;
        }

        explosion({
            range: 2,
            row: this.row,
            col: this.col,
            board: this.board,
            source: this.source,
        });

        this.destroy();
    }
}
module.exports = ProjExplosiveArrow;
