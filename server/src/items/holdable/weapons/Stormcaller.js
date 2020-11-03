const Weapon = require("./Weapon");
const ProjectileType = require("../../../entities/destroyables/movables/projectiles/ProjSuperWind");

class Stormcaller extends Weapon {
    
    onUsed (direction) {
        // Get the tile next to the user, in the direction they used this item in.
        const targetPosition = this.owner.board.getRowColInFront(direction, this.owner.row, this.owner.col);
        // Get the positions to the sides of that position.
        const sidePositions = this.owner.board.getRowColsToSides(direction, targetPosition.row, targetPosition.col);
        // Make some more projectiles in the same direction, at those positions.
        sidePositions.forEach((position) => {
            new ProjectileType({
                row: position.row,
                col: position.col,
                board: this.owner.board,
                source: this.owner,
                direction: direction
            }).emitToNearbyPlayers();
        });

        super.onUsed(direction);
    }
    
}

Stormcaller.translationID = "Stormcaller";
Stormcaller.iconSource = "icon-super-wind-staff";
Stormcaller.prototype.ProjectileType = ProjectileType;
Stormcaller.prototype.useGloryCost = 10;
Stormcaller.prototype.category = Weapon.prototype.categories.Weapon;
Stormcaller.prototype.expGivenStatName = Stormcaller.prototype.StatNames.Magic;
Stormcaller.prototype.canUseIntoHighBlockedTile = false;

module.exports = Stormcaller;