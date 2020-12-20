// Default websocket object state. Used to detect if there is already a connection.
window.ws = false;

/**
 * A list of the functions to run for each event response from the server.
 * Each response can be given a generic `data` object as a parameter.
 * @type {Object}
 */
const eventResponses = {};

import EventNames from "../catalogues/EventNames";
import SpellBookTypes from "../catalogues/SpellBookTypes";

import Utils from "../Utils";
import Login from "./Login";
import Inventory from "./Inventory";
import Clan from "./Clan";
import Task from "./Task";
import Dungeon from "./Dungeon";
import Bank from "./Bank";
import StatusEffects from "./StatusEffects";
import PlayerValues from "./PlayerValues";
import Entity from "./Entity";
import Alerts from "./Alerts";

/**
 * Attempt to create a new websocket connection to the game server.
 * @param {String} url - The URL of the game server.
 * @returns {Boolean} Whether a connection already exists.
 */
const makeWebSocketConnection = (url) => {
    // Only connect if there isn't already a connection.
    if (ws === false) {
        // Connect to the game server.
        window.ws = new WebSocket(url);
    }
    // Connection already exists.
    else {
        // Check the if the connection is not working.
        if (ws.readyState !== 1) {
            // Close the connection.
            ws.close();
            // Try to create a new connection to the game server.
            window.ws = new WebSocket(url);
        }
        else {
            return false;
        }
    }
    return true;
}

window.connectToGameServer = () => {

    // If the game is running in dev mode (localhost), connect without SSL.
    if (window.host === "local") {
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        if (makeWebSocketConnection('ws://127.0.0.4:4567') === false) return false;
    }
    else if (window.host === "test") {
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        if (makeWebSocketConnection('wss://test.dungeonz.io:443') === false) return false;
    }
    // Deployment mode. Connect to live server, which should be using SSL.
    else {
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        if (makeWebSocketConnection('wss://dungeonz.io:443') === false) return false;
    }

    /**
     * Event emit helper. Attach this to a socket, and use it to send an event to the server.
     * @param {String} eventName
     * @param {Object} [data]
     */
    ws.sendEvent = (eventName, data) => {
        ws.send(JSON.stringify({ eventName: eventName, data: data }));
    };

    // Wait for the connection to have finished opening before attempting to join the world.
    ws.onopen = () => {
        // Attempt to join the world as soon as the connection is ready, so the user doesn't have to press 'Play' twice.
        playPressed();
    };

    ws.onmessage = (event) => {
        // The data is JSON, so parse it.
        const parsedMessage = JSON.parse(event.data);
        // Every event received should have an event name ID, which is a number that represents an event name string.
        // Numbers are smaller, so saves sending lengthy strings for each message.
        const eventNameID = parsedMessage.eventNameID;
        // Look up the corresponding event name string for the given ID.
        const eventName = EventNames[eventNameID];

        // Check this event name ID is in the list of valid event name IDs.
        if (eventName !== undefined) {
            // Check there is a response function to run for the event.
            if (eventResponses[eventName] !== undefined) {
                // Run the response, giving it any data.
                // Need to check for if any data was given at all, otherwise falsy values 
                // like 0 and false would be ignored, even though they are valid values.
                if (parsedMessage.data === undefined) {
                    eventResponses[eventName]({});
                } else {
                    eventResponses[eventName](parsedMessage.data);
                }
            }
        }

    };

    ws.onclose = () => {
        console.log('* Disconnected from game server.');
        window.ws = false;
        // Make it reload after a few seconds.
        setTimeout(() => {
            // Reload the page.
            location.reload();
        }, 6000);
    };

    ws.onerror = (error) => {
        // Get the warning text.
        let element = document.getElementById("center_text");
        // Show the server connect error message.
        element.innerText = dungeonz.getTextDef("Connect game server warning");
        // Show it.
        element.style.visibility = "visible";
        // Make it disappear after a few seconds.
        setTimeout(() => {
            element.style.visibility = "hidden";
        }, 8000);
    }

};

// Add the login/home page related events immediately.
Login(eventResponses);

/**
 * Adds the event responses that relate to gameplay only once the game state has started.
 * Allows the game scene to finish setting up and be in a state where it can do something
 * with those events, otherwise the events might try to use things that aren't ready yet.
 */
window.addGameStateEventResponses = () => {
    Utils.message("Adding game state event responses");

    Alerts(eventResponses);

    PlayerValues(eventResponses);

    StatusEffects(eventResponses);

    Inventory(eventResponses);

    Bank(eventResponses);

    Entity(eventResponses);

    Dungeon(eventResponses);

    Clan(eventResponses);

    Task(eventResponses);

    // Misc/ungrouped events.

    eventResponses.change_day_phase = (data) => {
        // console.log("changing day phase:", data);
        _this.dayPhase = data;

        if (_this.boardAlwaysNight === false) {
            // Make the darkness layer invisible during day time.
            if (_this.dayPhase === _this.DayPhases.Day) {
                _this.tilemap.darknessSpritesContainer.visible = false;
            }
            else {
                _this.tilemap.darknessSpritesContainer.visible = true;
                _this.tilemap.updateDarknessGrid();
            }
        }
    };

    eventResponses.chat = (data) => {
        //console.log("chat:", data);
        _this.chat(data.id, data.message);
    };

    eventResponses.shop_prices = (data) => {
        //console.log("shop prices, data:", data);
        _this.GUI.shopPanel.updatePrices(data);
    };

};