import gameConfig from "../../../shared/GameConfig";
import dungeonz from "../../../shared/Global";
import Sprite from "../Sprite";

class Projectile extends Sprite {
    constructor(x, y, config, frameName) {
        super(x, y, config);

        this.setFrame(frameName || `${this.frameName}`);
        this.setScale(gameConfig.GAME_SCALE * this.scaleModifier);

        this.angle = this.directionAngleSet[config.direction] || this.directionAngleSet.l;

        if (this.spinDuration) {
            dungeonz.gameScene.tweens.add({
                targets: this,
                angle: this.angle + 360,
                duration: 1000,
                repeat: -1,
            });
        }

        this.moveRate = config.moveRate;
    }

    setDirection(direction) {
        this.angle = this.directionAngleSet[direction] || this.directionAngleSet.l;
    }
}

Projectile.prototype.frameName = "";

Projectile.prototype.scaleModifier = 1;

Projectile.prototype.centered = true;

Projectile.prototype.CardinalDirectionAngles = {
    u: 270,
    d: 90,
    l: 180,
    r: 360, // Use 360 here as 0 would be falsy when checking the direction.
};

Projectile.prototype.DiagonalDirectionAngles = {
    u: Projectile.prototype.CardinalDirectionAngles.u + 45,
    d: Projectile.prototype.CardinalDirectionAngles.d + 45,
    l: Projectile.prototype.CardinalDirectionAngles.l + 45,
    r: Projectile.prototype.CardinalDirectionAngles.r + 45,
};

Projectile.prototype.directionAngleSet = Projectile.prototype.DiagonalDirectionAngles;

/**
 * How long this projectile will take to complete a rotation.
 * When set, makes the projectile continuously rotate around it's center.
 * @type {Number}
 */
Projectile.prototype.spinDuration = 0;

export default Projectile;
