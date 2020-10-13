
const Sprite = function (x, y, config) {

    this.activeStateFrame = 'dungeon-portal';
    this.inactiveStateFrame = 'dungeon-portal-inactive';

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

Sprite.prototype.onMove = function () {
    _this.tilemap.updateDarknessGrid();
};

Sprite.prototype.defaultLightDistance = 6;
Sprite.prototype.lightDistance = 6;

export default Sprite;