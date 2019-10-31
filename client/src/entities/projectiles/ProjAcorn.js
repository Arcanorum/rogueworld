
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'proj-acorn-1');

    this.centered = true;

    this.scale.setTo(GAME_SCALE * 0.6);

    this.animations.add('spin', ['proj-acorn-1', 'proj-acorn-2', 'proj-acorn-3', 'proj-acorn-4'], 5, true);

    this.animations.play('spin');
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;