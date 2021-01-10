import Utils from "../shared/Utils";
import eventResponses from "./EventResponses";
import { ApplicationState } from "../shared/state/States";

export default () => {
    console.log("Adding login events");
    eventResponses.something_went_wrong = () => {
        const element = document.getElementById("center_text");
        const originalText = element.innerText;
        element.innerText = Utils.getTextDef("Something went wrong");

        // Revert after a few seconds.
        setTimeout(() => {
            element.innerText = originalText;
        }, 8000);
    };

    eventResponses.invalid_login_details = () => {
        const element = document.getElementById("center_text");
        const originalText = element.innerText;
        element.innerText = Utils.getTextDef("Invalid login details");

        // Revert after a few seconds.
        setTimeout(() => {
            element.innerText = originalText;
        }, 8000);
    };

    eventResponses.character_in_use = () => {
        const element = document.getElementById("center_text");
        const originalText = element.innerText;
        element.innerText = Utils.getTextDef("Character in use");

        // Revert after a few seconds.
        setTimeout(() => {
            element.innerText = originalText;
        }, 8000);
    };

    eventResponses.join_world_success = (data) => {
        console.log("join_world_success");
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
