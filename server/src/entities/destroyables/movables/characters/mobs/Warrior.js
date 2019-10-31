
const Mob = require('./Mob');

class Warrior extends Mob {}
module.exports = Warrior;

Warrior.prototype.registerEntityType();
Warrior.prototype.assignMobValues("Warrior", Warrior.prototype);
Warrior.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Warrior.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillWarriors.taskID;
Warrior.prototype.dropList = [
    require('./../../../pickups/PickupIronBar'),
    require('./../../../pickups/PickupIronOre'),
    require('./../../../pickups/PickupIronSword'),
    require('./../../../pickups/PickupRedcap'),
];