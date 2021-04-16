const SpellScroll = require("./SpellScroll");

class CleanseSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Cleanse!");
        this.getBoardTilesInRange(1).forEach(function(boardTile){
            Object.values(boardTile.destroyables).forEach(function(destroyable){
                
                if (destroyable.curse === null) return;
                // Make sure the entity can be cursed. Might not be a character.
                if (destroyable.curse === undefined) return;

                destroyable.curse.remove();
            });
        });
        
        super.onUsed();
    }
}

module.exports = CleanseSpellScroll;