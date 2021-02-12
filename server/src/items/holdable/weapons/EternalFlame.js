const Weapon = require("./Weapon");
const ProjectileType = require("../../../entities/destroyables/movables/projectiles/ProjSuperFire");

class EternalFlame extends Weapon {
    onUsed(direction) {
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
                direction,
            }).emitToNearbyPlayers();
        });

        super.onUsed(direction);
    }
}

EternalFlame.translationID = "Eternal Flame";
EternalFlame.iconSource = "icon-super-fire-staff";
EternalFlame.prototype.ProjectileType = ProjectileType;
EternalFlame.prototype.useGloryCost = 10;
EternalFlame.prototype.category = Weapon.prototype.categories.Weapon;
EternalFlame.prototype.expGivenStatName = EternalFlame.prototype.StatNames.Magic;
EternalFlame.prototype.canUseIntoHighBlockedTile = false;

module.exports = EternalFlame;
