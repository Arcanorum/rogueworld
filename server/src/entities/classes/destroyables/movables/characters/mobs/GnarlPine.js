const Mob = require("./Mob");

class GnarlPine extends Mob {
    /**
     * Prevent gnarls from ever being moved.
     */
    move() {}
}
module.exports = GnarlPine;

GnarlPine.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillGnarls.taskId;
