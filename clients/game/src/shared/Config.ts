import {
    EntityClientConfig, ItemClientConfig, ObjectOfAny, TextDefinitions,
} from '@rogueworld/types';
import { CraftingRecipe } from './types';
import Entity from '../game/entities/Entity';

interface ItemTypes {
    [key: string]: ItemClientConfig;
}

interface EntitiesList {
    [key: string]: typeof Entity;
}

interface EntityTypes {
    [key: string]: EntityClientConfig;
}

interface MapsData {
    [key: string]: {
        groundGrid: Array<Array<number>>;
    };
}

/**
 * A global object of things that relate to gameplay.
 */
const Config = {
    /**
     * A copy of the Settings object from the config package, due to NextJS weirdness.
     * See index.tsx.
     */
    Settings: {} as ObjectOfAny,

    /** A list of the map data for every map. */
    mapsData: {} as MapsData,

    /** A factor to scale display objects by. */
    GAME_SCALE: 0,

    /** How big in pixels each tile is. */
    TILE_SIZE: 16,

    /**
     * The pixel size of a tile at the current game scale.
     * Tile size * game scale.
     */
    SCALED_TILE_SIZE: 0,

    /**
     * Used to center entity sprites that are centered, such as projectiles and pickups.
     * Declared after, so tile size is defined.
     */
    CENTER_OFFSET: 0,

    /**
     * The view range on the server is one greater than the view range on the client, so the client
     * can see things leaving the view range.
     */
    VIEW_RANGE: 0,

    /**
     * The edge to edge view distance. x2 for both sides, and +1 for the middle (where this
     * player is).
     */
    VIEW_DIAMETER: 0,

    /** Minimum amount of time (in ms) for how long any chat messages should stay for. */
    CHAT_BASE_LIFESPAN: 4000,

    /** How fast chat messages float upwards. */
    CHAT_SCROLL_SPEED: 0.3,

    /** What language to use from the text defs. */
    language: 'English',

    /** How long an animated number transitions should take. */
    NUMBER_ANIMATION_DURATION: 500,

    ANIMATED_NUMBER_FORMAT: (value: number) => value.toFixed(0),

    /** The catalogue of text definitions for the selected language. */
    TextDefs: {} as TextDefinitions,

    /** The catalogue of all item types, including most of how it is configured. */
    ItemTypes: {} as ItemTypes,

    /** The catalogue of all crafting recipes. */
    CraftingRecipes: [] as Array<CraftingRecipe>,

    EntityTypes: {} as EntityTypes,

    EntitiesList: {} as EntitiesList,
};

export const init = (config: { Settings: ObjectOfAny; TextDefs: TextDefinitions }) => {
    // Make the settings available to the rest of the app at runtime through the globalish config
    // object.
    Config.Settings = config.Settings;
    Config.TextDefs = config.TextDefs;

    Config.GAME_SCALE = Config.Settings.CLIENT_DISPLAY_SCALE;

    Config.SCALED_TILE_SIZE = Config.TILE_SIZE * Config.GAME_SCALE;
    Config.CENTER_OFFSET = Config.SCALED_TILE_SIZE * 0.5;

    Config.VIEW_RANGE = Config.Settings.PLAYER_VIEW_RANGE;
    Config.VIEW_DIAMETER = (1 + Config.VIEW_RANGE * 2);
};

export default Config;
