import PubSub from "pubsub-js";
import { DUNGEON_KEYS, DUNGEON_TIME_LIMIT_MINUTES } from "../../shared/EventTypes";
import dungeonz from "../../shared/Global";
import { PlayerState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.change_board = (data) => {
        // console.log("change board, data:", data);
        dungeonz.gameScene.dynamicsData = data.dynamicsData;
        dungeonz.gameScene.boardAlwaysNight = data.boardAlwaysNight;

        PlayerState.setRow(data.playerRow);
        PlayerState.setCol(data.playerCol);

        // They might be leaving a dungeon, so stop the dungeon timer if it is running.
        if (!data.boardIsDungeon) {
            PubSub.publish(DUNGEON_TIME_LIMIT_MINUTES, 0);
            PubSub.publish(DUNGEON_KEYS, {});
        }

        // Load the map with the given board name.
        dungeonz.gameScene.tilemap.loadMap(data.boardName);

        // Remove the old entities.
        const { dynamics } = dungeonz.gameScene;

        Object.keys(dynamics).forEach((key) => {
            dungeonz.gameScene.removeDynamic(key);
        });

        // Add the new entities.
        const { dynamicsData } = dungeonz.gameScene;
        for (let i = 0; i < dynamicsData.length; i += 1) {
            dungeonz.gameScene.addEntity(dynamicsData[i]);
        }

        // Lock the camera to the player sprite.
        dungeonz.gameScene.cameras.main.startFollow(
            dungeonz.gameScene.dynamics[PlayerState.entityID].spriteContainer,
        );

        // Refresh the darkness grid.
        dungeonz.gameScene.tilemap.updateDarknessGrid();
    };

    eventResponses.player_respawn = () => {
        PlayerState.setHitPoints(PlayerState.maxHitPoints);
        PlayerState.setEnergy(PlayerState.maxEnergy);

        dungeonz.gameScene.soundManager.music.changeBackgroundMusic(
            dungeonz.gameScene.soundManager.music.sounds.location.generic1,
        );
    };

    eventResponses.hit_point_value = (data) => {
        PlayerState.setHitPoints(data);
    };

    eventResponses.energy_value = (data) => {
        PlayerState.setEnergy(data);
    };

    eventResponses.defence_value = (data) => {
        PlayerState.setDefence(data);
    };

    eventResponses.glory_value = (data) => {
        PlayerState.setGlory(data);
    };

    eventResponses.exp_gained = (data) => {
        PlayerState.setStatExp(data.statName, data.exp);
    };

    eventResponses.stat_levelled = (data) => {
        PlayerState.setStatLevel(data.statName, data.level, data.nextLevelExpRequirement);
    };
};
