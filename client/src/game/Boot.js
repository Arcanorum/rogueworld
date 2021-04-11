import Phaser from "phaser";
import PubSub from "pubsub-js";
import gameConfig from "../shared/GameConfig";
import Utils from "../shared/Utils";
import SoundManager from "./SoundManager";
import gameAtlasImage from "../assets/images/game-atlas.png";
import gameAtlasData from "../assets/images/game-atlas.json";
import groundTileset from "../assets/images/ground.png";
import staticsTileset from "../assets/images/statics.png";
import highlightImage from "../assets/images/gui/highlight.png";
import dungeonz from "../shared/Global";
import { LOAD_FILE_PROGRESS, LOAD_PROGRESS } from "../shared/EventTypes";
import { GUIState, InventoryState } from "../shared/state/States";

const audioAssetPaths = SoundManager.getAudioAssetPaths();

class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        Utils.message("Boot preload");

        this.load.on("progress", (value) => {
            PubSub.publish(LOAD_PROGRESS, value);
        });

        this.load.on("fileprogress", (file) => {
            PubSub.publish(LOAD_FILE_PROGRESS, file.key);
        });

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

        // Load any previous settings on this device.
        const musicVolume = JSON.parse(localStorage.getItem("music_volume"));
        if (typeof musicVolume === "number") {
            GUIState.musicVolume = musicVolume;
        }

        const effectsVolume = JSON.parse(localStorage.getItem("effects_volume"));
        if (typeof effectsVolume === "number") {
            GUIState.effectsVolume = effectsVolume;
        }

        const guiScale = JSON.parse(localStorage.getItem("gui_scale"));
        if (typeof guiScale === "number") {
            GUIState.guiScale = guiScale;

            const style = Utils.getStyle(".gui-scalable");

            if (style) {
                style.zoom = guiScale / 100;
                style["-moz-transform"] = `scale(${guiScale / 100})`;
            }
        }

        const virtualDPadEnabled = JSON.parse(localStorage.getItem("virtual_d_pad_enabled"));
        if (typeof virtualDPadEnabled === "boolean") {
            GUIState.virtualDPadEnabled = virtualDPadEnabled;
        }
        else {
            // If not on desktop, enable the virtual D-pad.
            GUIState.virtualDPadEnabled = !dungeonz.gameScene.sys.game.device.os.desktop;
        }

        const autoAddToHotbar = JSON.parse(localStorage.getItem("auto_add_to_hotbar"));
        if (typeof autoAddToHotbar === "boolean") {
            InventoryState.autoAddToHotbar = autoAddToHotbar;
        }

        const profanityFilterEnabled = JSON.parse(localStorage.getItem("profanity_filter_enabled"));
        if (typeof profanityFilterEnabled === "boolean") {
            GUIState.profanityFilterEnabled = profanityFilterEnabled;
        }

        const lightFlickerEnabled = JSON.parse(localStorage.getItem("light_flicker_enabled"));
        if (typeof lightFlickerEnabled === "boolean") {
            GUIState.lightFlickerEnabled = lightFlickerEnabled;
        }

        const showFPS = JSON.parse(localStorage.getItem("show_fps"));
        if (typeof showFPS === "boolean") {
            GUIState.showFPS = showFPS;
        }

        if (dungeonz.devMode === false) {
            // Disable the right click context menu on the game in prod.
            document.getElementById("game-cont").addEventListener("contextmenu", (event) => event.preventDefault());
        }

        // Start the game state.
        this.scene.start("Game", true, false);
    }
}

export default Boot;
