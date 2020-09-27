
const Sprite = function (x, y, config) {
    Phaser.GameObjects.Sprite.call(this, _this, x, y, 'game-atlas', 'generator');
    this.setScale(GAME_SCALE);

    this.stationTypeNumber = config.typeNumber;

    this.pseudoInteractable = true;
    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    //_this.GUI.generatorPanel.show();
};

module.exports = Sprite;