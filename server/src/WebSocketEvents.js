const Utils = require("./Utils");
const { wss } = require("./Server");
const world = require("./World");
// const SpellBook = require("./items/holdable/spell_books/SpellBook");
const DungeonManagersList = require("./dungeon/DungeonManagersList");
const EventsList = require("./EventsList");
const { OppositeDirections: ValidDirections } = require("./gameplay/Directions");

// const Charter = undefined; // require("./entities/statics/interactables/breakables/crafting stations/Charter");
const DungeonPortal = require("./entities/classes/statics/interactables/DungeonPortal");
const AccountManager = require("./account/AccountManager");
const settings = require("../settings");
const EntitiesList = require("./entities/EntitiesList");

const eventResponses = {};

const clientSettings = {
    maxDisplayNameLength: settings.MAX_CHARACTER_DISPLAY_NAME_LENGTH,
    maxUsernameLength: settings.MAX_ACCOUNT_USERNAME_LENGTH,
    displayNameChangeCost: settings.DISPLAY_NAME_CHANGE_COST,
};

function isDisplayNameValid(displayName) {
    // Check a display name was given.
    if (!displayName) return false;

    // Check it is a string.
    if (typeof displayName !== "string") return false;

    // Check it isn't empty, or just a space.
    if (displayName.trim() === "") return false;

    // Check it isn't too long.
    if (displayName.length > (settings.MAX_CHARACTER_DISPLAY_NAME_LENGTH || 20)) return false;

    return true;
}

function noop() { }

function heartbeat() {
    this.isAlive = true;
}

function closeConnection(clientSocket) {
    Utils.message("Closing dead connection.");

    if (clientSocket.inGame === false) return;

    world.removePlayer(clientSocket);

    clientSocket.terminate();
}

function pingEach(clientSocket) {
    // console.log("each ws: ", ws.isAlive);
    if (clientSocket.isAlive === false) {
        closeConnection(clientSocket);
    }
    clientSocket.isAlive = false;
    clientSocket.ping(noop);
}

function ping() {
    // console.log("ping");
    wss.clients.forEach(pingEach);
}

// How often to ping each client to see if the connection is still alive.
// var pings = 0;
const pingRate = 30000;
setInterval(() => {
    // pinger += 1;
    // console.log("pings: " + pings);
    ping();
}, pingRate);

/**
 * Attach this to a socket, and use it to send an event to that socket.
 * @param {Number} eventNameID
 * @param {Object} [data]
 */
function sendEvent(eventNameID, data) {
    // console.log("sending, eventNameID: ", eventNameID);
    // console.log("sending, data: ", data);
    // console.log(this);
    // Check the connection is in the ready state.
    if (this.readyState === 1) {
        this.send(JSON.stringify({ eventNameID, data }));
    }
}

/**
 * Broadcast to all connected clients that are in the game.
 * @param {Number} eventNameID
 * @param {Object} [data]
 */
wss.broadcastToInGame = (eventNameID, data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            if (client.inGame === true) {
                client.send(JSON.stringify({ eventNameID, data }));
            }
        }
    });
};

wss.on("connection", (clientSocket) => {
    clientSocket.isAlive = true;
    clientSocket.on("pong", heartbeat);

    clientSocket.inGame = false;

    clientSocket.nextMessageTimes = {
        LOCAL: 0,
        GLOBAL: 0,
        TRADE: 0,
    };

    // Attach the sendEvent function to this socket.
    // Don't need to create an instance of the function for each socket, just refer to the same one.
    clientSocket.sendEvent = sendEvent;

    clientSocket.sendEvent(EventsList.settings, clientSettings);

    clientSocket.on("message", (payload) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(payload);
        }
        catch (e) {
            Utils.warning("message event, invalid payload:", payload);
            return;
        }

        const { eventName } = parsedMessage;

        // Check there is a response function to run for the event.
        if (eventResponses[eventName] !== undefined) {
            eventResponses[eventName](clientSocket, parsedMessage.data);
        }
    });

    clientSocket.on("close", () => {
        Utils.message("Client socket close event.");
        if (clientSocket.inGame === false) return;

        world.removePlayer(clientSocket);
    });
});

