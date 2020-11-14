const Mob = require("./Mob");
const Utils = require("../../../../../Utils");

class Assassin extends Mob {
    /**
     * @category Mob
     * 
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
        if(!this.target) return;
        if(this.isAdjacentToEntity(this.target)) {
            this.changeAttackProjectile(ProjNoctisDagger);
        }
        else {
            this.changeAttackProjectile(ProjShuriken);
        }
    }

    onDestroy() {
        clearTimeout(this.specialAttackTimeout);

        super.onDestroy();
    }

    specialAttack() {
        this.teleportBehindTarget() || this.teleportOntoTarget();
    }

}
module.exports = Assassin;

const ProjShuriken = require("./../../projectiles/ProjShuriken");
const ProjNoctisDagger = require("./../../projectiles/ProjNoctisDagger");

Assassin.prototype.taskIDKilled = require("../../../../../tasks/TaskTypes").KillOutlaws.taskID;