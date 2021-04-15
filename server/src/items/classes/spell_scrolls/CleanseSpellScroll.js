const SpellScroll = require("./SpellScroll");

class CleanseSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Cleanse!");
        const
            range = 1;
        const rangePlusOne = range + 1;
        const
            { row } = this.owner;
        const { col } = this.owner;
        let rowOffset;
        let colOffset;
        const { board } = this.owner;
        let boardTile;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (board.grid[row + rowOffset] === undefined) continue;
                boardTile = board.grid[row + rowOffset][col + colOffset];
                // Check col is valid.
                if (boardTile === undefined) continue;
                // Remove curses from all nearby characters.
                for (const dynamicKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(dynamicKey) === false) continue;

                    if (boardTile.destroyables[dynamicKey].curse === null) continue;
                    // Make sure the entity can be cursed. Might not be a character.
                    if (boardTile.destroyables[dynamicKey].curse === undefined) continue;

                    boardTile.destroyables[dynamicKey].curse.remove();
                }
            }
        }
        super.onUsed();
    }
}

module.exports = CleanseSpellScroll;