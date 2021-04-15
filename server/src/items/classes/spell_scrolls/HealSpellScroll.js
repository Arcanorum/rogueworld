const SpellScroll = require("./SpellScroll");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Heal = require("../../../gameplay/Heal");

class HealSpellScroll extends SpellScroll {
    onUsed() {
        
        console.log("Heal!");
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
                // Heal all nearby things that have HP.
                for (const entityKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(entityKey) === false) continue;

                    if (boardTile.destroyables[entityKey].modHitPoints === undefined) continue;

                    boardTile.destroyables[entityKey].heal(new Heal(
                        ModHitPointConfigs.BookOfLightHealArea.healAmount,
                    ));
                }
            }
        }
        super.onUsed();
    }
}

module.exports = HealSpellScroll;