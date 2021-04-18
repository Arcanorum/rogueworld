const Mod = require("./Mod");
const Item = require("../Item");

class WeightDecreaseMod extends Mod {
    onUsed() {
        super.onUsed();
    }

    applyModToClothing() {
        this.applyTo(this.owner.clothing);
        this.owner.modClothing(null);// unequip
    }

    applyModToHolding() {
        this.applyTo(this.owner.holding);
        this.owner.modHolding(null);// unequip
    }

    /**
     * @param {Item} item
     */
    applyTo(item) {
        item.modWeightReduce(10);
    }
}

module.exports = WeightDecreaseMod;
