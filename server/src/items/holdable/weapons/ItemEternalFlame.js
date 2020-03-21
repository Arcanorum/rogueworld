
const Weapon = require('./Weapon');

class ItemEternalFlame extends Weapon {

    onUsed (direction) {
        // Get the tile next to the user, in the direction they used this item in.
        const targetPosition = this.owner.board.getRowColInFront(direction, this.owner.row, this.owner.col);
        // Get the positions to the sides of that position.
        const sidePositions = this.owner.board.getRowColsToSides(direction, targetPosition.row, targetPosition.col);
        // Make some more wind projectiles in the same direction, at those positions.
        sidePositions.forEach((position) => {
            new ProjectileType({
                row: position.row,
                col: position.col,
                board: this.owner.board,
                source: this.owner.source,
                direction: direction
            }).emitToNearbyPlayers();
        });

        super.onUsed(direction);
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemEternalFlame;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjSuperFire');

ItemEternalFlame.prototype.registerItemType();
ItemEternalFlame.prototype.idName = "Eternal Flame";
ItemEternalFlame.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupEternalFlame');
ItemEternalFlame.prototype.ProjectileType = ProjectileType;
ItemEternalFlame.prototype.useGloryCost = 10;
ItemEternalFlame.prototype.iconSource = "icon-super-fire-staff";
ItemEternalFlame.prototype.category = Weapon.prototype.categories.Weapon;
ItemEternalFlame.prototype.expGivenStatName = ItemEternalFlame.prototype.StatNames.Magic;