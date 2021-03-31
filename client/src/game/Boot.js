import Phaser from "phaser";
import gameConfig from "../shared/GameConfig";
import Utils from "../shared/Utils";
import SoundManager from "./SoundManager";
import gameAtlasImage from "../assets/images/game-atlas.png";
import gameAtlasData from "../assets/images/game-atlas.json";
import groundTileset from "../assets/images/ground.png";
import staticsTileset from "../assets/images/statics.png";
import highlightImage from "../assets/images/gui/highlight.png";
import dungeonz from "../shared/Global";

const audioAssetPaths = SoundManager.getAudioAssetPaths();

class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        Utils.message("Boot preload");

        // Graphics.
        this.load.image("highlight", highlightImage);
        this.load.atlas("game-atlas", gameAtlasImage, gameAtlasData);
        this.load.spritesheet("ground-tileset", groundTileset, {
            frameWidth: 16,
            frameHeight: 16,
            margin: 1,
            spacing: 2,
        });
        this.load.spritesheet("statics-tileset", staticsTileset, {
            frameWidth: 16,
            frameHeight: 16,
            margin: 1,
            spacing: 2,
        });

        Object.entries(audioAssetPaths).forEach(([name, paths]) => {
            this.load.audio(name, paths);
        });
    }

    create() {
        Utils.message("Boot create");

        dungeonz.gameScene = this;

        // Keep the game running even when the window loses focus.
        this.events.on("hidden", () => {
            Utils.message("hidden");
        }, this);

        this.events.on("visible", () => {
            Utils.message("visible");
        }, this);

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        // TODO: Need to clean this up. in this scene, or in game scene destroy event?
        document.addEventListener("click", () => {
            // console.log("click");
            window.focus();
        }, false);

        // If not on desktop, enable the virtual D-pad.
        gameConfig.virtualDPadEnabled = !dungeonz.gameScene.sys.game.device.os.desktop;

        if (dungeonz.devMode === false) {
            // Disable the right click context menu on the game in prod.
            document.getElementById("game-cont").addEventListener("contextmenu", (event) => event.preventDefault());
        }

        // Start the game state.
        this.scene.start("Game", true, false);
    }
}

export default Boot;
