
const Mob = require('./Mob');

class Citizen extends Mob {}
module.exports = Citizen;

Citizen.prototype.registerEntityType();
Citizen.prototype.assignMobValues("Citizen", Citizen.prototype);
Citizen.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Citizen.prototype.dropList = [
    require('./../../../pickups/PickupCotton'),
    require('./../../../pickups/PickupOakLogs'),
];