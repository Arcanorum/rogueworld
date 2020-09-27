
const Sprite = function (x, y, config) {
    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', 'proj-deathbind');

    this.centered = true;

    this.angle = this.directionAngles[config.direction] || this.directionAngles.l;
    this.setScale(GAME_SCALE);
    this.alpha = 0.9;
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.directionAngles = {
    u: 270,
    d: 90,
    l: 180,
    r: 360
};

module.exports = Sprite;