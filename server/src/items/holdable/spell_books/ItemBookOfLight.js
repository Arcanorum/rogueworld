
const SpellBook = require('./SpellBook');

class ItemBookOfLight extends SpellBook {

    // Heal area.
    spell1() {
        const range = 1;
        const rangePlusOne = range + 1;
        let row = this.owner.row,
            col = this.owner.col,
            rowOffset,
            colOffset,
            board = this.owner.board,
            boardTile;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (board.grid[row + rowOffset] === undefined) continue;
                boardTile = board.grid[row + rowOffset][col + colOffset];
                // Check col is valid.
                if (boardTile === undefined) continue;
                // Heal all nearby things that have HP.
                for (let entityKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(entityKey) === false) continue;

                    if (boardTile.destroyables[entityKey].modHitPoints === undefined) continue;

                    boardTile.destroyables[entityKey].heal(new Heal(
                        ModHitPointConfigs.BookOfLightHealArea.healAmount
                    ));
                }
            }
        }
    }

    // Ward.
    spell2() {
        const range = 1;
        const rangePlusOne = range + 1;
        let row = this.owner.row,
            col = this.owner.col,
            rowOffset,
            colOffset,
            board = this.owner.board,
            boardTile;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (board.grid[row + rowOffset] === undefined) continue;
                boardTile = board.grid[row + rowOffset][col + colOffset];
                // Check col is valid.
                if (boardTile === undefined) continue;
                // Give all nearby characters a ward.
                for (let dynamicKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(dynamicKey) === false) continue;

                    // Make sure the entity can be warded. Might not be a character.
                    if (boardTile.destroyables[dynamicKey].enchantment === undefined) continue;

                    new this.MagicEffects.Ward(boardTile.destroyables[dynamicKey]);
                }
            }
        }
    }

    // Cleanse.
    spell3() {
        const range = 1;
        const rangePlusOne = range + 1;
        let row = this.owner.row,
            col = this.owner.col,
            rowOffset,
            colOffset,
            board = this.owner.board,
            boardTile;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (board.grid[row + rowOffset] === undefined) continue;
                boardTile = board.grid[row + rowOffset][col + colOffset];
                // Check col is valid.
                if (boardTile === undefined) continue;
                // Remove curses from all nearby characters.
                for (let dynamicKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(dynamicKey) === false) continue;

                    if (boardTile.destroyables[dynamicKey].curse === null) continue;
                    // Make sure the entity can be cursed. Might not be a character.
                    if (boardTile.destroyables[dynamicKey].curse === undefined) continue;

                    boardTile.destroyables[dynamicKey].curse.remove();
                }
            }
        }
    }

    // Pacify.
    spell4(config) {
        new ProjPacify({ row: config.row, col: config.col, board: config.board, direction: config.direction, source: config.source }).emitToNearbyPlayers();
    }

}
module.exports = ItemBookOfLight;

const ProjPacify = require('../../../entities/destroyables/movables/projectiles/ProjPacify');
const ModHitPointConfigs = require('../../../gameplay/ModHitPointConfigs');
const Heal = require('../../../gameplay/Heal');

ItemBookOfLight.prototype.registerItemType();
ItemBookOfLight.prototype.idName = "Book of light";
ItemBookOfLight.prototype.iconSource = "icon-book-of-light";
ItemBookOfLight.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupBookOfLight');
ItemBookOfLight.prototype.baseValue = 10;
ItemBookOfLight.prototype.baseDurability = 30;
ItemBookOfLight.prototype.expGivenStatName = ItemBookOfLight.prototype.StatNames.Magic;
ItemBookOfLight.prototype.expGivenOnUse = 10;
ItemBookOfLight.prototype.useDurabilityCost = 1;

// Spell specific stuff.
ItemBookOfLight.prototype.registerSpellBookType();
ItemBookOfLight.prototype.spell1IdName = "Heal area";
ItemBookOfLight.prototype.spell2IdName = "Ward";
ItemBookOfLight.prototype.spell3IdName = "Cleanse";
ItemBookOfLight.prototype.spell4IdName = "Pacify";
ItemBookOfLight.prototype.spell1IconSource = "heal-area";
ItemBookOfLight.prototype.spell2IconSource = "ward";
ItemBookOfLight.prototype.spell3IconSource = "cleanse";
ItemBookOfLight.prototype.spell4IconSource = "pacify";