
const Sprite = function (x, y, config) {

    this.activeStateFrame = 'overworld-portal';
    this.inactiveStateFrame = 'overworld-portal-inactive';

    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', this.activeStateFrame);

    if (config.activeState === true) {
        this.setFrame(this.activeStateFrame);
    }
    else {
        this.setFrame(this.inactiveStateFrame);
    }

    this.setScale(GAME_SCALE);

};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;