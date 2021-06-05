const Mob = require("./Mob");
const { HealthRegen } = require("../../../../../../gameplay/StatusEffects");

const specialAttackRate = 20000;

class Druid extends Mob {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttackTimeout = setInterval(this.specialAttack.bind(this), specialAttackRate);
    }

    onDestroy() {
        clearTimeout(this.specialAttackTimeout);

        super.onDestroy();
    }

    /**
     * Heal self over time (i.e. healing potion).
     */
    specialAttack() {
        // Heal if damaged.
        if (this.hitPoints < this.maxHitPoints) {
            this.addStatusEffect(HealthRegen);
        }
    }
}
module.exports = Druid;
