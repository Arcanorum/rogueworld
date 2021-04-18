const Item = require("../Item");

class Mod extends Item {
    use() {
        super.use();
    }

    onUsed() {
        if (this.owner === null) {
            return;
        }

        const { clothing, holding } = this.owner;
        if (clothing !== null && holding !== null) {
            return;
        }
        if (clothing !== null) {
            this.applyModToClothing();
            super.onUsed();
            return;
        }
        if (holding !== null) {
            this.applyModToHolding();
            super.onUsed();
        }
    }

    applyModToClothing() {

    }

    applyModToHolding() {

    }
}

Mod.abstract = true;
Mod.prototype.expGivenOnUse = 15;
Mod.prototype.expGivenStatName = Mod.prototype.StatNames.Magic;
module.exports = Mod;
