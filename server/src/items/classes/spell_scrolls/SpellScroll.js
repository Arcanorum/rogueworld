const Item = require("../Item");

class SpellScroll extends Item {
    use() {
        const { owner } = this;
        if (this.useEnergyCost && owner.energy < this.useEnergyCost) return;
        if (this.useGloryCost && owner.glory < this.useGloryCost) return;

        super.use();

        if (this.useEnergyCost) owner.modEnergy(-this.useEnergyCost);
        if (this.useGloryCost) owner.modGlory(-this.useGloryCost);
    }

    onUsed() {
        super.onUsed();
    }

    getBoardTilesInRange(inputRange) {
        return this.owner.board.getTilesInEntityRange(this.owner, inputRange || 1);
    }
}

SpellScroll.abstract = true;
SpellScroll.prototype.expGivenOnUse = 15;
SpellScroll.prototype.expGivenStatName = SpellScroll.prototype.StatNames.Magic;
module.exports = SpellScroll;
