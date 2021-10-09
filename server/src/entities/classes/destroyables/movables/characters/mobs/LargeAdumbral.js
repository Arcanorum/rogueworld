const Mob = require("./Mob");
const DayPhases = require("../../../../../../DayPhases");
const Damage = require("../../../../../../gameplay/Damage");
const Heal = require("../../../../../../gameplay/Heal");
const { SideDirections } = require("../../../../../../gameplay/Directions");
const EntitiesList = require("../../../../../EntitiesList");

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
        const { dayPhase } = this.board;

        if (dayPhase === DayPhases.Day) {
            // Give 33% of full glory value if it's daytime
            this.gloryValue *= 0.33;
        }
        else if (dayPhase === DayPhases.Dusk || dayPhase === DayPhases.Dawn) {
            // Give 66% of full glory value if it's dusk or dawn
            this.gloryValue *= 0.66;
        }

        // Spawn some smaller ones.
        SideDirections[this.direction].forEach((direction) => {
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

            const mediumAdumbral = new EntitiesList.MediumAdumbral({
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

LargeAdumbral.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillAdumbrals.taskId;

LargeAdumbral.prototype.spawnableDayPhases = {
    [DayPhases.Night]: true,
};
