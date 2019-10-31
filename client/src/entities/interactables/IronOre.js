
const Sprite = function (x, y, config) {

    //console.log("GoldOre const: ", x, y, config);

    this.activeStateFrame = 'ore-iron';
    this.inactiveStateFrame = 'ore-inactive';

    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', this.activeStateFrame);

    if(config.activeState === true){
        this.frameName = this.activeStateFrame;
    }
    else {
        this.frameName = this.inactiveStateFrame;
    }

    this.scale.setTo(GAME_SCALE);

};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;