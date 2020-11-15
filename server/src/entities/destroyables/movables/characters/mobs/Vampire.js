const Mob = require("./Mob");

class Vampire extends Mob {

    attackMelee () {
        // Only melee attack target if it is adjacent.
        if(this.isAdjacentToEntity(this.target) === false) return;

        // Face the target if not already doing so.
        this.modDirection(this.board.rowColOffsetToDirection(this.target.row - this.row, this.target.col - this.col));

        this.target.damage(
            new Damage({
                amount: this.meleeDamageAmount,
                types: this.meleeDamageTypes,
                armourPiercing: this.meleeDamageArmourPiercing
            }),
            this
        );

        // Vampires heal on attack.
        this.heal(
            new Heal(10)
        );
    }

}
module.exports = Vampire;

const Damage = require('../../../../../gameplay/Damage');
const Heal = require('../../../../../gameplay/Heal');

Vampire.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;