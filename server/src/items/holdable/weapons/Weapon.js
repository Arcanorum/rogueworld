
const Holdable = require('../Holdable');

class Weapon extends Holdable {

    /**
     * Use this weapon. Typically creates a projectile.
     * @param {String} direction - A specific direction to use the item in. Otherwise uses the owner's direction.
     */
    useWhileHeld (direction) {
        const owner = this.owner;

        if(owner.energy < this.useEnergyCost) return;
        if(this.useGloryCost && owner.glory < this.useGloryCost) return;

        const front = owner.board.getRowColInFront(direction || owner.direction, owner.row, owner.col);

        if(this.canUseIntoHighBlockedTile === false){
            // Check if the tile in front is high blocked.
            if(this.owner.board.grid[front.row][front.col].isHighBlocked() === true) return;
        }

        new this.ProjectileType({row: front.row, col: front.col, board: owner.board, direction: direction || owner.direction, source: this.owner}).emitToNearbyPlayers({});

        if(this.useEnergyCost) owner.modEnergy(-this.useEnergyCost);
        if(this.useGloryCost) owner.modGlory(-this.useGloryCost);

        // Keep this at the bottom otherwise the item might be broken and destroyed
        // when the durability is updated, so the above stuff will get buggy.
        super.useWhileHeld(direction || owner.direction);
    }

}

/**
 * The type of entity to be added to the board when a weapon is used that created this projectile. The class itself, NOT an instance of it.
 * @type {Function}
 */
Weapon.prototype.ProjectileType = 'Weapon projectile entity type not set.' + Weapon.prototype.name;

Weapon.prototype.expGivenOnUse = 5;

/**
 * Whether this weapon can be used while directly in front of a high blocking static.
 * Used to prevent certain projectiles that create other projectiles (such as super fire staff) from
 * having them go through to the other side of the static.
 * @type {Boolean}
 * @default true
 */
Weapon.prototype.canUseIntoHighBlockedTile = true;

module.exports = Weapon;