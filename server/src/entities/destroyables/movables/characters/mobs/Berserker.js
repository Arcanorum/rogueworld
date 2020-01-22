
const Mob = require('./Mob');

class Berserker extends Mob {

    onModHitPoints() {
        console.log("berserker, onmodhitpoints. Current hp:", this.hitPoints);

        // Make this mob attack faster as their HP gets lower.

        console.log("  this attack rate:", this.attackRate);
        console.log("  proto attack rate:", Berserker.prototype.attackRate);

        // Get what percent of their HP is left.

        const percentHP = this.hitPoints / this.maxHitPoints;
        console.log("hp %:", percentHP);
        
        const attackRateIncrease = 1 - percentHP;

        console.log("AR increase:", attackRateIncrease);
        this.attackRate = Berserker.prototype.attackRate - ((Berserker.prototype.attackRate / 2) * attackRateIncrease);

        console.log("new attack rate:", this.attackRate);
    }

}
module.exports = Berserker;

Berserker.prototype.registerEntityType();
Berserker.prototype.assignMobValues();
Berserker.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillWarriors.taskID;