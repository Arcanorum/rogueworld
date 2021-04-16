const SpellScroll = require("./SpellScroll");
const ProjDeathbind = require("../../../entities/classes/destroyables/movables/projectiles/ProjDeathbind");

class DeathBindSpellScroll extends SpellScroll {
    onUsed() {
        const {
            row,
            col,
            board,
        } = this.owner;

        const config = {
            row,
            col,
            board,
            source: this.owner,
            direction: this.owner.direction,
        };

        new ProjDeathbind(config).emitToNearbyPlayers();
        super.onUsed();
    }
}

module.exports = DeathBindSpellScroll;
