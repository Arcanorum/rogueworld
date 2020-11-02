import Utils from "../Utils";

export default (eventResponses) => {

    eventResponses.something_went_wrong = () => {
        // Get the warning text.
        let element = document.getElementById("center_text");
        const originalText = element.innerText;

        element.innerText = "Something went wrong... :/";

        // Make it disappear after a few seconds.
        setTimeout(function () {
            element.innerText = originalText;
        }, 3000);
    };

    eventResponses.invalid_continue_code = () => {
        // Get the warning text.
        let element = document.getElementById("center_text");
        // Show the server connect error message.
        element.innerText = dungeonz.getTextDef("Invalid continue code warning");
        // Show it.
        element.style.visibility = "visible";
        // Make it disappear after a few seconds.
        setTimeout(function () {
            element.style.visibility = "hidden";
        }, 8000);
    };

    eventResponses.character_in_use = () => {
        // Get the warning text.
        let element = document.getElementById("center_text");
        // Show the server connect error message.
        element.innerText = dungeonz.getTextDef("Character in use");
        // Show it.
        element.style.visibility = "visible";
        // Make it disappear after a few seconds.
        setTimeout(function () {
            element.style.visibility = "hidden";
        }, 8000);
    };

    eventResponses.join_world_success = (data) => {
        Utils.message("Join world success, data:");
        Utils.message(data);

        // Hide the home screen container.
        document.getElementById("home_cont").style.display = "none";

        // If somehow the state is not valid, close the connection.
        // Weird bug... :/
        if (!_this) {
            Utils.warning("_this is invalid. Closing WS connection. _this:", _this);
            setTimeout(function () {
                ws.close();
            }, 10000);
            return;
        }

        // Keep the join world data, to pass to the game state create method.
        window.joinWorldData = data;

        // Start the game state.
        _this.scene.start("Game", true, false);

        // Really rare and annoying bug with Phaser where states aren't changing...
        // Set a timeout just in case the state refuses to start.
        // If it does start, the timeout is removed.
        window.joinWorldStartTimeout = setTimeout(function () {
            Utils.message("Backup game start starter timeout called.");
            _this.scene.start("Game", true, false);
        }, 2000);
        // Set another timeout for if even that timeout doesn't start the game state. Reload the page...
        window.joinWorldReloadTimeout = setTimeout(function () {
            location.reload(true);
        }, 5000);

        Utils.message("End of join world success");
    };

    eventResponses.world_full = () => {
        Utils.message("World is full.");
    };
};
