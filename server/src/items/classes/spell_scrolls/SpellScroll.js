const Item = require("../Item");

class SpellScroll extends Item {
    getBoardTilesInRange(inputRange) {
        return this.owner.board.getTilesInEntityRange(this.owner, inputRange || 1);
    }
}

SpellScroll.abstract = true;
SpellScroll.prototype.expGivenOnUse = 15;
SpellScroll.prototype.expGivenStatName = SpellScroll.prototype.StatNames.Magic;
module.exports = SpellScroll;