/**
 * @param {*} clientSocket
 * @param {String} data.username
 * @param {String} data.password
 */
eventResponses.log_in = (clientSocket, data) => {
    // console.log("log in:", data);
    if (!data) return;
    if (!data.username) return;
    if (!data.password) return;
    // Don't check username length, so they can still log in even if the max username length
    // setting has been lowered since they made the account.

    AccountManager.logIn(clientSocket, data.username, data.password, (account) => {
        world.addExistingPlayer(clientSocket, account);
    });
};

/**
 * Create a new character to use, but that is NOT an account yet.
 * @param {*} clientSocket
 * @param {String} data.displayName
 */
eventResponses.new_char = (clientSocket, data) => {
    // console.log("new char:", data);
    if (!data) return;
    // Don't let them join a world if they are already in one.
    if (clientSocket.inGame === true) return;

    let displayName = "Savage";

    if (isDisplayNameValid(data.displayName)) {
        displayName = data.displayName;
    }

    world.addNewPlayer(clientSocket, displayName);
};

/**
 * Create a new account.
 * @param {*} clientSocket
 * @param {String} data.username
 * @param {String} data.password
 */
eventResponses.create_account = (clientSocket, data) => {
    if (!data) return;
    if (!data.username) {
        clientSocket.sendEvent(EventsList.create_account_failure, { messageID: "No username" });
        return;
    }
    if (!data.password) {
        clientSocket.sendEvent(EventsList.create_account_failure, { messageID: "No password" });
        return;
    }
    // Limit the username length. Also limited on client, but check here too.
    // Don't check password length, as it will be encrypted and potentially very long.
    if (data.username.length > (settings.MAX_ACCOUNT_USERNAME_LENGTH || 50)) {
        clientSocket.sendEvent(EventsList.create_account_failure, { messageID: "Username too long" });
        return;
    }

    AccountManager.createAccount(data.username, data.password, clientSocket.entity,
        () => {
            Utils.message("Create account success:", data.username);
            clientSocket.sendEvent(EventsList.create_account_success);
        },
        (error) => {
            if (error) {
                // An index with this key (the username) already exists. Must be unique.
                if (error.code === 11000) {
                    // Username already taken.
                    clientSocket.sendEvent(EventsList.create_account_failure, { messageID: "Username taken" });
                }
            }
        });
};

eventResponses.change_password = (clientSocket, data) => {
    if (!data) return;
    if (!data.currentPassword) return;
    if (!data.newPassword) return;

    AccountManager.changePassword(clientSocket, data.currentPassword, data.newPassword);
};

eventResponses.change_display_name = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;

    // Prevent invlaid names.
    if (!isDisplayNameValid(data)) return;

    // Check they have enough glory.
    if (clientSocket.entity.glory < (settings.DISPLAY_NAME_CHANGE_COST || 1000)) return;

    clientSocket.entity.modGlory(-(settings.DISPLAY_NAME_CHANGE_COST || 1000));

    clientSocket.entity.setDisplayName(data);
};

eventResponses.mv_u = (clientSocket) => {
    // console.log("move player up");
    // Make sure they are in the game.
    if (clientSocket.inGame === false) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.move(-1, 0);
};

eventResponses.mv_d = (clientSocket) => {
    // console.log("move player down");
    // Make sure they are in the game.
    if (clientSocket.inGame === false) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.move(1, 0);
};

eventResponses.mv_l = (clientSocket) => {
    // console.log("move player left");
    // Make sure they are in the game.
    if (clientSocket.inGame === false) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.move(0, -1);
};

eventResponses.mv_r = (clientSocket) => {
    // console.log("move player right");
    // Make sure they are in the game.
    if (clientSocket.inGame === false) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.move(0, 1);
};

/**
 * @param {*} clientSocket
 * @param {String} data
 */
