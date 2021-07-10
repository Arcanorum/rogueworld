const Item = require("./Item");

class CleanseSpellScroll extends Item {
    onUsed() {
        this.owner.board.getTilesInEntityRange(this.owner, 1).forEach((boardTile) => {
            Object.values(boardTile.destroyables).forEach((destroyable) => {
                // Make sure the entity can be cursed. Might not be a character.
                if (!destroyable.curse) return;

                destroyable.curse.remove();
            });
        });

        super.onUsed();
    }
}

module.exports = CleanseSpellScroll;
