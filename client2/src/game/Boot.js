import Phaser from "phaser";
import gameConfig from "../shared/GameConfig";
import Utils from "../shared/Utils";
import gameAtlasImage from "../assets/images/game-atlas.png";
import gameAtlasData from "../assets/images/game-atlas.json";
import groundTileset from "../assets/images/ground.png";
import staticsTileset from "../assets/images/statics.png";

class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        Utils.message("Boot preload");

        // Graphics.
        // this.load.image("highlight", "assets/images/gui/hud/highlight.png");
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

        /**
         * Utility for providing Ogg/MP3 audio assets to the Phaser loader.
         * Safari doesn't support Ogg format files, so MP3 must be provided as a fallback.
         * @param {String} key - What to refer to this asset as later.
         * @param {String} filePath - The URL to the asset, without the file type extension.
         */
        const loadAudio = (key, filePath) => {
            this.load.audio(key, [
                `assets/audio/${filePath}.ogg`,
                `assets/audio/${filePath}.mp3`,
            ]);
        };

        // Audio.
        // loadAudio("player-death-loop", "player/death-loop");
        // loadAudio("footstep-1", "player/footstep-1");
        // loadAudio("footstep-2", "player/footstep-2");
        // loadAudio("footstep-3", "player/footstep-3");
        // loadAudio("footstep-4", "player/footstep-4");
        // loadAudio("generic-theme-1", "locations/generic-theme-1");
        // loadAudio("generic-theme-2", "locations/generic-theme-2");
        // loadAudio("item-dropped", "items/item-dropped");
        // loadAudio("dungeon-key-gained", "items/dungeon-key-gained");
        // loadAudio("weapon-equipped", "items/weapon-equipped");
        // loadAudio("clothing-equipped", "items/clothing-equipped");
    }

    create() {
        Utils.message("Boot create");

        window.gameScene = this;

        // Keep the game running even when the window loses focus.
        this.events.on("hidden", () => {
            console.log("hidden");
        }, this);

        this.events.on("visible", () => {
            console.log("visible");
        }, this);

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        window.addEventListener("click", () => {
            // console.log("click");
            window.focus();
        }, false);

        // If not on desktop, enable the virtual D-pad.
        gameConfig.virtualDPadEnabled = !window.gameScene.sys.game.device.os.desktop;

        if (window.devMove === false) {
            // Disable the right click context menu on the game in prod.
            document.getElementById("game_cont").addEventListener("contextmenu", (event) => event.preventDefault());
        }

        // Start the game state.
        this.scene.start("Game", true, false);
    }
}

export default Boot;
