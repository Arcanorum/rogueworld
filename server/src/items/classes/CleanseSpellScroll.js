const Item = require("./Item");
const ModHitPointConfigs = require("../../gameplay/ModHitPointConfigs");
const Heal = require("../../gameplay/Heal");

class CleanseSpellScroll extends Item {
    onUsed() {
        this.owner.board.getTilesInEntityRange(this.owner, 1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Make sure the entity can be cursed. Might not be a character.
                if (!destroyable.curse) return;

                destroyable.curse.remove();

                destroyable.heal(new Heal(ModHitPointConfigs.CleanseSpellScroll.healAmount));
            });
        });

        super.onUsed();
    }
}

module.exports = CleanseSpellScroll;
