const Mob = require('./Mob');

class Berserker extends Mob {

    onModHitPoints() {
        // Make this mob attack faster as their HP gets lower.
        const percentHP = this.hitPoints / this.maxHitPoints;
        const baseAttackRate = Berserker.prototype.attackRate;
        const attackRateIncrease = 1 - percentHP;
        // Can have up to 50% attack rate delay reduction (attack 2x as often).
        // Need `/ 2` otherwise they can go as low as 100% reduction (no delay between attacks, i.e. a machine gun).
        this.attackRate = baseAttackRate - ((baseAttackRate / 2) * attackRateIncrease);
    }

}
module.exports = Berserker;

Berserker.prototype.registerEntityType();
Berserker.prototype.assignMobValues();
Berserker.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillWarriors.taskID;