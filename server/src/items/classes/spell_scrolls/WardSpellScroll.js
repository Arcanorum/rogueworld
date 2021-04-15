const SpellScroll = require("./SpellScroll");

class WardSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Ward!");
        const range = 1;
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
                // Give all nearby characters a ward.
                for (const dynamicKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(dynamicKey) === false) continue;

                    // Make sure the entity can be warded. Might not be a character.
                    if (boardTile.destroyables[dynamicKey].enchantment === undefined) continue;

                    new this.MagicEffects.Ward(boardTile.destroyables[dynamicKey]);
                }
            }
        }
        super.onUsed();
    }
}

module.exports = WardSpellScroll;