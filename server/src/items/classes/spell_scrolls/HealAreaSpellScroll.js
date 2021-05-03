const SpellScroll = require("./SpellScroll");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Heal = require("../../../gameplay/Heal");

class HealAreaSpellScroll extends SpellScroll {
    onUsed() {
        this.getBoardTilesInRange(1).forEach((boardTile) => {
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
