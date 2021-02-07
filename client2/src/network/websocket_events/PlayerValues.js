import { PlayerState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.change_board = (data) => {
        // console.log("change board, data:", data);
        window.gameScene.dynamicsData = data.dynamicsData;
        window.gameScene.boardAlwaysNight = data.boardAlwaysNight;

        PlayerState.setRow(data.playerRow);
        PlayerState.setCol(data.playerCol);

        // They might be leaving a dungeon, so stop the dungeon timer if it is running.
        if (!data.boardIsDungeon) {
            // window.gameScene.GUI.stopDungeonTimer();
            // window.gameScene.GUI.updateDungeonKeysList({});
        }

        // Load the map with the given board name.
        window.gameScene.tilemap.loadMap(data.boardName);

        // Remove the old entities.
        const { dynamics } = window.gameScene;

        Object.keys(dynamics).forEach((key) => {
            window.gameScene.removeDynamic(key);
        });

        // Add the new entities.
        const { dynamicsData } = window.gameScene;
        for (let i = 0; i < dynamicsData.length; i += 1) {
            window.gameScene.addEntity(dynamicsData[i]);
        }

        // Lock the camera to the player sprite.
        window.gameScene.cameras.main.startFollow(
            window.gameScene.dynamics[PlayerState.entityID].spriteContainer,
        );

        // Refresh the darkness grid.
        window.gameScene.tilemap.updateDarknessGrid();

        // Hide any open panels.
        // window.gameScene.GUI.hideAllPanels();
    };

    eventResponses.player_respawn = () => {
        PlayerState.setHitPoints(PlayerState.maxHitPoints);
        PlayerState.setEnergy(PlayerState.maxEnergy);

        window.gameScene.soundManager.music.changeBackgroundMusic(
            window.gameScene.soundManager.music.sounds.location.generic1,
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

    eventResponses.durability_value = (data) => {
        // console.log("durability_value:", data);
        window.gameScene.player.inventory[data.slotKey].updateDurability(data.durability);
    };

    eventResponses.exp_gained = (data) => {
        // console.log("exp gained, data:", data);
        window.gameScene.player.stats.list[data.statName].modExp(data.exp);
    };

    eventResponses.stat_levelled = (data) => {
        // console.log("stat levelled, data:", data);
        window.gameScene.player.stats.list[data.statName].levelUp(
            data.level, data.nextLevelExpRequirement,
        );
    };
};
