import PubSub from "pubsub-js";
import Utils from "../../shared/Utils";
import eventResponses from "./EventResponses";
import { ApplicationState } from "../../shared/state/States";
import {
    ALREADY_LOGGED_IN, INVALID_LOGIN_DETAILS, WORLD_FULL, SOMETHING_WENT_WRONG,
} from "../../shared/EventTypes";

export default () => {
    Utils.message("Adding login events");

    eventResponses.something_went_wrong = () => {
        ApplicationState.setJoining(false);

        PubSub.publish(SOMETHING_WENT_WRONG);
    };

    eventResponses.invalid_login_details = () => {
        ApplicationState.setJoining(false);

        PubSub.publish(INVALID_LOGIN_DETAILS);
    };

    eventResponses.already_logged_in = () => {
        ApplicationState.setJoining(false);

        PubSub.publish(ALREADY_LOGGED_IN);
    };

    eventResponses.world_full = () => {
        ApplicationState.setJoining(false);

        PubSub.publish(WORLD_FULL);
    };

    eventResponses.join_world_success = (data) => {
        Utils.message("Join world success, data:");
        Utils.message(data);

        // Keep the join world data, to pass to the game state create method.
        ApplicationState.joinWorldData = data;

        ApplicationState.setJoined(true);

        Utils.message("End of join world success");
    };
};
