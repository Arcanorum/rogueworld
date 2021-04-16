const Item = require("../Item");

class SpellScroll extends Item {
    onUsed() {
        console.log("SpellScroll used")
        super.onUsed();
    }
    
    getBoardTilesInRange(inputRange, fnApplyToBoardTile) {
        const { 
                row,
                col,
                board,
            } = this.owner;

        const range = this.validateRange(inputRange);
        const rangePlusOne = range + 1        
        let rowOffset;
        let colOffset;        
        let boardTile;
        let tiles = [];
       
        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (board.grid[row + rowOffset] === undefined) continue;
                boardTile = board.grid[row + rowOffset][col + colOffset];
                // Check col is valid.
                if (boardTile === undefined) continue;
                tiles.push(boardTile);
            }
        }
        return tiles;
    }

    validateRange(inputRange) {
        //make sure that range is positive integer and 1 <= range <= 9
        inputRange = Math.max(1,Math.abs(inputRange) >> 0);
        inputRange = Math.min(9, inputRange)
        return inputRange;
    }

}


SpellScroll.abstract = true;

module.exports = SpellScroll;
