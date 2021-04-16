const SpellScroll = require("./SpellScroll");
const MagicEffects = require("../../../gameplay/MagicEffects");

class WardSpellScroll extends SpellScroll {
    onUsed() {
        this.getBoardTilesInRange(1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Make sure the entity can be warded. Might not be a character.
                if (destroyable.enchantment === undefined) {
                    return;
                }
                new MagicEffects.Ward(destroyable);
            });
        });

        super.onUsed();
    }
}

module.exports = WardSpellScroll;
