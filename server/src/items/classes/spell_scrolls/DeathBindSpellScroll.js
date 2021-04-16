const SpellScroll = require("./SpellScroll");
const ProjDeathbind = require("../../../entities/classes/destroyables/movables/projectiles/ProjDeathbind");

class DeathBindSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("DeathBind!");

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
        
        new ProjDeathbind(config).emitToNearbyPlayers();
        super.onUsed();
    }
}

module.exports = DeathBindSpellScroll;
