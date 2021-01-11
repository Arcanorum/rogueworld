import Utils from "../../shared/Utils";
import eventResponses from "./EventResponses";
import { ApplicationState } from "../../shared/state/States";

export default () => {
    Utils.message("Adding login events");
    eventResponses.something_went_wrong = () => {
        ApplicationState.setJoining(false);
    };

    eventResponses.invalid_login_details = () => {
        console.log("invalid_login_details");
        ApplicationState.setJoining(false);
    };

    eventResponses.character_in_use = () => {
        Utils.message("Join world success");

        ApplicationState.setJoining(false);
    };

    eventResponses.join_world_success = (data) => {
        Utils.message("Join world success, data:");
        Utils.message(data);

        // Keep the join world data, to pass to the game state create method.
        window.joinWorldData = data;

        ApplicationState.setJoined(true);

        // If somehow the state is not valid, close the connection.
        // Weird bug... :/
        // if (!window.gameScene) {
        //     Utils.warning("window.gameScene is invalid. Closing WS connection. window.gameScene:", window.gameScene);
        //     setTimeout(() => {
        //         window.ws.close();
        //     }, 10000);
        //     return;
        // }

        // Really rare and annoying bug with Phaser where states aren't changing...
        // Set a timeout just in case the state refuses to start.
        // If it does start, the timeout is removed.
        // window.joinWorldStartTimeout = setTimeout(() => {
        //     Utils.message("Backup game start starter timeout called.");
        //     window.gameScene.scene.start("Game", true, false);
        // }, 2000);
        // // Set another timeout for if even that timeout doesn't start the game state. Reload the page...
        // window.joinWorldReloadTimeout = setTimeout(() => {
        //     window.location.reload(true);
        // }, 5000);

        Utils.message("End of join world success");
    };

    eventResponses.world_full = () => {
        Utils.message("World is full.");
    };
};
