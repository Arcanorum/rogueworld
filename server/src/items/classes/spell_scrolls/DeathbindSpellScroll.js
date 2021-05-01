const SpellScroll = require("./SpellScroll");
const ProjDeathbind = require("../../../entities/classes/destroyables/movables/projectiles/ProjDeathbind");

class DeathbindSpellScroll extends SpellScroll {
    onUsed() {
        const config = {
            row: this.owner.row,
            col: this.owner.col,
            board: this.owner.board,
            source: this.owner,
            direction: this.owner.direction,
        };

        new ProjDeathbind(config).emitToNearbyPlayers();

        super.onUsed();
    }
}

module.exports = DeathbindSpellScroll;
