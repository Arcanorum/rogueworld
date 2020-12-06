export default (eventResponses) => {

    eventResponses.change_board = (data) => {
        //console.log("change board, data:", data);
        _this.dynamicsData = data.dynamicsData;
        _this.boardAlwaysNight = data.boardAlwaysNight;
        _this.player.row = data.playerRow;
        _this.player.col = data.playerCol;

        // They might be leaving a dungeon, so stop the dungeon timer if it is running.
        if (!data.boardIsDungeon) {
            _this.GUI.stopDungeonTimer();
            _this.GUI.updateDungeonKeysList({});
        }

        // Load the map with the given board name.
        _this.tilemap.loadMap(data.boardName);

        // Remove the old entities.
        const dynamics = _this.dynamics;
        for (let key in dynamics) {
            if (dynamics.hasOwnProperty(key) === false) continue;
            _this.removeDynamic(key);
        }

        // Add the new entities.
        const dynamicsData = _this.dynamicsData;
        for (let i = 0; i < dynamicsData.length; i += 1) {
            _this.addEntity(dynamicsData[i]);
        }

        // Lock the camera to the player sprite.
        _this.cameras.main.startFollow(_this.dynamics[_this.player.entityId].spriteContainer);

        // Refresh the darkness grid.
        _this.tilemap.updateDarknessGrid();

        // Hide any open panels.
        _this.GUI.hideAllPanels();
    };

    eventResponses.player_respawn = () => {
        _this.player.hitPoints = _this.player.maxHitPoints;
        _this.player.energy = _this.player.maxEnergy;
        _this.GUI.respawnPanel.hide();
        _this.GUI.updateHitPointCounters();
        _this.GUI.updateEnergyCounters();

        _this.changeBackgroundMusic(_this.sounds.location.generic);
    };

    eventResponses.hit_point_value = (data) => {
        _this.player.hitPoints = data;
        if (_this.player.hitPoints <= 0) {
            _this.GUI.respawnPanel.show();
            
            _this.changeBackgroundMusic(_this.sounds.playerDeathLoop);
        }
        _this.GUI.updateHitPointCounters();
    };

    eventResponses.energy_value = (data) => {
        _this.player.energy = data;
        _this.GUI.updateEnergyCounters();
    };

    eventResponses.defence_value = (data) => {
        _this.player.defence = data;
        _this.GUI.updateDefenceCounters();
    };

    eventResponses.glory_value = (data) => {
        _this.GUI.updateGloryCounter(data);
    };

    eventResponses.durability_value = (data) => {
        //console.log("durability_value:", data);
        _this.player.inventory[data.slotKey].updateDurability(data.durability);
    };

    eventResponses.exp_gained = (data) => {
        //console.log("exp gained, data:", data);
        _this.player.stats.list[data.statName].modExp(data.exp);
    };

    eventResponses.stat_levelled = (data) => {
        //console.log("stat levelled, data:", data);
        _this.player.stats.list[data.statName].levelUp(data.level, data.nextLevelExpRequirement);
    };
};