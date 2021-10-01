const Item = require("./Item");
const MagicEffects = require("../../gameplay/MagicEffects");

class WardSpellScroll extends Item {
    onUsed() {
        this.owner.board.getTilesInEntityRange(this.owner, 1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Make sure the entity can be warded. Might not be a character.
                if (destroyable.enchantment === undefined) {
                    return;
                }
                new MagicEffects.Ward({ character: destroyable });
            });
        });

        super.onUsed();
    }
}

module.exports = WardSpellScroll;
