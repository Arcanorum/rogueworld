const SpellBook = require("./SpellBook");
const ProjDeathbind = require("../../../entities/destroyables/movables/projectiles/ProjDeathbind");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Heal = require("../../../gameplay/Heal");

class BookOfSouls extends SpellBook {

    /**
     * Enthrall
     */
    spell1() {
        // For every adjacent unclaimed zombie.
        const
            range = 1,
            rangePlusOne = range + 1;
        let
            row = this.owner.row,
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
                // Claim all nearby unclaimed zombies.
                for (let entityKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(entityKey) === false) continue;

                    if (boardTile.destroyables[entityKey] instanceof this.EntitiesList.Zombie === false) continue;

                    if (boardTile.destroyables[entityKey].master !== null) continue;

                    boardTile.destroyables[entityKey].master = this.owner;
                    boardTile.destroyables[entityKey].faction = this.owner.faction;

                    // If the zombie was targeting this player, make them stop.
                    if (boardTile.destroyables[entityKey].target === this.owner) {
                        boardTile.destroyables[entityKey].target = null;
                    }

                }
            }
        }
    }

    /**
     * Consume
     */
    spell2(config) {
        const boardTile = config.board.grid[config.row][config.col];

        // For every destroyable on that tile.
        for (let entityKey in boardTile.destroyables) {
            if (boardTile.destroyables.hasOwnProperty(entityKey) === false) continue;

            if (boardTile.destroyables[entityKey] instanceof this.EntitiesList.Zombie === false) continue;

            if (boardTile.destroyables[entityKey].master === this.owner) {
                // Consume the minion.
                boardTile.destroyables[entityKey].destroy();
                this.owner.heal(new Heal(ModHitPointConfigs.BookOfSoulsConsume.healAmount));
                return;
            }
        }
    }

    /**
     * Reanimate
     */
    spell3(config) {
        // For every adjacent corpse entity.
        const
            range = 1,
            rangePlusOne = range + 1;
        let
            row = this.owner.row,
            col = this.owner.col,
            rowOffset,
            colOffset,
            board = this.owner.board,
            boardTile,
            /** @type {Corpse} */
            dynamic,
            /** @type {Zombie} */
            zombie;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (board.grid[row + rowOffset] === undefined) continue;
                boardTile = board.grid[row + rowOffset][col + colOffset];
                // Check col is valid.
                if (boardTile === undefined) continue;
                // Turn all corpses into zombies of their zombie type.
                for (let entityKey in boardTile.destroyables) {
                    if (boardTile.destroyables.hasOwnProperty(entityKey) === false) continue;
                    dynamic = boardTile.destroyables[entityKey];
                    // Skip anything that isn't a corpse.
                    if (dynamic instanceof this.EntitiesList.Corpse === false) continue;
                    // Create the zombie.
                    zombie = new dynamic.ZombieType({ row: dynamic.row, col: dynamic.col, board: dynamic.board }).emitToNearbyPlayers();
                    // Make the zombie follow the player.
                    zombie.master = this.owner;
                    zombie.faction = this.owner.faction;
                    // Remove the corpse.
                    dynamic.destroy();
                }
            }
        }
    }

    /**
     * Deathbind
     */
    spell4(config) {
        new ProjDeathbind({
            row: config.row,
            col: config.col,
            board: config.board,
            direction: config.direction,
            source: config.source
        }).emitToNearbyPlayers();
    }

}

BookOfSouls.translationID = "Book of souls";
BookOfSouls.iconSource = "icon-book-of-souls";
BookOfSouls.prototype.baseDurability = 30;
BookOfSouls.prototype.expGivenStatName = BookOfSouls.prototype.StatNames.Magic;
BookOfSouls.prototype.expGivenOnUse = 10;
BookOfSouls.prototype.useDurabilityCost = 1;

// Spell specific stuff.
BookOfSouls.prototype.registerSpellBookType();
BookOfSouls.prototype.spell1IdName = "Enthrall";
BookOfSouls.prototype.spell2IdName = "Consume";
BookOfSouls.prototype.spell3IdName = "Reanimate";
BookOfSouls.prototype.spell4IdName = "Deathbind";
BookOfSouls.prototype.spell1IconSource = "enthrall";
BookOfSouls.prototype.spell2IconSource = "consume";
BookOfSouls.prototype.spell3IconSource = "reanimate";
BookOfSouls.prototype.spell4IconSource = "deathbind";

module.exports = BookOfSouls;