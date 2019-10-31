
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'proj-wind');

    this.centered = true;

    this.angle = this.directionAngles[config.direction] || this.directionAngles.l;
    this.scale.setTo(GAME_SCALE);
    this.alpha = 0.5;
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.directionAngles = {
    u: 270,
    d: 90,
    l: 180,
    r: 360
};

export default Sprite;