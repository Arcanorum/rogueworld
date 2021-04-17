const SpellScroll = require("./SpellScroll");

class EnthrallSpellScroll extends SpellScroll {
    onUsed() {
        this.getBoardTilesInRange(1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Claim all nearby unclaimed zombies.
                if (destroyable instanceof this.EntitiesList.AbstractClasses.Zombie === false) {
                    return;
                }

                if (destroyable.master !== null) return;

                destroyable.master = this.owner;
                destroyable.faction = this.owner.faction;

                // If the zombie was targeting this player, make them stop.
                if (destroyable.target === this.owner) {
                    destroyable.target = null;
                }
            });
        });

        super.onUsed();
    }
}

module.exports = EnthrallSpellScroll;
