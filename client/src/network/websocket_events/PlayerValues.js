import PubSub from "pubsub-js";
import gameConfig from "../../shared/GameConfig";
import {
    DUNGEON_KEYS, DUNGEON_TIME_LIMIT_MINUTES,
    COMBAT_STATUS_TRIGGER,
} from "../../shared/EventTypes";
import dungeonz from "../../shared/Global";
import { GUIState, PlayerState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.change_board = (data) => {
        // console.log("change board, data:", data);
        dungeonz.gameScene.dynamicsData = data.dynamicsData;
        dungeonz.gameScene.boardAlwaysNight = data.boardAlwaysNight;

        dungeonz.gameScene.currentMapMusicZones = gameConfig.mapsData[data.boardName].musicZones;

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

    eventResponses.change_display_name = (data) => {
        // If it the name changed for this player, then update their state.
        if (data.entityId === PlayerState.entityID) {
            PlayerState.setDisplayName(data.displayName);
        }

        // Update the display name text on the sprite.
        const dynamic = dungeonz.gameScene.dynamics[data.entityId];

        dynamic.spriteContainer.displayName.setText(data.displayName);
    };

    eventResponses.player_respawn = () => {
        PlayerState.setHitPoints(PlayerState.maxHitPoints);
        PlayerState.setEnergy(PlayerState.maxEnergy);
        // Clear in combat status after respawn.
        PubSub.publish(COMBAT_STATUS_TRIGGER, 0);
    };

    eventResponses.player_in_combat = (data) => {
        PubSub.publish(COMBAT_STATUS_TRIGGER, data.duration);
    };

    eventResponses.melee_attack = () => {
        dungeonz.gameScene.sound.play("punch-1", { volume: GUIState.effectsVolume / 100 });
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
        const { dynamics } = dungeonz.gameScene;
        const { spriteContainer } = dynamics[PlayerState.entityID];
        dungeonz.gameScene.skillUpParticleEmitter.emitParticleAt(
            spriteContainer.x,
            spriteContainer.y - gameConfig.SCALED_TILE_SIZE * 0.7,
        );
        dungeonz.gameScene.sound.play("level-gained", { volume: GUIState.effectsVolume / 100 });
    };
};
