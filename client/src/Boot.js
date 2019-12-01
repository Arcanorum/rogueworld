import TextDefs from '../src/catalogues/TextDefinitions';
import DungeonPrompts from '../src/catalogues/DungeonPrompts';

// Import the data for each map.
import tutorial from '../assets/map/tutorial'
import overworld from '../assets/map/overworld'
import fight_pit from '../assets/map/fight-pit'
import dungeon_city_sewers from '../assets/map/dungeon-city-sewers'
import dungeon_knight_training_arena from '../assets/map/dungeon-knight-training-arena'
import dungeon_bandit_hideout from '../assets/map/dungeon-bandit-hideout'
import dungeon_west_pyramid from '../assets/map/dungeon-west-pyramid'
import dungeon_east_pyramid from '../assets/map/dungeon-east-pyramid'
import dungeon_blood_halls from '../assets/map/dungeon-blood-halls'
import dungeon_shadow_dojo from '../assets/map/dungeon-shadow-dojo'
import dungeon_forest_maze from '../assets/map/dungeon-forest-maze'

/** @type {Phaser.State}
 * A global reference to the currently running Phaser state. */
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
    VIEW_DIAMETER: (1+15*2),
    /** @type {Number}
     * Minimum amount of time (in ms) for how long any chat messages should stay for. */
    CHAT_BASE_LIFESPAN: 4000,
    /** @type {Number}
     * How fast chat messages float upwards. */
    CHAT_SCROLL_SPEED: 0.3,
    /** @type {String}
     * What language to use from the text defs. */
    language: 'English',
    /** @type {Boolean}
     * What language to use from the text defs. */
    quickTurnEnabled: true,
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
        if(text === null){
            // Use English instead.
            return dungeonz.TextDefs['English'][definitionID];
        }
        else {
            // Check if the text def is even defined.
            if(text === undefined) return '???';
            // Return the text, in the selected language.
            else return text;
        }
    }
};
/** @type {Number}
 * Tile scale * game scale */
window.dungeonz.TILE_SCALE = dungeonz.TILE_SIZE * GAME_SCALE;

/**
 * @type {Number}
 * Used to center entity sprites that are centered, such as projectiles and pickups.
 * Declared after, so tile size is defined.
 */
window.dungeonz.CENTER_OFFSET = dungeonz.TILE_SIZE * GAME_SCALE * 0.5;

/**
 * Called when the window is resized.
 */
window.windowResize = function () {
    const tilemap = _this.tilemap;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // TODO: Removed until darkness is added back in.
    //tilemap.darknessGridGroup.cameraOffset.x = (windowWidth * 0.5)  - (tilemap.darknessGridGroup.width * 0.5);
    //tilemap.darknessGridGroup.cameraOffset.y = (windowHeight * 0.5) - (tilemap.darknessGridGroup.height * 0.5);

    tilemap.updateBorders();
};

dungeonz.Boot = function () {
    
};

dungeonz.Boot.prototype = {

    preload: function () {

        console.log("* In boot preload");

        this.load.atlasJSONArray('game-atlas',  'assets/img/game-atlas.png',    'assets/img/game-atlas.json');
        this.load.spritesheet('ground-tileset', 'assets/img/ground.png', 16, 16);
        this.load.spritesheet('statics-tileset', 'assets/img/statics.png', 16, 16);

    },

    create: function () {

        console.log("* In boot create");

        window._this = this;

        // If this boot state is started again for whatever reason, make sure the home container is shown, as it is hidden during the game state.
        document.getElementById("home_cont").style.display = "block";

        // Keep the game running even when the window loses focus.
        this.stage.disableVisibilityChange = true;

        // Round pixels so text doesn't appear blurry/anti-aliased.
        this.game.renderer.renderSession.roundPixels = true;

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        window.addEventListener("click", function () {
            //console.log("click");
            window.focus();
        }, false);

        // Store the maps data in the global object with the expected name format, as variable names can't have dashes in them
        dungeonz.mapsData["tutorial"] =                     tutorial;
        dungeonz.mapsData["overworld"] =                    overworld;
        dungeonz.mapsData["fight-pit"] =                    fight_pit;
        dungeonz.mapsData["dungeon-city-sewers"] =          dungeon_city_sewers;
        dungeonz.mapsData["dungeon-knight-training-arena"] =dungeon_knight_training_arena;
        dungeonz.mapsData["dungeon-bandit-hideout"] =       dungeon_bandit_hideout;
        dungeonz.mapsData["dungeon-west-pyramid"] =         dungeon_west_pyramid;
        dungeonz.mapsData["dungeon-east-pyramid"] =         dungeon_east_pyramid;
        dungeonz.mapsData["dungeon-blood-halls"] =          dungeon_blood_halls;
        dungeonz.mapsData["dungeon-shadow-dojo"] =          dungeon_shadow_dojo;
        dungeonz.mapsData["dungeon-forest-maze"] =          dungeon_forest_maze;

        // Changes the size of the game renderer to match the size of the window.
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        // If not on desktop, enable the virtual D-pad.
        dungeonz.virtualDPadEnabled = !_this.game.device.desktop;

        // If the debug mode flag is in local storage, start in debug mode.
        if(localStorage.getItem('debug_mode') === "true"){
            this.game.add.plugin(Phaser.Plugin.Debug);
            console.log("* Starting in debug mode.");
        }

        // Enable advanced timing for the FPS counter.
        this.game.time.advancedTiming = true;

    },

    update: function () {

    },

    render: function () {

    }

};