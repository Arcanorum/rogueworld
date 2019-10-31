
const Mob = require('./Mob');

class GnarlOak extends Mob {

    /**
     * Prevent gnarls from ever being moved.
     */
    move () {}

}
module.exports = GnarlOak;

GnarlOak.prototype.registerEntityType();
GnarlOak.prototype.assignMobValues("Gnarl oak", GnarlOak.prototype);
GnarlOak.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillGnarls.taskID;
GnarlOak.prototype.dropList = [
    require('./../../../pickups/PickupRedcap'),
    require('./../../../pickups/PickupGreencap'),
    require('./../../../pickups/PickupOakLogs'),
    require('./../../../pickups/PickupIronArrows'),
    require('./../../../pickups/PickupOakBow'),
];