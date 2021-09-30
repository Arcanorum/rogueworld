const ProjFireball = require("./ProjFireball");
const EntitiesList = require("../../../../EntitiesList");
const { Burn } = require("../../../../../gameplay/StatusEffects");
const { Directions } = require("../../../../../gameplay/Directions");

class ProjSuperFireball extends ProjFireball {
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
        if (collidee instanceof EntitiesList.ProjFireball) return;
        if (collidee instanceof EntitiesList.ProjSuperFireball) return;
        // Ignore pickups.
        if (collidee instanceof EntitiesList.AbstractClasses.Pickup) return;
        // Ignore corpses.
        if (collidee instanceof EntitiesList.AbstractClasses.Corpse) return;
        // Ignore statics that are not high blocking.
        if (collidee instanceof EntitiesList.Static) {
            if (collidee.isHighBlocked() === false) return;
        }

        const {
            row, col, board, source,
        } = this;
        // Create a new projectile in each direction.
        new EntitiesList.ProjFireball({
            row: row - 1, col, board, direction: Directions.UP, source,
        }).emitToNearbyPlayers();
        new EntitiesList.ProjFireball({
            row: row + 1, col, board, direction: Directions.DOWN, source,
        }).emitToNearbyPlayers();
        new EntitiesList.ProjFireball({
            row, col: col - 1, board, direction: Directions.LEFT, source,
        }).emitToNearbyPlayers();
        new EntitiesList.ProjFireball({
            row, col: col + 1, board, direction: Directions.RIGHT, source,
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

module.exports = ProjSuperFireball;
