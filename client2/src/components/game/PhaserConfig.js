import Phaser from "phaser";
import Boot from "../../game/Boot";
import Game from "../../game/Game";

/**
 * @type {Phaser.Scene}
 * A global reference to the currently running Phaser scene.
 */
window.gameScene = {};

export default () => {
    // console.log("creating new game instance");
    const config = {
        type: Phaser.WEBGL,
        parent: "game-canvas",
        width: 100,
        height: 100,
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            fullscreenTarget: "game-cont",
        },
        scene: [
            Boot,
            Game,
        ],
    };

    return new Phaser.Game(config);
};
