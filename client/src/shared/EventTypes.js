// Application.
export const CONNECTING = Symbol("CONNECTING");
export const CONNECTED = Symbol("CONNECTED");
export const JOINING = Symbol("JOINING");
export const JOINED = Symbol("JOINED");
export const LOADING = Symbol("LOADING");
export const LOAD_PROGRESS = Symbol("LOAD_PROGRESS");
export const LOAD_FILE_PROGRESS = Symbol("LOAD_FILE_PROGRESS");
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
export const TASK_PROGRESS = Symbol("TASK_PROGRESS");
export const COMBAT_STATUS_TRIGGER = Symbol("COMBAT_STATUS_TRIGGER");

// Keyboard.
export const ENTER_KEY = Symbol("ENTER_KEY");

// Chat.
export const NEW_CHAT = Symbol("NEW_CHAT");
export const FOCUS_CHAT = Symbol("FOCUS_CHAT");
export const SHOULD_SCROLL_CHAT = Symbol("SHOULD_SCROLL_CHAT");
export const QUICK_CHAT_ENABLED = Symbol("QUICK_CHAT_ENABLED");

// Inventory.
export const ADD_INVENTORY_ITEM = Symbol("ADD_INVENTORY_ITEM");
export const REMOVE_INVENTORY_ITEM = Symbol("REMOVE_INVENTORY_ITEM");
export const REMOVE_ALL_INVENTORY_ITEMS = Symbol("REMOVE_ALL_INVENTORY_ITEMS");
export const MODIFY_INVENTORY_ITEM = Symbol("MODIFY_INVENTORY_ITEM");
export const MODIFY_INVENTORY_WEIGHT = Symbol("MODIFY_INVENTORY_WEIGHT");

// Hotbar.
export const HOTBAR_ITEM = Symbol("HOTBAR_ITEM");
export const HOLDING_ITEM = Symbol("HOLDING_ITEM");
export const AMMUNITION_ITEM = Symbol("AMMUNITION_ITEM");
export const CLOTHING_ITEM = Symbol("CLOTHING_ITEM");
export const USED_ITEM = Symbol("USED_ITEM");

// Bank.
export const ADD_BANK_ITEM = Symbol("ADD_BANK_ITEM");
export const REMOVE_BANK_ITEM = Symbol("REMOVE_BANK_ITEM");
export const MODIFY_BANK_ITEM = Symbol("MODIFY_BANK_ITEM");
export const MODIFY_BANK_WEIGHT = Symbol("MODIFY_BANK_WEIGHT");
export const MODIFY_BANK_MAX_WEIGHT = Symbol("MODIFY_BANK_MAX_WEIGHT");
export const MODIFY_BANK_MAX_WEIGHT_UPGRADE_COST = Symbol("MODIFY_BANK_MAX_WEIGHT_UPGRADE_COST");

// GUI.
export const DUNGEON_PORTAL_PRESSED = Symbol("DUNGEON_PORTAL_PRESSED");
export const CURSOR_MOVE = Symbol("CURSOR_MOVE");
export const TOOLTIP_CONTENT = Symbol("TOOLTIP_CONTENT");
export const CRAFTING_STATION = Symbol("CRAFTING_STATION");
export const SHOP = Symbol("SHOP");
export const STOCK_PRICES = Symbol("STOCK_PRICES");
export const PANEL_CHANGE = Symbol("PANEL_CHANGE");
export const SHOW_CHAT_BOX = Symbol("SHOW_CHAT_BOX");

// Dungeon.
export const DUNGEON_PARTIES = Symbol("DUNGEON_PARTIES");
export const DUNGEON_TIME_LIMIT_MINUTES = Symbol("DUNGEON_TIME_LIMIT_MINUTES");
export const DUNGEON_KEYS = Symbol("DUNGEON_KEYS");

// Misc.
export const WEBSOCKET_CLOSE = Symbol("WEBSOCKET_CLOSE");
export const WEBSOCKET_ERROR = Symbol("WEBSOCKET_ERROR");
export const SOMETHING_WENT_WRONG = Symbol("SOMETHING_WENT_WRONG");
export const BEFORE_PAGE_UNLOAD = Symbol("WINDOW_PAGE_UNLOAD");
