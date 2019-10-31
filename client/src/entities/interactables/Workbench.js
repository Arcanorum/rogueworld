
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'workbench');
    this.scale.setTo(GAME_SCALE);

    this.stationTypeNumber = config.typeNumber;

    this.pseudoInteractable = true;
    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
    _this.GUI.craftingPanel.show(dungeonz.getTextDef("Workbench"), 'assets/img/gui/panels/workbench.png');
};

export default Sprite;