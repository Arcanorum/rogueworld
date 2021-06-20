const Mob = require("./Mob");
const EntitiesList = require("../../../../../EntitiesList");

class Assassin extends Mob {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttackTimeout = setInterval(this.specialAttack.bind(this), 10000);
    }

    preAttack() {
        // Decide what weapon to use based on proximity to target.
        if (!this.target) return;
        if (this.isAdjacentToEntity(this.target)) {
            this.changeAttackProjectile(EntitiesList.ProjNoctisDagger);
        }
        else {
            this.changeAttackProjectile(EntitiesList.ProjShuriken);
        }
    }

    onDestroy() {
        clearTimeout(this.specialAttackTimeout);

        super.onDestroy();
    }

    specialAttack() {
        // Try to teleport behind the target.
        if (!this.teleportBehindTarget()) {
            // Failed to teleport behind, try teleporting directing onto them.
            this.teleportOntoTarget();
        }
    }
}
module.exports = Assassin;

Assassin.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillOutlaws.taskId;
