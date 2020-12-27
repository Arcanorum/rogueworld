// const Sprite = function (x, y, config) {
//     Phaser.GameObjects.Sprite.call(this, window.gameScene, x, y, "game-atlas", "workbench");
//     this.setScale(GAME_SCALE);

//     this.stationTypeNumber = config.typeNumber;

//     this.interactable = true;
//     this.addDamageMarker();
// };

// Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
// Sprite.prototype.constructor = Sprite;

// Sprite.prototype.interactedByPlayer = function () {
//     window.gameScene.craftingManager.stationTypeNumber = this.stationTypeNumber;
//     window.gameScene.GUI.craftingPanel.show(dungeonz.getTextDef("Workbench"), "assets/img/gui/panels/workbench.png");
// };

// export default Sprite;
