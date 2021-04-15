const SpellScroll = require("./SpellScroll");
const ProjPacify = require("../../../entities/classes/destroyables/movables/projectiles/ProjPacify");

class PacifySpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Pacify!");

        const
            { row } = this.owner;
        const { col } = this.owner;
        
        const { board } = this.owner;

        const config = {
            row: row,
            col: col,
            board: board,
            source: this.owner,
            direction: this.owner.direction,
        };

        new ProjPacify({
            row: config.row,
            col: config.col,
            board: config.board,
            direction: config.direction,
            source: config.source,
        }).emitToNearbyPlayers();
        super.onUsed();
    }
}

module.exports = PacifySpellScroll;