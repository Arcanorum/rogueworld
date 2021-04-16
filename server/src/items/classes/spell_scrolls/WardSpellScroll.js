const SpellScroll = require("./SpellScroll");
const MagicEffects = require("../../../gameplay/MagicEffects");
class WardSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Ward!");
        
        this.getBoardTilesInRange(1).forEach(function(boardTile){
            Object.values(boardTile.destroyables).forEach(function(destroyable){
                // Make sure the entity can be warded. Might not be a character.
                if (destroyable.enchantment === undefined){
                    return;
                }
                new MagicEffects.Ward(destroyable);
            });
        });

        super.onUsed();
    }
}


module.exports = WardSpellScroll;
