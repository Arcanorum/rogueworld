import { PlayerState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.change_board = (data) => {
        // console.log("change board, data:", data);
        window.gameScene.dynamicsData = data.dynamicsData;
        window.gameScene.boardAlwaysNight = data.boardAlwaysNight;
        window.gameScene.player.row = data.playerRow;
        window.gameScene.player.col = data.playerCol;

        // They might be leaving a dungeon, so stop the dungeon timer if it is running.
        if (!data.boardIsDungeon) {
            window.gameScene.GUI.stopDungeonTimer();
            window.gameScene.GUI.updateDungeonKeysList({});
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
            window.gameScene.dynamics[window.gameScene.player.entityId].spriteContainer,
        );

        // Refresh the darkness grid.
        window.gameScene.tilemap.updateDarknessGrid();

        // Hide any open panels.
        window.gameScene.GUI.hideAllPanels();
    };

    eventResponses.player_respawn = () => {
        window.gameScene.player.hitPoints = window.gameScene.player.maxHitPoints;
        window.gameScene.player.energy = window.gameScene.player.maxEnergy;
        window.gameScene.GUI.respawnPanel.hide();
        window.gameScene.GUI.updateHitPointCounters();
        window.gameScene.GUI.updateEnergyCounters();

        window.gameScene.changeBackgroundMusic(window.gameScene.sounds.location.generic1);
    };

    eventResponses.hit_point_value = (data) => {
        console.log("hit_point_value:", data);
        PlayerState.setHitPoints(data);

        // window.gameScene.player.hitPoints = data;
        // if (window.gameScene.player.hitPoints <= 0) {
        //     window.gameScene.GUI.respawnPanel.show();

        //     window.gameScene.changeBackgroundMusic(
        //         window.gameScene.soundManager.player.sounds.deathLoop,
        //     );
        // }
        // window.gameScene.GUI.updateHitPointCounters();
    };

    eventResponses.energy_value = (data) => {
        window.gameScene.player.energy = data;
        window.gameScene.GUI.updateEnergyCounters();
    };

    eventResponses.defence_value = (data) => {
        window.gameScene.player.defence = data;
        window.gameScene.GUI.updateDefenceCounter();
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
