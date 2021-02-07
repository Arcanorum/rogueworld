import PubSub from "pubsub-js";
import { DUNGEON_PARTIES, DUNGEON_TIME_LIMIT_MINUTES } from "../../shared/EventTypes";
import Utils from "../../shared/Utils";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.parties = (data) => {
        Utils.message("Parties:", data);

        PubSub.publish(DUNGEON_PARTIES, data);
    };

    eventResponses.start_dungeon = (data) => {
        PubSub.publish(DUNGEON_TIME_LIMIT_MINUTES, data.timeLimitMinutes);
    };

    eventResponses.dungeon_door_keys = (data) => {
        // const currentKeys = window.gameScene.GUI.dungeonKeysList.children.length;

        // let newKeys = 0;
        // Object.values(data).forEach((keyTypeCount) => {
        //     newKeys += keyTypeCount;
        // });

        // // If a key has been gained, play the key pickup sound.
        // if (newKeys > currentKeys) {
        //     window.gameScene.sounds.dungeonKeyGained.play();
        // }

        // window.gameScene.GUI.updateDungeonKeysList(data);
    };
};
