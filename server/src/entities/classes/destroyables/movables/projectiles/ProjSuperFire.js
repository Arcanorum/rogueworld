const ProjFire = require("./ProjFire");
const EntitiesList = require("../../../../EntitiesList");
const { Burn } = require("../../../../../gameplay/StatusEffects");

class ProjSuperFire extends ProjFire {
    /**
     * Custom collision checker to check tile in advance, otherwise the extra fire balls this makes can go through walls.
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
        // Ignore other fire projectiles.
        if (collidee instanceof ProjFire) return;
        if (collidee instanceof ProjSuperFire) return;
        // Ignore pickups.
        if (collidee instanceof EntitiesList.AbstractClasses.Pickup) return;
        // Ignore corpses.
        if (collidee instanceof EntitiesList.AbstractClasses.Corpse) return;
        // Ignore statics that are not high blocking.
        if (collidee instanceof EntitiesList.Static) {
            if (collidee.isHighBlocked() === false) return;
        }

        const { board, source } = this;
        // Create a new projectile in each direction.
        new ProjFire({
            row: this.row - 1, col: this.col, board, direction: this.Directions.UP, source,
        }).emitToNearbyPlayers();
        new ProjFire({
            row: this.row + 1, col: this.col, board, direction: this.Directions.DOWN, source,
        }).emitToNearbyPlayers();
        new ProjFire({
            row: this.row, col: this.col - 1, board, direction: this.Directions.LEFT, source,
        }).emitToNearbyPlayers();
        new ProjFire({
            row: this.row, col: this.col + 1, board, direction: this.Directions.RIGHT, source,
        }).emitToNearbyPlayers();

        // If it can have status effects, apply burning.
        if (collidee.statusEffects !== undefined) {
            // Don't affect whoever made it.
            if (collidee !== this.source) {
                collidee.addStatusEffect(Burn, this.source);
            }
        }

        this.destroy();
    }
}

module.exports = ProjSuperFire;
