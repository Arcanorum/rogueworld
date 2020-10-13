
const Sprite = function (x, y, config) {
    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', 'proj-acorn-1');

    this.centered = true;

    this.setScale(GAME_SCALE * 0.6);

    this.animations.add('spin', ['proj-acorn-1', 'proj-acorn-2', 'proj-acorn-3', 'proj-acorn-4'], 5, true);

    this.animations.play('spin');
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;