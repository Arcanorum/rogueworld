
const Sprite = function (x, y, config) {

    this.activeStateFrame = 'wood-door-locked-green';
    this.inactiveStateFrame = 'wood-door-inactive';

    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', this.activeStateFrame);

    if (config.activeState === true) {
        this.setFrame(this.activeStateFrame);
    }
    else {
        this.setFrame(this.inactiveStateFrame);
    }

    this.setScale(GAME_SCALE);

    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

module.exports = Sprite;