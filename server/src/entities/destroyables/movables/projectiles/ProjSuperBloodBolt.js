const ProjBloodBolt = require('./ProjBloodBolt');

class ProjSuperBloodBolt extends ProjBloodBolt {

    /**
     * Custom collision checker to check tile in advance, otherwise the extra projectiles this makes can go through walls.
     */
    checkCollisions() {
        if (!super.checkCollisions()) return false;

        // Also check if it is ABOUT TO hit an interactable.
        // TODO: refactor to us the more safe getTileInFront
        const nextRowCol = this.board.getRowColInFront(this.direction, this.row, this.col);

        const boardTileInFront = this.board.grid[nextRowCol.row][nextRowCol.col];

        // Check if it is about to hit something that blocks high things.
        if (boardTileInFront.isHighBlocked() === true) {
            this.handleCollision(boardTileInFront.static);
        }

        return this.shouldContinueCheckCollisionsChain();
    }

    handleCollision(collidee) {
        // Ignore other blood bolt projectiles.
        if (collidee instanceof ProjBloodBolt) return;
        if (collidee instanceof ProjSuperBloodBolt) return;
        // Ignore statics that are not high blocking.
        if (collidee instanceof Static) {
            if (collidee.isHighBlocked() === false) return;
        }

        // Create a new projectile in each direction.
        new ProjBloodBolt({ row: this.row - 1, col: this.col, board: this.board, direction: this.Directions.UP, source: this.source }).emitToNearbyPlayers();
        new ProjBloodBolt({ row: this.row + 1, col: this.col, board: this.board, direction: this.Directions.DOWN, source: this.source }).emitToNearbyPlayers();
        new ProjBloodBolt({ row: this.row, col: this.col - 1, board: this.board, direction: this.Directions.LEFT, source: this.source }).emitToNearbyPlayers();
        new ProjBloodBolt({ row: this.row, col: this.col + 1, board: this.board, direction: this.Directions.RIGHT, source: this.source }).emitToNearbyPlayers();

        if (collidee instanceof Character) {
            // Don't cause self-damage for whoever created this projectile.
            if (collidee === this.source) return;

            collidee.damage(
                new Damage({
                    amount: this.damageAmount,
                    types: this.damageTypes,
                    armourPiercing: this.armourPiercing
                }),
                this.source
            );
            // Blood bolt heals HP on hit.
            this.source.heal(
                new Heal(this.healAmount)
            );
        }

        this.destroy();
    }

}
module.exports = ProjSuperBloodBolt;

const Static = require('../../../statics/Static');
const Character = require('../../../destroyables/movables/characters/Character');
const Damage = require('../../../../gameplay/Damage');
const Heal = require('../../../../gameplay/Heal');

ProjSuperBloodBolt.prototype.assignModHitPointConfigs("ProjBloodBolt");