const Item = require("./Item");
const ProjPacify = require("../../entities/classes/destroyables/movables/projectiles/ProjPacify");

class PacifySpellScroll extends Item {
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

        new ProjPacify(config).emitToNearbyPlayers();

        super.onUsed();
    }
}

module.exports = PacifySpellScroll;
