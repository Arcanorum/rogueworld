const Item = require("./Item");
const ModHitPointConfigs = require("../../gameplay/ModHitPointConfigs");
const Heal = require("../../gameplay/Heal");

class HealAreaSpellScroll extends Item {
    onUsed() {
        this.owner.board.getTilesInEntityRange(this.owner, 1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Check if target can have heal applied
                if (destroyable.modHitPoints === undefined) return;

                destroyable.heal(new Heal(
                    ModHitPointConfigs.SpellScrollHealArea.healAmount,
                ));
            });
        });

        super.onUsed();
    }
}

module.exports = HealAreaSpellScroll;
