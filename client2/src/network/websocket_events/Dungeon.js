import eventResponses from "./EventResponses";

export default () => {
    eventResponses.parties = (data) => {
        window.gameScene.GUI.dungeonPanel.updateParties(data);
    };

    eventResponses.start_dungeon = (data) => {
        window.gameScene.GUI.startDungeonTimer(data.timeLimitMinutes);
    };

    eventResponses.dungeon_door_keys = (data) => {
        const currentKeys = window.gameScene.GUI.dungeonKeysList.children.length;

        let newKeys = 0;
        Object.values(data).forEach((keyTypeCount) => {
            newKeys += keyTypeCount;
        });

        // If a key has been gained, play the key pickup sound.
        if (newKeys > currentKeys) {
            window.gameScene.sounds.dungeonKeyGained.play();
        }

        window.gameScene.GUI.updateDungeonKeysList(data);
    };
};
