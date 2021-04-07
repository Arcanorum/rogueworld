const Projectile = require("./Projectile");

class ProjHammerOfGlory extends Projectile {
    handleCollision(collidee) {
        // Push back any characters the are adjacent to the collidee.
        this.pushAllInDirection(1, 0);
        this.pushAllInDirection(-1, 0);
        this.pushAllInDirection(0, -1);
        this.pushAllInDirection(0, 1);

        this.pushBackCollidee(collidee, 3);

        this.damageCollidee(collidee);
    }

    pushAllInDirection(rowOffset, colOffset) {
        Object.values(
            this.board.grid[this.row + rowOffset][this.col + colOffset].destroyables,
        ).forEach((entity) => {
            if (entity === this.source) return;
            if (entity.push) entity.push(rowOffset, colOffset);
        });
    }
}
module.exports = ProjHammerOfGlory;

ProjHammerOfGlory.prototype.assignModHitPointConfigs();
ProjHammerOfGlory.prototype.moveRate = 200;
ProjHammerOfGlory.prototype.range = 2;
ProjHammerOfGlory.prototype.collisionType = ProjHammerOfGlory.prototype.CollisionTypes.Melee;
