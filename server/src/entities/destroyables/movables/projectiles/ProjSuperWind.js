const ProjWind = require("./ProjWind");

class ProjSuperWind extends ProjWind {
    /**
     * Custom collision checker to check tile in advance, otherwise the extra projectile this makes can go through walls.
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
        // Ignore other wind projectiles.
        if (collidee instanceof ProjWind) return;
        if (collidee instanceof ProjSuperWind) return;
        // Ignore pickups.
        if (collidee instanceof Pickup) return;
        // Ignore statics that are not high blocking.
        if (collidee instanceof Static) {
            if (collidee.isHighBlocked() === false) return;
        }

        // Create a new projectile in each direction.
        new ProjWind({
            row: this.row - 1, col: this.col, board: this.board, direction: this.Directions.UP, source: this.source,
        }).emitToNearbyPlayers();
        new ProjWind({
            row: this.row + 1, col: this.col, board: this.board, direction: this.Directions.DOWN, source: this.source,
        }).emitToNearbyPlayers();
        new ProjWind({
            row: this.row, col: this.col - 1, board: this.board, direction: this.Directions.LEFT, source: this.source,
        }).emitToNearbyPlayers();
        new ProjWind({
            row: this.row, col: this.col + 1, board: this.board, direction: this.Directions.RIGHT, source: this.source,
        }).emitToNearbyPlayers();

        this.pushBackCollidee(collidee);

        collidee.damage(
            new Damage({
                amount: this.damageAmount,
                types: this.damageTypes,
                armourPiercing: this.damageArmourPiercing,
            }),
            this.source,
        );

        this.destroy();
    }
}
module.exports = ProjSuperWind;

const Pickup = require("../../pickups/Pickup");
const Static = require("../../../statics/Static");
const Damage = require("../../../../gameplay/Damage");

ProjSuperWind.prototype.assignModHitPointConfigs("ProjWind");