eventResponses.chat = (clientSocket, data) => {
    // Can't use ChatState here 'cause it's located outside module
    const { CHAT_SCOPES } = settings;

    if (!data || !data.scope || !data.message) return;
    if (data.message.length > 255) return;
    if (clientSocket.inGame === false) return;

    const { message, scope } = data;
    const { entity } = clientSocket;

    // Ignore this event if they are dead.
    if (entity.hitPoints <= 0) return;

    const { cooldown } = CHAT_SCOPES[scope];

    // if no cooldown is found it means the client is passing some strange values
    if (cooldown === undefined) return;

    // const date = new Date();
    const nextMessageTime = Date.now();
    const dataToBroadCast = {
        id: entity.id,
        displayName: entity.displayName,
        scope,
        message,
        nextAvailableDate: nextMessageTime + cooldown, // sending in milliseconds = smaller payload size
    };

    // send global chats
    if (data.scope !== CHAT_SCOPES.LOCAL.value) {
        if (clientSocket.nextMessageTimes[data.scope] > Date.now()) {
            // Message too soon, ignore it.
            return;
        }

        wss.broadcastToInGame(
            EventsList.chat,
            dataToBroadCast,
        );

        if (cooldown === 0) return;

        // Track the time they will be able to send a message in this scope again.
        clientSocket.nextMessageTimes[data.scope] = nextMessageTime;

        return;
    }

    // send local chats
    entity.board.emitToNearbyPlayers(
        entity.row,
        entity.col,
        EventsList.chat,
        dataToBroadCast,
    );
};

/**
 * @param {*} clientSocket
 * @param {String} data - The direction to attack in.
 */
eventResponses.melee_attack = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    const player = clientSocket.entity;
    if (player.hitPoints <= 0) return;

    clientSocket.entity.performAction(player.attackMelee, player, data);
};

/**
 * @param {*} clientSocket
 * @param {Number} data.row - The row of the tile to perform an action on.
 * @param {Number} data.col - The col of the tile to perform an action on.
 */
eventResponses.start_tile_action = (clientSocket, data) => {
    // console.log("start_tile_action:", data);
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    const player = clientSocket.entity;
    if (player.hitPoints <= 0) return;

    const boardTile = player.board.getTileAt(data.row, data.col);
    // Check the board tile is valid.
    if (!boardTile) return;

    // If the tile is a resource node, try to gather from it.
    if (boardTile.static instanceof EntitiesList.AbstractClasses.ResourceNode) {
        let itemUsed = null;
        // A tool was used to start this action, check it is valid. Allow 0.
        if (Number.isInteger(data.itemUsedIndex)) {
            itemUsed = player.inventory.items[data.itemUsedIndex];
        }

        boardTile.static.startGathering(player, itemUsed);
    }

    // Can add other kinds of tile interaction here.
};

/**
 * @param {*} clientSocket
 * @param {String} data - The key of the inventory slot of the item to equip.
 */
eventResponses.use_item = (clientSocket, data) => {
    // console.log("use item, data:", data);
    // Allow slot index 0 to be given.
    if (!Number.isFinite(data)) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.inventory.useItem(data);
};

/**
 * @param {*} clientSocket
 * @param {String} data - The direction to use the selected holdable item in.
 */
eventResponses.use_held_item = (clientSocket, data) => {
    // console.log("use item, data:", data);
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Check the data is a valid direction.
    if (ValidDirections[data] === undefined) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    // Don't let them use a held item if a curse forbids it.
    if (clientSocket.entity.curse !== null) {
        if (clientSocket.entity.curse.onCharacterAttack() === false) {
            return;
        }
    }

    /** @type {Holdable} */
    const item = clientSocket.entity.holding;

    // Check the item is valid.
    if (!item) return;

    clientSocket.entity.performAction(item.useWhileHeld, item, data);
};

/**
 * @param {*} clientSocket
 * @param {String|Number} data - The spell number to select.
 */
