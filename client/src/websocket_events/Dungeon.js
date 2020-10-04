export default (eventResponses) => {

    eventResponses.parties = (data) => {
        _this.GUI.dungeonPanel.updateParties(data);
    };

    eventResponses.start_dungeon = (data) => {
        _this.GUI.startDungeonTimer(data.timeLimitMinutes);
    };

    eventResponses.dungeon_door_keys = (data) => {
        _this.GUI.updateDungeonKeysList(data);
    };
};