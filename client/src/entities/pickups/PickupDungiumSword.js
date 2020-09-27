
const Sprite = function (x, y, config) {
    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', 'pickup-dungium-sword');

    this.setScale(GAME_SCALE);

    this.tweenPickupFromCenter();
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

module.exports = Sprite;