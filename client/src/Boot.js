import Utils from "./Utils";
import TextDefs from "../src/catalogues/TextDefinitions";
import DungeonPrompts from "../src/catalogues/DungeonPrompts";

/** @type {Phaser.Scene}
 * A global reference to the currently running Phaser scene. */
window._this = {};

/** @type {Object}
 * A factor to scale display objects by. */
window.GAME_SCALE = 4;

/** @type {Object}
 * A global object of things that relate to gameplay. */
window.dungeonz = {
    /** @type {Object}
     * A list of the map data for every map. */
    mapsData: {},
    /** @type {Number}
     * How big in pixels each tile is. */
    TILE_SIZE: 16,
    /** @type {Number}
     * The view range on the client is one less than the view range on the server, so the client can see things leaving the view range. */
    VIEW_RANGE: 15,
    /** @type {Number}
     * The edge to edge view distance. x2 for both sides, and +1 for the middle (where this player is). */
    VIEW_DIAMETER: (1 + 15 * 2),
    /** @type {Number}
     * Minimum amount of time (in ms) for how long any chat messages should stay for. */
    CHAT_BASE_LIFESPAN: 4000,
    /** @type {Number}
     * How fast chat messages float upwards. */
    CHAT_SCROLL_SPEED: 0.3,
    /** @type {String}
     * What language to use from the text defs. */
    language: "English",
    /** @type {Boolean} Whether audio is enabled. */
    audioEnabled: true,
    /** @type {Number}
     * The volume of the audio. 0 is no audio, 100 is full volume. Can't use floats due to imperfect decimal precision. */
    audioLevel: 50,
    /** @type {Number}
     * The current percent zoom level for all elements with the gui_zoomable style class. */
    GUIZoom: 100,
    /** @type {Boolean}
     * Whether the virtual D-pad is enabled. */
    virtualDPadEnabled: false,
    /** @type {Object}
     * The catalogue of text definitions. */
    TextDefs: TextDefs,
    /** @type {Object}
     * The catalogue of dungeon prompt info. Dungeon name, glory cost, difficulty, etc. */
    DungeonPrompts: DungeonPrompts,

    /**
     * Gets the text for a given definition ID for the selected language from the text definitions catalogue.
     * Defaults to English if the definition is not found in the selected language.
     * @param {String} definitionID
     */
    getTextDef: function (definitionID) {
        let text = dungeonz.TextDefs[dungeonz.language][definitionID];
        // Check if definition is defined for selected language.
        if (text === null) {
            // Use English instead.
            return dungeonz.TextDefs["English"][definitionID];
        }
        else {
            // Check if the text def is even defined.
            if (text === undefined) return "???";
            // Return the text, in the selected language.
            else return text;
        }
    }
};
/** @type {Number}
 * The pixel size of a tile at the current game scale.
 * Tile size * game scale.
 */
window.dungeonz.SCALED_TILE_SIZE = dungeonz.TILE_SIZE * GAME_SCALE;

/**
 * @type {Number}
 * Used to center entity sprites that are centered, such as projectiles and pickups.
 * Declared after, so tile size is defined.
 */
window.dungeonz.CENTER_OFFSET = dungeonz.SCALED_TILE_SIZE * 0.5;

// Import the data for each map.
function requireAll(r) {
    r.keys().forEach((fileName) => {
        // Remove the "./" from the start.
        fileName = fileName.substring(2);
        // Remove the ".json" from the end.
        fileName = fileName.slice(0, -5);
        // Skip the blank map that is used as a base/template when making new maps.
        if (fileName === "BLANK") return;

        dungeonz.mapsData[fileName] = require("../assets/map/" + fileName + ".json");
    });
}
requireAll(require.context("../assets/map/", true, /\.json$/));

class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        Utils.message("Boot preload");

        // Graphics.
        this.load.image("highlight", "assets/img/gui/hud/highlight.png");
        this.load.atlas("game-atlas", "assets/img/game-atlas.png", "assets/img/game-atlas.json");
        this.load.spritesheet("ground-tileset", "assets/img/ground.png", {
            frameWidth: 16,
            frameHeight: 16,
            margin: 1,
            spacing: 2
        });
        this.load.spritesheet("statics-tileset", "assets/img/statics.png", {
            frameWidth: 16,
            frameHeight: 16,
            margin: 1,
            spacing: 2
        });

        /**
         * Utility for providing Ogg/MP3 audio assets to the Phaser loader.
         * Safari doesn't support Ogg format files, so MP3 must be provided as a fallback.
         * @param {String} key - What to refer to this asset as later.
         * @param {String} filePath - The URL to the asset, without the file type extension.
         */
        const loadAudio = (key, filePath) => {
            this.load.audio(key, [
                "assets/audio/" + filePath + ".ogg",
                filePath + ".mp3",
            ]);
        };

        // Audio.
        loadAudio("player-death-loop", "player/death-loop");
        loadAudio("footstep-1", "player/footstep-1");
        loadAudio("footstep-2", "player/footstep-2");
        loadAudio("footstep-3", "player/footstep-3");
        loadAudio("footstep-4", "player/footstep-4");
        loadAudio("generic-theme-1", "locations/generic-theme-1");
        loadAudio("generic-theme-2", "locations/generic-theme-2");
        loadAudio("item-dropped", "items/item-dropped");
        loadAudio("dungeon-key-gained", "items/dungeon-key-gained");
        loadAudio("weapon-equipped", "items/weapon-equipped");
        loadAudio("clothing-equipped", "items/clothing-equipped");

    }

    create() {
        Utils.message("Boot create");

        window._this = this;

        // If this boot scene is started again for whatever reason, make sure 
        // the home container is shown, as it is hidden during the game scene.
        document.getElementById("home_cont").style.display = "block";

        document.getElementById("game_cont").style.visibility = "hidden";

        // Keep the game running even when the window loses focus.
        this.events.on("hidden", function () {
            console.log("hidden");
        }, this);

        this.events.on("visible", function () {
            console.log("visible");
        }, this);

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        window.addEventListener("click", function () {
            //console.log("click");
            window.focus();
        }, false);

        // If not on desktop, enable the virtual D-pad.
        dungeonz.virtualDPadEnabled = !_this.sys.game.device.os.desktop;

        if (window.devMove === false) {
            // Disable the right click context menu on the game in prod.
            document.getElementById("game_cont").addEventListener("contextmenu", event => event.preventDefault());
        }

    }
};

dungeonz.Boot = Boot;