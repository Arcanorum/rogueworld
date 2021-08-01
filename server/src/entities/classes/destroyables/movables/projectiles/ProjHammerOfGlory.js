const Projectile = require("./Projectile");
const StatusEffects = require("../../../../../gameplay/StatusEffects");

class ProjHammerOfGlory extends Projectile {
    handleCollision(collidee) {
        // Damage the collidee and apply broken bones to all characters around them.
        this.applyBrokenBonesInDirection(0, 0);
        this.applyBrokenBonesInDirection(1, 0);
        this.applyBrokenBonesInDirection(-1, 0);
        this.applyBrokenBonesInDirection(0, -1);
        this.applyBrokenBonesInDirection(0, 1);

        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }

    applyBrokenBonesInDirection(rowOffset, colOffset) {
        Object.values(
            this.board.grid[this.row + rowOffset][this.col + colOffset].destroyables,
        ).forEach((entity) => {
            // Don't affect the user.
            if (entity === this.source) return;

            // If it can have status effects, apply broken bones.
            if (entity.statusEffects !== undefined) {
                entity.addStatusEffect(StatusEffects.BrokenBones, this.source);
            }
        });
    }
}
module.exports = ProjHammerOfGlory;
