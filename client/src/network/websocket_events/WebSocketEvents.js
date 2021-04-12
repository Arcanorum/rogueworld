// import SpellBookTypes from "../../catalogues/SpellBookTypes.json";

import eventResponses from "./EventResponses";
import dungeonz from "../../shared/Global";
import Utils from "../../shared/Utils";
import Login from "./Login";
import Inventory from "./Inventory";
import Task from "./Task";
import Dungeon from "./Dungeon";
import Bank from "./Bank";
import StatusEffects from "./StatusEffects";
import PlayerValues from "./PlayerValues";
import Entity from "./Entity";
import Alerts from "./Alerts";
import { GUIState, ChatState } from "../../shared/state/States";

// Add the login/home page related events immediately.
Login(eventResponses);

/**
 * Adds the event responses that relate to gameplay only once the game state has started.
 * Allows the game scene to finish setting up and be in a state where it can do something
 * with those events, otherwise the events might try to use things that aren't ready yet.
 */
export const addGameEventResponses = () => {
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
        dungeonz.gameScene.dayPhase = data;

        if (dungeonz.gameScene.boardAlwaysNight === false) {
            // Make the darkness layer invisible during day time.
            if (dungeonz.gameScene.dayPhase === dungeonz.gameScene.DayPhases.Day) {
                dungeonz.gameScene.tilemap.darknessSpritesContainer.visible = false;
            }
            else {
                dungeonz.gameScene.tilemap.darknessSpritesContainer.visible = true;
                dungeonz.gameScene.tilemap.updateDarknessGrid();
            }
        }
    };

    eventResponses.chat = (data) => {
        // console.log("chat:", data);
        ChatState.addNewChat(data);
    };

    eventResponses.shop_prices = (data) => {
        GUIState.setStockPrices(data);
    };
};

export const removeGameEventResponses = () => {
    Utils.message("Removing game state event responses");

    Object.keys(eventResponses).forEach((eventResponseName) => {
        delete eventResponses[eventResponseName];
    });

    // Add the login events back. Always need those present.
    Login(eventResponses);
};
