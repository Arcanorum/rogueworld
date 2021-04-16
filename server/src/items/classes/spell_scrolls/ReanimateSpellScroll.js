const SpellScroll = require("./SpellScroll");

class ReanimateSpellScroll extends SpellScroll {
    onUsed() {
        this.getBoardTilesInRange(1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Turn all corpses into zombies of their zombie type.
                // Skip anything that isn't a corpse.
                if (destroyable instanceof this.EntitiesList.AbstractClasses.Corpse === false) {
                    return;
                }
                // Create the zombie.
                const config = {
                    row: destroyable.row,
                    col: destroyable.col,
                    board: destroyable.board,
                };
                const zombie = new destroyable.ZombieType(config).emitToNearbyPlayers();
                // Make the zombie follow the player.
                zombie.master = this.owner;
                zombie.faction = this.owner.faction;
                // Remove the corpse.
                destroyable.destroy();
            });
        });

        super.onUsed();
    }
}

module.exports = ReanimateSpellScroll;
