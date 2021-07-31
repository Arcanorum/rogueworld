const Holdable = require("./Holdable");
const EntitiesList = require("../../../entities/EntitiesList");
const Utils = require("../../../Utils");

class Galestorm extends Holdable {
    onUsed(direction) {
        // Spawn a projectile for each unit of power they have collected.
        if (this.owner.miscData.galestormPower > 0) {
            for (
                ;
                this.owner.miscData.galestormPower > 0;
                this.owner.miscData.galestormPower -= 1
            ) {
                setTimeout(() => {
                    if (!this.owner || !this.owner.board) return;

                    // Get the tile next to the user, in the direction they used this item in.
                    const targetPosition = this.owner.board.getRowColInFront(
                        direction,
                        this.owner.row,
                        this.owner.col,
                    );

                    new EntitiesList.ProjSuperWind({
                        row: targetPosition.row,
                        col: targetPosition.col,
                        board: this.owner.board,
                        source: this.owner,
                        direction,
                    }).emitToNearbyPlayers();
                }, 200 * this.owner.miscData.galestormPower);
            }
        }
        // No power yet, spawn some power-ups around them for them to collect.
        else {
            // Pick some random tiles around the player to spawn onto.
            const tilePositions = this.owner.board.getTilePositionsInRange(
                this.owner.row,
                this.owner.col,
                2,
            );

            for (let i = 0; i < 3; i += 1) {
                const tile = Utils.getRandomElement(tilePositions);

                // Skip any blocked tiles.
                // eslint-disable-next-line no-continue
                if (this.owner.board.grid[tile.row][tile.col].isLowBlocked()) continue;

                new EntitiesList.GalestormPower({
                    row: tile.row,
                    col: tile.col,
                    board: this.owner.board,
                    lifespan: 5000,
                }).emitToNearbyPlayers();
            }
        }

        super.onUsed(direction);
    }
}

module.exports = Galestorm;
