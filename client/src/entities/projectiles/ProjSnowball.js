
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'proj-snowball-1');

    this.centered = true;

    this.scale.setTo(GAME_SCALE);

    this.animations.add('spin', ['proj-snowball-1', 'proj-snowball-2'], 5, true);

    this.animations.play('spin');
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;