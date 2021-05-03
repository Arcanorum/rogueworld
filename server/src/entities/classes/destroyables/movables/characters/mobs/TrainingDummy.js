const Mob = require("./Mob");

class TrainingDummy extends Mob {
    /**
     * Prevent training dummies from ever being moved.
     */
    move() {}

    /**
     * Prevent dummies from ever being turned.
     */
    modDirection() {}
}
module.exports = TrainingDummy;