// eventResponses.spell_selected = (clientSocket, data) => {
//     if (!data) return;
//     if (clientSocket.inGame === false) return;
//     // Ignore this event if they are dead.
//     if (clientSocket.entity.hitPoints <= 0) return;
//     // Check they are holding a spell book.
//     if (clientSocket.entity.holding !== null) {
//         if (clientSocket.entity.holding instanceof SpellBook) {
//             clientSocket.entity.holding.changeSpell(data);
//         }
//     }
// };

/**
 * @param {*} clientSocket
 * @param {String} data - The key of the inventory slot of the item to drop.
 */
eventResponses.drop_item = (clientSocket, data) => {
    // console.log("drop item event:", data);
    if (!data) return;
    if (clientSocket.inGame === false) return;

    /** @type {Player} */
    const { entity } = clientSocket;

    // Ignore this event if they are dead.
    if (entity.hitPoints <= 0) return;

    clientSocket.entity.inventory.dropItem(data.slotIndex, data.quantity);
};

/**
 * Pick up an item pickup from the tile the player is on.
 * @param {*} clientSocket
 */
eventResponses.pick_up_item = (clientSocket) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.pickUpItem();
};

/**
 * @param {*} clientSocket
 * @param {String} data.slotKeyFrom - The key of the slot to swap from.
 * @param {String} data.slotKeyTo - The key of the slot to swap to.
 */
// eventResponses.swap_inventory_slots = (clientSocket, data) => {
//     if (!data) return;
//     if (clientSocket.inGame === false) return;
//     // Ignore this event if they are dead.
//     if (clientSocket.entity.hitPoints <= 0) return;

//     // console.log("swap invent slots event:", data);

//     if (data.slotKeyFrom === undefined) return;
//     if (data.slotKeyTo === undefined) return;

//     clientSocket.entity.swapInventorySlots(data.slotKeyFrom, data.slotKeyTo);
// };

/**
 * @param {*} clientSocket
 * @param {Number} data - The index in the crafting recipes list of the thing to craft.
 */
eventResponses.craft_item = (clientSocket, data) => {
    // Allow 0.
    if (!Number.isFinite(data)) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.craft(data);
};

/**
 * @param {*} clientSocket
 * @param {Number} data.slotIndex
 * @param {Number} data.quantity
 */
eventResponses.bank_deposit_item = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.bank.depositItem(data.slotIndex, data.quantity);
};

/**
 * @param {*} clientSocket
 * @param {Number} data.slotIndex
 * @param {Number} data.quantity
 */
eventResponses.bank_deposit_all_items = (clientSocket) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.bank.depositAllItems();
};

/**
 * @param {*} clientSocket
 * @param {Number} data.slotIndex
 * @param {Number} data.quantity
 */
eventResponses.bank_withdraw_item = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.bank.withdrawItem(data.slotIndex, data.quantity);
};

/**
 * @param {*} clientSocket
 */
eventResponses.bank_buy_upgrade = (clientSocket) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.bank.buyMaxWeightUpgrade();
};

/**
 * @param {*} clientSocket
 * @param {Number} data.fromSlotIndex
 * @param {Number} data.toSlotIndex
 */
// eventResponses.bank_swap_slots = (clientSocket, data) => {
//     if (!data) return;
//     if (clientSocket.inGame === false) return;
//     // Ignore this event if they are dead.
//     if (clientSocket.entity.hitPoints <= 0) return;

//     clientSocket.entity.bank.swapItems(data.fromSlotIndex, data.toSlotIndex);
// };

/**
 * @param {*} clientSocket
 * @param {Object} data - The ID of a dungeon manager.
 */
eventResponses.get_dungeon_parties = (clientSocket, data) => {
    // console.log("get_parties:", data);
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    const dungeonManager = DungeonManagersList.ByID[data];
    if (dungeonManager === undefined) return;

    clientSocket.sendEvent(EventsList.parties, dungeonManager.getPartiesData());
};

/**
 * @param {*} clientSocket
 * @param {Number} data.dungeonID - The ID of a dungeon manager.
 * @param {Number} data.row - The row of the dungeon portal that was interacted with.
 * @param {Number} data.col - The col of the dungeon portal that was interacted with.
 */
