
const Sprite = function (x, y, config) {

    this.activeStateFrame = 'small-iron-candle';
    this.inactiveStateFrame = 'small-iron-candle-inactive';

    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', this.activeStateFrame);

    if(config.activeState === true){
        this.frameName = this.activeStateFrame;
    }
    else {
        this.frameName = this.inactiveStateFrame;
        this.lightDistance = 0;
    }

    this.scale.setTo(GAME_SCALE);

};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onMove = function () {
    _this.tilemap.updateDarknessGrid();
};

Sprite.prototype.defaultLightDistance = 8;
Sprite.prototype.lightDistance = 8;

export default Sprite;