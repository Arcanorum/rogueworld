
const Sprite = function (x, y, config) {
    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', 'proj-noctis-dagger');

    this.centered = true;

    this.angle = this.directionAngles[config.direction] || this.directionAngles.l;
    this.setScale(GAME_SCALE);
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.directionAngles = {
    u: 45 + 270,
    d: 45 + 90,
    l: 45 + 180,
    r: 45
};

module.exports = Sprite;