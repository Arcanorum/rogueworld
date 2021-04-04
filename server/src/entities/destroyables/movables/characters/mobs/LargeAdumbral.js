const Mob = require("./Mob");

class LargeAdumbral extends Mob {
    constructor(config) {
        super(config);

        this.timeCheckTimeout = setInterval(this.checkTime.bind(this), 5000);
    }

    onDestroy() {
        clearTimeout(this.timeCheckTimeout);

        super.onDestroy();
    }

    checkTime() {
        if (this.board.dayPhase === DayPhases.Night) {
            this.heal(new Heal(20));
        }
        else if (this.board.dayPhase === DayPhases.Day) {
            this.damage(new Damage({ amount: 50, armourPiercing: 1 }));
        }
        else {
            // Must be dawn/dusk.
            this.damage(new Damage({ amount: 20, armourPiercing: 1 }));
        }
    }

    onAllHitPointsLost() {
        // Spawn some smaller ones.
        this.SideDirections[this.direction].forEach((direction) => {
            let targetRowCol;

            // Spawn onto the adjacent tiles if possible.
            const frontTile = this.board.getTileInFront(direction, this.row, this.col);
            if (frontTile && frontTile.static === null) {
                targetRowCol = this.board.getRowColInFront(direction, this.row, this.col);
            }
            // Otherwise just spawn onto the dead one.
            else {
                targetRowCol = { row: this.row, col: this.col };
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
            if (this.target !== null) {
                // Check the target is alive.
                if (this.target.hitPoints > 0) {
                    mediumAdumbral.target = this.target;
                }
            }
        });

        super.onAllHitPointsLost();
    }
}
module.exports = LargeAdumbral;

const MediumAdumbral = require("./MediumAdumbral");
const DayPhases = require("../../../../../DayPhases");
const Damage = require("../../../../../gameplay/Damage");
const Heal = require("../../../../../gameplay/Heal");

LargeAdumbral.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillAdumbrals.taskId;

LargeAdumbral.prototype.spawnableDayPhases = {
    [DayPhases.Night]: true,
};
