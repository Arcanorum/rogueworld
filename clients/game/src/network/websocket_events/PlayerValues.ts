import PubSub from 'pubsub-js';
import Panels from '../../components/game/gui/panels/Panels';
import { COMBAT_STATUS_TRIGGER } from '../../shared/EventTypes';
import Global from '../../shared/Global';
import { GUIState, PlayerState } from '../../shared/state';
import { DynamicEntityData } from '../../shared/types';
import eventResponses from './EventResponses';

const PlayerValues = () => {
    eventResponses.change_board = (data: {
        boardName: string;
        boardAlwaysNight: boolean;
        playerRow: number;
        playerCol: number;
        dynamicsData: Array<DynamicEntityData>;
    }) => {
        // console.log("change board, data:", data);
        Global.gameScene.dynamicsData = data.dynamicsData;
        Global.gameScene.boardAlwaysNight = data.boardAlwaysNight;

        PlayerState.setRow(data.playerRow);
        PlayerState.setCol(data.playerCol);

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

    eventResponses.change_display_name = (data: {id: string; displayName: string}) => {
        // If it the name changed for this player, then update their state.
        if (data.id === PlayerState.entityId) {
            PlayerState.setDisplayName(data.displayName);
        }

        // Update the display name text on the sprite.
        const dynamic = Global.gameScene.dynamics[data.id];

        dynamic.spriteContainer?.displayName?.setText(data.displayName);
    };

    eventResponses.player_respawn = () => {
        PlayerState.setHitPoints(PlayerState.maxHitPoints);
        PlayerState.setFood(PlayerState.maxFood);
        GUIState.setActivePanel(Panels.NONE);
        // Clear in combat status after respawn.
        PubSub.publish(COMBAT_STATUS_TRIGGER, 0);
    };

    eventResponses.player_in_combat = (data: {duration: number}) => {
        PubSub.publish(COMBAT_STATUS_TRIGGER, data.duration);
    };

    eventResponses.melee_attack = () => {
        Global.gameScene.sound.play('punch-1', { volume: GUIState.effectsVolume / 100 });
    };

    eventResponses.hit_point_value = (data: number) => {
        PlayerState.setHitPoints(data);
    };

    eventResponses.food_value = (data: number) => {
        PlayerState.setFood(data);
    };

    eventResponses.defence_value = (data: number) => {
        PlayerState.setDefence(data);
    };

    eventResponses.glory_value = (data: number) => {
        PlayerState.setGlory(data);
    };

    eventResponses.exp_gained = (data) => {
        //
    };
};

export default PlayerValues;
