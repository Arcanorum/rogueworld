const Weapon = require("./Weapon");
const { RowColOffsetsByDirection, OppositeDirections } = require("../../../../gameplay/Directions");

class HammerOfGlory extends Weapon {
    onUsed(direction) {
        super.onUsed(direction);

        const offset = RowColOffsetsByDirection[OppositeDirections[this.owner.direction]];
        // Push the user backward.
        this.owner.push(offset.row, offset.col, 1, false);
    }
}

module.exports = HammerOfGlory;
