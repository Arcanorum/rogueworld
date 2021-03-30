import DungeonPrompts from "../catalogues/DungeonPrompts.json";
import TextDefs from "../catalogues/TextDefinitions.json";
import dungeonz from "./Global";

/**
 * @type {Object}
 * A global object of things that relate to gameplay.
 */
const gameConfig = {
    /**
     * @type {Object}
     * A list of the map data for every map.
     */
    mapsData: {},
    /**
     * @type {Object}
     * A factor to scale display objects by.
     */
    GAME_SCALE: 4,
    /**
     * @type {Number}
     * How big in pixels each tile is.
     */
    TILE_SIZE: 16,
    /**
     * @type {Number}
     * The view range on the client is one less than the view range on the server, so the client can see things leaving the view range.
     */
    VIEW_RANGE: 15,
    /**
     * @type {Number}
     * The edge to edge view distance. x2 for both sides, and +1 for the middle (where this player is).
     */
    VIEW_DIAMETER: (1 + 15 * 2),
    /**
     * @type {Number}
     * Minimum amount of time (in ms) for how long any chat messages should stay for.
     */
    CHAT_BASE_LIFESPAN: 4000,
    /**
     * @type {Number}
     * How fast chat messages float upwards.
     */
    CHAT_SCROLL_SPEED: 0.3,
    /**
     * @type {String}
     * What language to use from the text defs.
     */
    language: "English",
    /**
     * @type {Boolean}
     * Whether usable items will be automatically added to the hotbar when picked up if there is a free hotbar slot.
     */
    addToHotbar: true,
    /**
     * @type {Number}
     * The volume of the music. 0 is no music, 100 is full volume. Can't use floats due to imperfect decimal precision.
     */
    musicVolume: 50,
    /**
     * @type {Number}
     * The volume of the sound effects. 0 is no effects, 100 is full volume. Can't use floats due to imperfect decimal precision.
     */
    effectsVolume: 50,
    /**
     * @type {Number}
     * The current percent zoom level for all elements with the gui_zoomable style class.
     */
    GUIZoom: 100,

    /**
     * @type {Number}
     * How long an animated number transitions should take.
     */
    NUMBER_ANIMATION_DURATION: 500,

    ANIMATED_NUMBER_FORMAT: (value) => value.toFixed(0),

    /**
     * @type {Boolean}
     * Whether the virtual D-pad is enabled.
     */
    virtualDPadEnabled: false,
    /**
     * @type {Object}
     * The catalogue of text definitions.
     */
    TextDefs,
    /**
     * @type {Object}
     * The catalogue of dungeon prompt info. Dungeon name, glory cost, difficulty, etc.
     */
    DungeonPrompts,
};
/**
 * @type {Number}
 * The pixel size of a tile at the current game scale.
 * Tile size * game scale.
 */
gameConfig.SCALED_TILE_SIZE = gameConfig.TILE_SIZE * gameConfig.GAME_SCALE;
/**
 * @type {Number}
 * Used to center entity sprites that are centered, such as projectiles and pickups.
 * Declared after, so tile size is defined.
 */
gameConfig.CENTER_OFFSET = gameConfig.SCALED_TILE_SIZE * 0.5;

dungeonz.gameConfig = gameConfig;

export default gameConfig;
