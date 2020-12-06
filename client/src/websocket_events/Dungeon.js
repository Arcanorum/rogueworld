export default (eventResponses) => {

    eventResponses.parties = (data) => {
        _this.GUI.dungeonPanel.updateParties(data);
    };

    eventResponses.start_dungeon = (data) => {
        _this.GUI.startDungeonTimer(data.timeLimitMinutes);
    };

    eventResponses.dungeon_door_keys = (data) => {
        const currentKeys = _this.GUI.dungeonKeysList.children.length;

        let newKeys = 0;
        Object.values(data).forEach((keyTypeCount) => {
            newKeys += keyTypeCount;
        });

        // If a key has been gained, play the key pickup sound.
        if (newKeys > currentKeys) {
            _this.sounds.dungeonKeyGained.play();
        }

        _this.GUI.updateDungeonKeysList(data);
    };
};