const SpellScroll = require("./SpellScroll");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Heal = require("../../../gameplay/Heal");

class HealSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Heal!");

        this.getBoardTilesInRange(1).forEach(function(boardTile){
            Object.values(boardTile.destroyables).forEach(function(destroyable){
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

module.exports = HealSpellScroll;
