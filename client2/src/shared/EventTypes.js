// Application.
export const CONNECTING = Symbol("CONNECTING");
export const CONNECTED = Symbol("CONNECTED");
export const JOINING = Symbol("JOINING");
export const JOINED = Symbol("JOINED");
export const LOADING = Symbol("LOADING");
export const LOAD_ACCEPTED = Symbol("LOAD_ACCEPTED");
export const LOGGED_IN = Symbol("LOGGED_IN");

// Join issues.
export const INVALID_LOGIN_DETAILS = Symbol("INVALID_LOGIN_DETAILS");
export const ALREADY_LOGGED_IN = Symbol("ALREADY_LOGGED_IN");
export const WORLD_FULL = Symbol("WORLD_FULL");

// Account issues.
export const CREATE_ACCOUNT_FAILURE = Symbol("CREATE_ACCOUNT_FAILURE");
export const CHANGE_PASSWORD_SUCCESS = Symbol("CHANGE_PASSWORD_SUCCESS");
export const CHANGE_PASSWORD_FAILURE = Symbol("CHANGE_PASSWORD_FAILURE");

// Player.
export const POSITION_VALUE = Symbol("POSITION_VALUE");
export const DISPLAY_NAME_VALUE = Symbol("DISPLAY_NAME_VALUE");
export const HITPOINTS_VALUE = Symbol("HITPOINTS_VALUE");
export const MAX_HITPOINTS_VALUE = Symbol("MAX_HITPOINTS_VALUE");
export const ENERGY_VALUE = Symbol("ENERGY_VALUE");
export const MAX_ENERGY_VALUE = Symbol("MAX_ENERGY_VALUE");
export const GLORY_VALUE = Symbol("GLORY_VALUE");
export const DEFENCE_VALUE = Symbol("DEFENCE_VALUE");
export const STATS_VALUE = Symbol("STATS_VALUE");
export const TASKS_VALUE = Symbol("TASKS_VALUE");

// Inventory.

// Misc.
export const WEBSOCKET_CLOSE = Symbol("WEBSOCKET_CLOSE");
export const WEBSOCKET_ERROR = Symbol("WEBSOCKET_ERROR");
export const SOMETHING_WENT_WRONG = Symbol("SOMETHING_WENT_WRONG");
