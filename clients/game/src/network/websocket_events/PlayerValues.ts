import PubSub from 'pubsub-js';
import {
    DUNGEON_ACTIVE,
    DUNGEON_KEYS,
    DUNGEON_TIME_LIMIT_MINUTES,
    COMBAT_STATUS_TRIGGER,
} from '../../shared/EventTypes';
import Global from '../../shared/Global';
import { GUIState, PlayerState } from '../../shared/state';
import eventResponses from './EventResponses';

export default () => {
    eventResponses.change_board = (data) => {
        // console.log("change board, data:", data);
        Global.gameScene.dynamicsData = data.dynamicsData;
        Global.gameScene.boardAlwaysNight = data.boardAlwaysNight;

        PlayerState.setRow(data.playerRow);
        PlayerState.setCol(data.playerCol);

        // They might be leaving a dungeon, so stop the dungeon timer if it is running.
        if (!data.boardIsDungeon) {
            PubSub.publish(DUNGEON_TIME_LIMIT_MINUTES, 0);
            PubSub.publish(DUNGEON_KEYS, {});
            PubSub.publish(DUNGEON_ACTIVE, false);
        }
        else {
            PubSub.publish(DUNGEON_ACTIVE, true);
        }

        // Load the map with the given board name.
        Global.gameScene.tilemap.loadMap(data.boardName);

        // Remove the old entities.
        const { dynamics } = Global.gameScene;

        Object.keys(dynamics).forEach((key) => {
            Global.gameScene.removeDynamic(key);
        });

        // Add the new entities.
        const { dynamicsData } = Global.gameScene;
        for (let i = 0; i < dynamicsData.length; i += 1) {
            Global.gameScene.addEntity(dynamicsData[i]);
        }

        // Lock the camera to the player sprite.
        Global.gameScene.cameras.main.startFollow(
            Global.gameScene.dynamics[PlayerState.entityId].spriteContainer,
        );
    };

    eventResponses.change_display_name = (data) => {
        // If it the name changed for this player, then update their state.
        if (data.entityId === PlayerState.entityId) {
            PlayerState.setDisplayName(data.displayName);
        }

        // Update the display name text on the sprite.
        const dynamic = Global.gameScene.dynamics[data.entityId];

        dynamic.spriteContainer?.displayName?.setText(data.displayName);
    };

    eventResponses.player_respawn = () => {
        PlayerState.setHitPoints(PlayerState.maxHitPoints);
        PlayerState.setFood(PlayerState.maxFood);
        // Clear in combat status after respawn.
        PubSub.publish(COMBAT_STATUS_TRIGGER, 0);
    };

    eventResponses.player_in_combat = (data) => {
        PubSub.publish(COMBAT_STATUS_TRIGGER, data.duration);
    };

    eventResponses.melee_attack = () => {
        Global.gameScene.sound.play('punch-1', { volume: GUIState.effectsVolume / 100 });
    };

    eventResponses.hit_point_value = (data) => {
        PlayerState.setHitPoints(data);
    };

    eventResponses.food_value = (data) => {
        PlayerState.setFood(data);
    };

    eventResponses.defence_value = (data) => {
        PlayerState.setDefence(data);
    };

    eventResponses.glory_value = (data) => {
        PlayerState.setGlory(data);
    };

    eventResponses.exp_gained = (data) => {
        //
    };

    eventResponses.start_gathering = (data) => {
        // const { interactables } = Global.gameScene;

        // Stop gathering from any adjacent resource nodes if they were in progress.
        // [
        //     interactables[`${PlayerState.row - 1}-${PlayerState.col}`],
        //     interactables[`${PlayerState.row + 1}-${PlayerState.col}`],
        //     interactables[`${PlayerState.row}-${PlayerState.col - 1}`],
        //     interactables[`${PlayerState.row}-${PlayerState.col + 1}`],
        // ].forEach((interactable) => {
        //     if (interactable && interactable.hideTimer) {
        //         interactable.hideTimer();
        //     }
        // });

        // const interactable = interactables[`${data.row}-${data.col}`];

        // if (interactable && interactable.startTimer) {
        //     // Start the gather timer.
        //     interactable.startTimer(data.gatherTime);
        // }
    };
};
