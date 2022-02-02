// const Sprite = function (x, y, config) {
//     this.activeStateFrame = "dungeon-portal";
//     this.inactiveStateFrame = "dungeon-portal-inactive";

//     Phaser.GameObjects.Sprite.call(this, dungeonz.gameScene, x, y, "game-atlas", this.activeStateFrame);

//     if (config.activeState === true) {
//         this.setFrame(this.activeStateFrame);
//     } else {
//         this.setFrame(this.inactiveStateFrame);
//     }

//     this.setScale(GAME_SCALE);
// };

// Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
// Sprite.prototype.constructor = Sprite;

// Sprite.prototype.onMove = function () {
//     dungeonz.gameScene.tilemap.updateDarknessGrid();
// };

// Sprite.prototype.lightDistance = 6;

// export default Sprite;
