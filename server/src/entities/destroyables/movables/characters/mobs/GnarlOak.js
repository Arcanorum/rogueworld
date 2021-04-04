const Mob = require("./Mob");

class GnarlOak extends Mob {
    /**
     * Prevent gnarls from ever being moved.
     */
    move() {}
}
module.exports = GnarlOak;

GnarlOak.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillGnarls.taskId;
