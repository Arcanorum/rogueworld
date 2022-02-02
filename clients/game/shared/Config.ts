import { ItemConfig, ObjectOfStrings } from '../../../../shared/types/src';
import Sprite from '../game/entities/Sprite';
import { CraftingRecipe } from './types';

interface TextDefsType {
    [key: string]: ObjectOfStrings;
}

interface ItemTypes {
    [key: string]: ItemConfig;
}

interface EntityConfig {
    id: number;
    typeName: string;
}

interface EntitiesList {
    [key: string]: typeof Sprite;
}

interface EntityTypes {
    [key: string]: EntityConfig;
}

interface MapsData {
    [key: string]: {
        groundGrid: Array<Array<number>>;
    };
}

type Host = 'local' | 'test' | 'live';

/**
 * A global object of things that relate to gameplay.
 */
const Config = {
    /** Whether the client should use development only features. */
    devMode: false,

    /** The host from where this client is being served from. */
    host: '' as Host,

    /** A list of the map data for every map. */
    mapsData: {} as MapsData,

    /** A factor to scale display objects by. */
    GAME_SCALE: 4,

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
     * The view range on the client is one less than the view range on the server, so the client
     * can see things leaving the view range.
     */
    VIEW_RANGE: 15,

    /**
     * The edge to edge view distance. x2 for both sides, and +1 for the middle (where this player is).
     */
    VIEW_DIAMETER: (1 + 15 * 2),

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
    TextDefs: {} as TextDefsType,

    /** The catalogue of all item types, including most of how it is configured. */
    ItemTypes: {} as ItemTypes,

    /** The catalogue of all crafting recipes. */
    CraftingRecipes: [] as Array<CraftingRecipe>,

    EntityTypes: {} as EntityTypes,

    // TODO: change the loaders for these lists to use this object, instead of reassigning, so
    // can just import it directly without having to worry about referencing the old object
    EntitiesList: {} as EntitiesList,
};

Config.SCALED_TILE_SIZE = Config.TILE_SIZE * Config.GAME_SCALE;

Config.CENTER_OFFSET = Config.SCALED_TILE_SIZE * 0.5;

export default Config;
