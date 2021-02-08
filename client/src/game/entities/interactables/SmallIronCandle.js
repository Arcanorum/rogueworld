// const Sprite = function (x, y, config) {
//     this.activeStateFrame = "small-iron-candle";
//     this.inactiveStateFrame = "small-iron-candle-inactive";

//     Phaser.GameObjects.Sprite.call(this, window.gameScene, x, y, "game-atlas", this.activeStateFrame);

//     if (config.activeState === true) {
//         this.setFrame(this.activeStateFrame);
//     } else {
//         this.setFrame(this.inactiveStateFrame);
//         this.lightDistance = 0;
//     }

//     this.setScale(GAME_SCALE);
// };

// Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
// Sprite.prototype.constructor = Sprite;

// Sprite.prototype.onMove = function () {
//     window.gameScene.tilemap.updateDarknessGrid();
// };

// Sprite.prototype.lightDistance = 8;

// export default Sprite;
