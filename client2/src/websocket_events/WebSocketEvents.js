// Default websocket object state. Used to detect if there is already a connection.
import EventNames from "../catalogues/EventNames.json";
import SpellBookTypes from "../catalogues/SpellBookTypes.json";

import eventResponses from "./EventResponses";

import Utils from "../shared/Utils";
import Login from "./Login";
import Inventory from "./Inventory";
import Task from "./Task";
import Dungeon from "./Dungeon";
import Bank from "./Bank";
import StatusEffects from "./StatusEffects";
import PlayerValues from "./PlayerValues";
import Entity from "./Entity";
import Alerts from "./Alerts";

// window.ws = false;

/**
 * Attempt to create a new websocket connection to the game server.
 * @param {String} url - The URL of the game server.
 * @returns {Boolean} Whether a connection already exists.
 */
// const makeWebSocketConnection = (url) => {
//     console.log("makeWebSocketConnection:", url);
//     // Only connect if there isn't already a connection.
//     if (window.ws === false) {
//         console.log("making new connection");
//         // Connect to the game server.
//         window.ws = new WebSocket(url);

//         // Connection already exists.
//         // Check the if the connection is not working.
//     } else if (window.ws.readyState !== 1) {
//         console.log("already a connection?");
//         // Close the connection.
//         window.ws.close();
//         // Try to create a new connection to the game server.
//         window.ws = new WebSocket(url);
//     } else {
//         return false;
//     }
//     return true;
// };

// window.connectToGameServer = () => {
//     // If the game is running in dev mode (localhost), connect without SSL.
//     if (window.host === "local") {
//         // Make a connection, or if one is already made, return so the listeners aren't added again.
//         if (makeWebSocketConnection("ws://127.0.0.4:4567") === false) return false;
//     } else if (window.host === "test") {
//         // Make a connection, or if one is already made, return so the listeners aren't added again.
//         if (makeWebSocketConnection("wss://test.dungeonz.io:443") === false) return false;

//         // Deployment mode. Connect to live server, which should be using SSL.
//         // Make a connection, or if one is already made, return so the listeners aren't added again.
//     } else if (makeWebSocketConnection("wss://dungeonz.io:443") === false) return false;

//     /**
//      * Event emit helper. Attach this to a socket, and use it to send an event to the server.
//      * @param {String} eventName
//      * @param {Object} [data]
//      */
//     window.ws.sendEvent = (eventName, data) => {
//         window.ws.send(JSON.stringify({ eventName, data }));
//     };

//     // Wait for the connection to have finished opening before attempting to join the world.
//     window.ws.onopen = () => {
//         console.log("on open");
//         // Attempt to join the world as soon as the connection is ready, so the user doesn't have to press 'Play' twice.
//         // playPressed();
//     };

//     window.ws.onmessage = (event) => {
//         // The data is JSON, so parse it.
//         const parsedMessage = JSON.parse(event.data);
//         // Every event received should have an event name ID, which is a number that represents an event name string.
//         // Numbers are smaller, so saves sending lengthy strings for each message.
//         const { eventNameID } = parsedMessage;
//         // Look up the corresponding event name string for the given ID.
//         const eventName = EventNames[eventNameID];
//         // Check this event name ID is in the list of valid event name IDs.
//         if (eventName !== undefined) {
//             // Check there is a response function to run for the event.
//             if (eventResponses[eventName] !== undefined) {
//                 // Run the response, giving it any data.
//                 // Need to check for if any data was given at all, otherwise falsy values
//                 // like 0 and false would be ignored, even though they are valid values.
//                 if (parsedMessage.data === undefined) {
//                     eventResponses[eventName]({});
//                 } else {
//                     eventResponses[eventName](parsedMessage.data);
//                 }
//             }
//         }
//     };

//     window.ws.onclose = () => {
//         console.log("* Disconnected from game server.");
//         window.ws = false;
//         // Make it reload after a few seconds.
//         setTimeout(() => {
//             // Reload the page.
//             window.location.reload();
//         }, 6000);
//     };

//     window.ws.onerror = (error) => {
//         console.log("websocket error:", error);
//         // Get the warning text.
//         const element = document.getElementById("center_text");
//         // Show the server connect error message.
//         element.innerText = Utils.getTextDef("Connect game server warning");
//         // Show it.
//         element.style.visibility = "visible";
//         // Make it disappear after a few seconds.
//         setTimeout(() => {
//             element.style.visibility = "hidden";
//         }, 8000);
//     };

//     return true;
// };

// Add the login/home page related events immediately.
Login(eventResponses);

// TODO: move this to the connection manager?
/**
 * Adds the event responses that relate to gameplay only once the game state has started.
 * Allows the game scene to finish setting up and be in a state where it can do something
 * with those events, otherwise the events might try to use things that aren't ready yet.
 */
window.addGameEventResponses = () => {
    Utils.message("Adding game state event responses");

    Alerts();

    PlayerValues();

    StatusEffects();

    Inventory();

    Bank();

    Entity();

    Dungeon();

    // Clan(eventResponses);

    Task();

    // Misc/ungrouped events.

    eventResponses.change_day_phase = (data) => {
        // console.log("changing day phase:", data);
        window.gameScene.dayPhase = data;

        if (window.gameScene.boardAlwaysNight === false) {
            // Make the darkness layer invisible during day time.
            if (window.gameScene.dayPhase === window.gameScene.DayPhases.Day) {
                window.gameScene.tilemap.darknessSpritesContainer.visible = false;
            } else {
                window.gameScene.tilemap.darknessSpritesContainer.visible = true;
                window.gameScene.tilemap.updateDarknessGrid();
            }
        }
    };

    eventResponses.chat = (data) => {
        // console.log("chat:", data);
        window.gameScene.chat(data.id, data.message);
    };

    eventResponses.shop_prices = (data) => {
        // console.log("shop prices, data:", data);
        window.gameScene.GUI.shopPanel.updatePrices(data);
    };
};
