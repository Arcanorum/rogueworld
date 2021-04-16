const SpellScroll = require("./SpellScroll");
const ProjPacify = require("../../../entities/classes/destroyables/movables/projectiles/ProjPacify");

class PacifySpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Pacify!");

        const { row,
              col,
              board,
            } = this.owner;

        const config = {
            row: row,
            col: col,
            board: board,
            source: this.owner,
            direction: this.owner.direction,
        };

        new ProjPacify(config).emitToNearbyPlayers();
        super.onUsed();
    }
}

module.exports = PacifySpellScroll;