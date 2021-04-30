const Utils = require("../../../../Utils");
const Holdable = require("../Holdable");
const EntitiesList = require("../../../../entities/EntitiesList");

class Weapon extends Holdable {
    static loadConfig(config) {
        // Some weapon types don't need to have a preset projectile type, as they decide that later
        // for themselves (i.e. bows use the equipped arrow type when used).
        if (config.ProjectileType) {
            this.prototype.ProjectileType = EntitiesList[config.ProjectileType];

            if (!this.prototype.ProjectileType) {
                Utils.error(`Loading weapon config. Invalid projectile type name "${config.ProjectileType}" for configured item "${config.name}". Type to use must be in the entities list.`);
            }
        }

        super.loadConfig(config);
    }

    checkUseCriteria(direction) {
        const { owner } = this;

        const front = owner.board.getRowColInFront(
            direction || owner.direction,
            owner.row, owner.col,
        );

        if (this.canUseIntoHighBlockedTile === false) {
            // Check if the tile in front is high blocked.
            if (owner.board.grid[front.row][front.col].isHighBlocked() === true) return false;
        }

        return super.checkUseCriteria(direction);
    }

    /**
     * Use this weapon. Typically creates a projectile.
     * @param {String} direction - A specific direction to use the item in. Otherwise uses the owner's direction.
     */
    onUsedWhileHeld(direction) {
        const { owner } = this;

        const front = owner.board.getRowColInFront(
            direction || owner.direction,
            owner.row, owner.col,
        );

        new this.ProjectileType({
            row: front.row,
            col: front.col,
            board: owner.board,
            direction: direction || owner.direction,
            source: this.owner,
        }).emitToNearbyPlayers({});

        super.onUsedWhileHeld(direction || owner.direction);
    }
}

module.exports = Weapon;

Weapon.abstract = true;

/**
 * The type of entity to be added to the board when a weapon is used that created this projectile. The class itself, NOT an instance of it.
 * @type {Function}
 */
Weapon.prototype.ProjectileType = `Weapon projectile entity type not set.${Weapon.prototype.name}`;

Weapon.prototype.expGivenOnUse = 5;

/**
 * Whether this weapon can be used while directly in front of a high blocking static.
 * Used to prevent certain projectiles that create other projectiles (such as super fire staff) from
 * having them go through to the other side of the static.
 * @type {Boolean}
 * @default true
 */
Weapon.prototype.canUseIntoHighBlockedTile = true;
