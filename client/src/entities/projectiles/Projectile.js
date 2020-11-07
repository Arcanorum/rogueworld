import Sprite from "../Sprite";

class Projectile extends Sprite {
    constructor(x, y, config, frameName) {
        super(x, y, config);

        this.setFrame(frameName);
        this.setScale(GAME_SCALE);

        this.angle = this.directionAngleSet[config.direction] || this.directionAngleSet.l;
    }

    setDirection(direction) {
        this.angle = this.directionAngleSet[direction] || this.directionAngleSet.l;
    }
}

Projectile.prototype.centered = true;

Projectile.prototype.CardinalDirectionAngles = {
    u: 270,
    d: 90,
    l: 180,
    r: 360 // Use 360 here as 0 would be falsy when checking the direction.
};

Projectile.prototype.DiagonalDirectionAngles = {
    u: Projectile.prototype.CardinalDirectionAngles.u + 45,
    d: Projectile.prototype.CardinalDirectionAngles.d + 45,
    l: Projectile.prototype.CardinalDirectionAngles.l + 45,
    r: Projectile.prototype.CardinalDirectionAngles.r + 45
};

Projectile.prototype.directionAngleSet = Projectile.prototype.DiagonalDirectionAngles;

export default Projectile;