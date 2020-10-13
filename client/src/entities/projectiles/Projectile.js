class Projectile extends Phaser.GameObjects.Sprite {
    constructor(x, y, config, frameName) {
        super(_this, x, y, "game-atlas", frameName);
        _this.add.existing(this);
        this.setScale(GAME_SCALE);
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

export default Projectile;