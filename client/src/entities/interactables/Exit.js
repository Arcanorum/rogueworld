const Sprite = function (x, y, config) {
    this.activeStateFrame = 'overworld-portal';

    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', this.activeStateFrame);

    this.setScale(GAME_SCALE);
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

module.exports = Sprite;