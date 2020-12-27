// const Sprite = function (x, y, config) {
//     Phaser.GameObjects.Sprite.call(this, window.gameScene, x, y, "game-atlas", "charter");
//     this.setScale(GAME_SCALE);

//     this.stationTypeNumber = config.typeNumber;

//     this.interactable = true;
//     this.addDamageMarker();
// };

// Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
// Sprite.prototype.constructor = Sprite;

// Sprite.prototype.interactedByPlayer = function () {
//     // If this player isn't in a clan, join the one the charter belongs to.
//     if (window.gameScene.clanManager.ownRankIndex === null) ws.sendEvent("clan_join");
//     // Open the base crafting panel.
//     else {
//         window.gameScene.craftingManager.stationTypeNumber = this.stationTypeNumber;
//         window.gameScene.GUI.craftingPanel.show(dungeonz.getTextDef("Base"), "assets/img/gui/panels/clan-structures-icon.png");
//     }
// };

// export default Sprite;
