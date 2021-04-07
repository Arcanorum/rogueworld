const ProjWind = require("./ProjWind");
const EntitiesList = require("../../../../EntitiesList");
const Damage = require("../../../../../gameplay/Damage");

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
        if (collidee instanceof EntitiesList.AbstractClasses.Pickup) return;
        // Ignore corpses.
        if (collidee instanceof EntitiesList.AbstractClasses.Corpse) return;
        // Ignore statics that are not high blocking.
        if (collidee instanceof EntitiesList.Static) {
            if (collidee.isHighBlocked() === false) return;
        }

        const { board, source } = this;
        // Create a new projectile in each direction.
        new ProjWind({
            row: this.row - 1, col: this.col, board, direction: this.Directions.UP, source,
        }).emitToNearbyPlayers();
        new ProjWind({
            row: this.row + 1, col: this.col, board, direction: this.Directions.DOWN, source,
        }).emitToNearbyPlayers();
        new ProjWind({
            row: this.row, col: this.col - 1, board, direction: this.Directions.LEFT, source,
        }).emitToNearbyPlayers();
        new ProjWind({
            row: this.row, col: this.col + 1, board, direction: this.Directions.RIGHT, source,
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

ProjSuperWind.prototype.assignModHitPointConfigs("ProjWind");
