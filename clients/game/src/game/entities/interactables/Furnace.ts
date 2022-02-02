// const Sprite = function (x, y, config) {
//     Phaser.GameObjects.Sprite.call(this, dungeonz.gameScene, x, y, "game-atlas", "furnace");
//     this.setScale(GAME_SCALE);

//     this.stationTypeNumber = config.typeNumber;

//     this.interactable = true;
//     this.addDamageMarker();
// };

// Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
// Sprite.prototype.constructor = Sprite;

// Sprite.prototype.interactedByPlayer = function () {
//     dungeonz.gameScene.craftingManager.stationTypeNumber = this.stationTypeNumber;
//     dungeonz.gameScene.GUI.craftingPanel.show(dungeonz.getTextDef("Furnace"), "assets/img/gui/panels/furnace.png");
// };

// Sprite.prototype.onMove = function () {
//     dungeonz.gameScene.tilemap.updateDarknessGrid();
// };

// Sprite.prototype.lightDistance = 4;

// export default Sprite;
