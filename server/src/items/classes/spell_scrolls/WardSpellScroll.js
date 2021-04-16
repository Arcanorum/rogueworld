const SpellScroll = require("./SpellScroll");

class WardSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Ward!");
        const me = this;

        this.getBoardTilesInRange(1).forEach(function(boardTile){
            Object.values(boardTile.destroyables).forEach(function(destroyable){
                // Make sure the entity can be warded. Might not be a character.
                if (destroyable.enchantment === undefined){
                    return;
                }
                new me.MagicEffects.Ward(destroyable);
            });
        });

        super.onUsed();
    }
}

// Give this spell scrolls easy access to the list of magic effects.
WardSpellScroll.prototype.MagicEffects = require("../../../gameplay/MagicEffects");

module.exports = WardSpellScroll;
