import PubSub from "pubsub-js";
import { DUNGEON_KEYS, DUNGEON_PARTIES, DUNGEON_TIME_LIMIT_MINUTES } from "../../shared/EventTypes";
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
        PubSub.publish(DUNGEON_KEYS, data);
    };
};