eventResponses.focus_dungeon = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    if (clientSocket.entity.hitPoints <= 0) return;

    const dungeonManager = DungeonManagersList.ByID[data.dungeonID];
    if (dungeonManager === undefined) return;

    // Find the dungeon portal entity.
    const player = clientSocket.entity;
    const boardTile = player.board.getTileAt(data.row, data.col);
    if (!boardTile) return;
    const dungeonPortal = boardTile.static;
    if (dungeonPortal instanceof DungeonPortal === false) return;
    // Check they are adjacent to it.
    if (player.isAdjacentToEntity(dungeonPortal) === false) return;

    // Focus on the target dungeon manager.
    player.focusedDungeonManager = dungeonManager;

    // Send the the parties data straight away.
    clientSocket.sendEvent(EventsList.parties, dungeonManager.getPartiesData());
};

/**
 * @param {*} clientSocket
 * @param {Number} data - The ID of a dungeon portal entity.
 */
eventResponses.create_dungeon_party = (clientSocket, data) => {
    // console.log("create_dungeon_party:", data);
    if (!data) return;
    if (clientSocket.inGame === false) return;
    if (clientSocket.entity.hitPoints <= 0) return;

    /** @type {DungeonManager} */
    const dungeonManager = DungeonManagersList.ByID[data.dungeonID];
    if (dungeonManager === undefined) return;

    dungeonManager.createParty(clientSocket.entity);
};

/**
 * @param {*} clientSocket
 * @param {Number} data.dungeonID
 */
eventResponses.join_dungeon_party = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    if (clientSocket.entity.hitPoints <= 0) return;

    /** @type {DungeonManager} */
    const dungeonManager = DungeonManagersList.ByID[data.dungeonID];
    if (dungeonManager === undefined) return;

    dungeonManager.addPlayerToParty(clientSocket.entity, data.partyID);
};

/**
 * @param {*} clientSocket
 * @param {String} data.dungeonID - The ID of a dungeon manager.
 */
eventResponses.leave_dungeon_party = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    if (clientSocket.entity.hitPoints <= 0) return;
    // Only allow this event to remove them from a party if they are not yet in the dungeon.
    if (clientSocket.entity.board.dungeon) return;

    /** @type {DungeonManager} */
    const dungeonManager = DungeonManagersList.ByID[data.dungeonID];
    if (dungeonManager === undefined) return;

    dungeonManager.removePlayerFromParty(clientSocket.entity);
};

eventResponses.kick_dungeon_party_member = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;
    if (clientSocket.entity.hitPoints <= 0) return;
    // Only allow this event to remove them from a party if they are not yet in the dungeon.
    if (clientSocket.entity.board.dungeon) return;

    const dungeonManager = DungeonManagersList.ByID[data.dungeonID];
    if (dungeonManager === undefined) return;

    dungeonManager.kickPartyMember(clientSocket.entity, data.memberID);
};

/**
 * @param {*} clientSocket
 * @param {Number} data.dungeonID - The ID of a dungeon manager.
 * @param {Number} data.row - The row of the dungeon portal that was interacted with.
 * @param {Number} data.col - The col of the dungeon portal that was interacted with.
 */
eventResponses.start_dungeon = (clientSocket, data) => {
    if (!data) return;
    if (DungeonManagersList.ByID[data.dungeonID] === undefined) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    // Find the dungeon portal entity.
    const player = clientSocket.entity;
    const boardTile = clientSocket.entity.board.getTileAt(data.row, data.col);
    if (!boardTile) return;
    const dungeonPortal = boardTile.static;
    if (dungeonPortal instanceof DungeonPortal === false) return;

    dungeonPortal.enter(player);
};

/**
 * @param {*} clientSocket
 */
eventResponses.respawn = (clientSocket) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are alive.
    if (clientSocket.entity.hitPoints > 0) return;

    clientSocket.entity.respawn();
};

/**
 * @param {*} clientSocket
 * @param {Number} data.merchantId - The ID of a merchant entity.
 * @param {Number} data.row - The row of the merchant that was interacted with.
 * @param {Number} data.col - The col of the merchant that was interacted with.
 */
