const Mob = require("./Mob");

class LargeAdumbral extends Mob {
    onAllHitPointsLost() {
        // Spawn some smaller ones.
        this.SideDirections[this.direction].forEach((direction) => {
            let targetRowCol;
            
            // Spawn onto the adjacent tiles if possible.
            const frontTile = this.board.getTileInFront(direction, this.row, this.col);
            if(frontTile && frontTile.static === null){
                targetRowCol = this.board.getRowColInFront(direction, this.row, this.col);
            }
            // Otherwise just spawn onto the dead one.
            else {
                targetRowCol = {row: this.row, col: this.col};
            }

            // Don't let the spawns last forever, or they could be exploited to create an
            // endless amount, as these aren't from a spawner as such so how many can exist
            // at once isn't limited.
            const lifespan = 120000;
            
            const mediumAdumbral = new MediumAdumbral({
                row: targetRowCol.row,
                col: targetRowCol.col,
                board: this.board,
                lifespan,
            }).emitToNearbyPlayers();

            mediumAdumbral.modDirection(this.direction);

            // Start already focused on the target of this thing that died.
            if(this.target !== null){
                // Check the target is alive.
                if(this.target.hitPoints > 0){
                    mediumAdumbral.target = this.target;
                }
            }
        });

        super.onAllHitPointsLost();
    }
}
module.exports = LargeAdumbral;

const MediumAdumbral = require("./../../characters/mobs/MediumAdumbral");