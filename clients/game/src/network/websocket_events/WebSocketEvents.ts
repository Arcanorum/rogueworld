import { DayPhases } from '@rogueworld/types';
import { message } from '@rogueworld/utils';
import Global from '../../shared/Global';
import { ChatState, GUIState } from '../../shared/state';
import { ChatMessage } from '../../shared/state/Chat';
import Account from './Account';
import Entity from './Entity';
import eventResponses from './EventResponses';
import Inventory from './Inventory';
import Login from './Login';
import PlayerValues from './PlayerValues';
import StatusEffects from './StatusEffects';
// import Bank from './Bank';

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

    eventResponses.change_day_phase = (data: DayPhases) => {
        // console.log('changing day phase:', data);

        // Don't bother if the day phase hasn't actualy changed.
        if (Global.gameScene.dayPhase === data) return;

        Global.gameScene.dayPhase = data;

        if (Global.gameScene.boardAlwaysNight === false) {
            // Make the darkness layer invisible during day time.
            if (Global.gameScene.dayPhase === DayPhases.Day) {
                Global.gameScene.tweens.add({
                    targets: Global.gameScene.darkness,
                    alpha: 0,
                    duration: 5000,
                });
            }
            else if (Global.gameScene.dayPhase === DayPhases.Night) {
                Global.gameScene.tweens.add({
                    targets: Global.gameScene.darkness,
                    alpha: 0.9,
                    duration: 5000,
                });
            }
            else {
                Global.gameScene.tweens.add({
                    targets: Global.gameScene.darkness,
                    alpha: 0.4,
                    duration: 5000,
                });
            }
        }
    };

    eventResponses.chat = (data: ChatMessage) => {
        // console.log('chat:', data);
        ChatState.addNewChat(data);
    };

    eventResponses.shop_prices = (data: Array<number>) => {
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