eventResponses.get_shop_prices = (clientSocket, data) => {
    // console.log("get_shop_prices:", data);
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;
    if (!data) return;

    // Make sure the board tile the client says the merchant is on is valid.
    const boardTile = clientSocket.entity.board.getTileAt(data.row, data.col);
    if (!boardTile) return;
    const entity = boardTile.destroyables[data.merchantId];
    if (entity === undefined) return;
    // Check the entity actually has a shop.
    if (entity.shop === undefined) return;

    clientSocket.sendEvent(EventsList.shop_prices, entity.shop.prices);
};

/**
 * @param {*} clientSocket
 * @param {Number} data.merchantId - The ID of a merchant entity.
 * @param {Number} data.row - The row of the merchant that was interacted with.
 * @param {Number} data.col - The col of the merchant that was interacted with.
 * @param {Number} data.index
 * @param {Number} data.itemTypeCode
 * @param {Number} data.index
 */
eventResponses.shop_buy_item = (clientSocket, data) => {
    // console.log("shop buy item event, data:", data);
    if (!data) return;
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    // Make sure the board tile the client says the merchant is on is valid.
    const boardTile = clientSocket.entity.board.getTileAt(data.row, data.col);
    if (!boardTile) return;
    const entity = boardTile.destroyables[data.merchantId];
    if (entity === undefined) return;
    // Check the entity actually has a shop.
    if (entity.shop === undefined) return;

    // Check they are within trading range.
    const player = clientSocket.entity;
    const rowDist = Math.abs(player.row - entity.row);
    const colDist = Math.abs(player.col - entity.col);
    if ((rowDist + colDist) < 3) {
        entity.shop.sellStock(player, data.index);
    }
};

// eventResponses.clan_join = (clientSocket) => {
//     if (clientSocket.inGame === false) return;
//     // Ignore this event if they are dead.
//     if (clientSocket.entity.hitPoints <= 0) return;

//     const player = clientSocket.entity;
//     const frontTile = player.board.getTileInFront(player.direction, player.row, player.col);

//     if (!frontTile) return;

//     if (frontTile.static instanceof Charter) {
//         frontTile.static.clan.addMember(player);
//     }
// };

/**
 * @param {*} clientSocket
 */
// eventResponses.clan_leave = (clientSocket) => {
//     if (clientSocket.inGame === false) return;
//     // Ignore if they aren't even in a clan.
//     if (clientSocket.entity.clan === null) return;

//     clientSocket.entity.clan.memberLeft(clientSocket.entity);
// };

// eventResponses.clan_kick = (clientSocket, data) => {
//     if (clientSocket.inGame === false) return;
//     // Ignore if they aren't even in a clan.
//     if (clientSocket.entity.clan === null) return;

//     clientSocket.entity.clan.kickMember(data, clientSocket.entity);
// };

// eventResponses.clan_promote = (clientSocket, data) => {
//     if (clientSocket.inGame === false) return;
//     // Ignore if they aren't even in a clan.
//     if (clientSocket.entity.clan === null) return;

//     clientSocket.entity.clan.promoteMember(data, clientSocket.entity, true);
// };

/**
 * While they have the clan panel open, the client will periodically request updates of the current values of their clan details.
 * @param {*} clientSocket
 */
// eventResponses.get_clan_values = (clientSocket) => {
//     if (clientSocket.inGame === false) return;
//     // Ignore if they aren't even in a clan.
//     if (clientSocket.entity.clan === null) return;

//     clientSocket.sendEvent(EventsList.clan_values, clientSocket.entity.clan.getValues());
// };

eventResponses.task_claim_reward = (clientSocket, data) => {
    // console.log("task claim reward, data:", data);
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;
    // Check they are trying to claim a task that they actually have.
    if (clientSocket.entity.tasks.list[data] === undefined) {
        Utils.warning("task_claim_reward event. Task list item is undefined, data:", data);
        return;
    }
    clientSocket.entity.tasks.list[data].claimReward();
};
