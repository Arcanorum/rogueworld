
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'charter');
    this.scale.setTo(GAME_SCALE);

    this.stationTypeNumber = config.typeNumber;

    this.pseudoInteractable = true;
    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    // If this player isn't in a clan, join the one the charter belongs to.
    if(_this.clanManager.ownRankIndex === null) ws.sendEvent("clan_join");
    // Open the base crafting panel.
    else{
        _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
        _this.GUI.craftingPanel.show(dungeonz.getTextDef("Base"), 'assets/img/gui/panels/clan-structures-icon.png');
    }
};

export default Sprite;