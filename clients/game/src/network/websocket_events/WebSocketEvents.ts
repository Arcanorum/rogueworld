import eventResponses from './EventResponses';
import Global from '../../shared/Global';
import Login from './Login';
import Inventory from './Inventory';
// import Bank from './Bank';
import StatusEffects from './StatusEffects';
import PlayerValues from './PlayerValues';
import Entity from './Entity';
import Account from './Account';
import { GUIState, ChatState } from '../../shared/state';
import { message } from '../../../../../shared/utils';
import { DayPhases } from '@dungeonz/types';

// Add the login/home page related events immediately.
Login();

/**
 * Adds the event responses that relate to gameplay only once the game state has started.
 * Allows the game scene to finish setting up and be in a state where it can do something
 * with those events, otherwise the events might try to use things that aren't ready yet.
 */
export const addGameEventResponses = () => {
    message('Adding game state event responses');

    Account();

    PlayerValues();

    StatusEffects();

    Inventory();

    Entity();

    // Misc/ungrouped events.

    // eventResponses.change_day_phase = (data) => {
    //     // console.log("changing day phase:", data);
    //     Global.gameScene.dayPhase = data;

    //     if (Global.gameScene.boardAlwaysNight === false) {
    //         // Make the darkness layer invisible during day time.
    //         if (Global.gameScene.dayPhase === DayPhases.Day) {
    //             Global.gameScene.tilemap.darknessTilesBlitter.setVisible(false);
    //         }
    //         else {
    //             Global.gameScene.tilemap.updateDarknessGrid();
    //         }
    //     }
    // };

    eventResponses.chat = (data) => {
        // console.log("chat:", data);
        ChatState.addNewChat(data);
    };

    eventResponses.shop_prices = (data) => {
        GUIState.setStockPrices(data);
    };
};

export const removeGameEventResponses = () => {
    message('Removing game state event responses');

    Object.keys(eventResponses).forEach((eventResponseName) => {
        delete eventResponses[eventResponseName];
    });

    // Add the login events back. Always need those present.
    Login();
};
