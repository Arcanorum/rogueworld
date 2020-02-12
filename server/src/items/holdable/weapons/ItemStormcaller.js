
const Weapon = require('./Weapon');

class ItemStormcaller extends Weapon {
    
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
module.exports = ItemStormcaller;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjSuperWind');

ItemStormcaller.prototype.registerItemType();
ItemStormcaller.prototype.idName = "Stormcaller";
ItemStormcaller.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupStormcaller');
ItemStormcaller.prototype.ProjectileType = ProjectileType;
ItemStormcaller.prototype.useGloryCost = 0;
ItemStormcaller.prototype.iconSource = "icon-super-wind-staff";
ItemStormcaller.prototype.category = Weapon.prototype.categories.Weapon;
ItemStormcaller.prototype.expGivenStatName = ItemStormcaller.prototype.StatNames.Magic;