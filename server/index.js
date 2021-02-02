require("./settings");
const fs = require("fs");
const { exec } = require("child_process");
const { extrudeTilesetToImage } = require("tile-extruder");
const Utils = require("./src/Utils");
const ItemsLoader = require("./src/ItemsLoader");
const EntitiesLoader = require("./src/EntitiesLoader");

Utils.message("Start of index");

async function init() {
    const { wss } = require("./src/Server");

    ItemsLoader.populateList();
    EntitiesLoader.populateList();

    ItemsLoader.initialiseList();
    EntitiesLoader.initialiseList();

    ItemsLoader.createCatalogue();
    EntitiesLoader.createCatalogue();

    const AccountManager = require("./src/AccountManager");
    await AccountManager.setup();

    require("./src/WebSocketEvents");
    require("./src/TextDefinitionsParser");
    require("./src/items/holdable/spell_books/SpellBooksList");
    require("./src/ChatWarnings");

    //const clanManager = require("./src/ClanManager");
    const world = require("./src/World");
    world.init();

    require("./src/CatalogueBuilders").buildDungeonPrompts();

    // Create a finished reference to the list of items. Mainly useful for the BankManager.
    require("./src/ItemsList").LIST = require("./src/ItemsList");
    // Give all Items access to the finished EntitiesList. Needs to be done when it is finished initing, or accessing entities causes errors.
    require("./src/items/Item").prototype.EntitiesList = require("./src/EntitiesList");

    function cleanUp() {
        Utils.message("index.js cleanup");
        // Attempt to save the player data to local storage.
        world.accountManager.saveAllPlayersData(wss);

        // Save the clans data.
        //clanManager.saveDataToFile();

        Utils.message("Exitting");

        process.exit();
    }

    //process.on("cleanup", cleanUp);

    // Do cleaning before exiting.
    process.on("exit", async () => {
        Utils.message("Server exit");

        cleanUp();

        //process.emit("cleanup");
    });

    // Catch Ctrl+C event and exit normally.
    process.on("SIGINT", () => {
        Utils.message("Server SIGINT");
        Utils.message("* * * Ctrl-C");
        process.exit();
    });

    process.on("SIGTERM", () => {
        Utils.message("Server SIGTERM");
        process.exit();
    });

    process.on("SIGHUP", () => {
        Utils.message("Server SIGKILL");
        process.exit();
    });

    /**
     * Catch any uncaught exceptions (which will be most of them), then exit normally.
     */
    process.on("uncaughtException", (error) => {
        Utils.message("* * * Caught exception!:", error);
        process.exit();
    });

    // Check the location to write to exists. If not, create it.
    if (fs.existsSync("../client/assets/img") === false) {
        fs.mkdirSync("../client/assets/img");
    }
    // Copy the tileset image sources to the client, so they are the same as what the server is using.
    // Saves having to copy over the images when a change is made to the one used in Tiled.
    // Also extrudes them by 1 pixel in each direction, as Phaser 3 has some issues with exact size tiles.
    // https://phaser.io/news/2018/05/webgl-tile-extruder
    await extrudeTilesetToImage(16, 16, "./map/tilesets/ground.png", "../client/assets/img/ground.png");
    await extrudeTilesetToImage(16, 16, "./map/tilesets/statics.png", "../client/assets/img/statics.png");

    Utils.message("Tilesets copied to client assets.");

    // Rebuild the client as some of the resources it uses might have been updated by the server init.
    exec("cd .. && npm run client", (error, stdout, stderr) => {
        if (error || stderr) {
            Utils.error(error || stderr);
        }
        // Uncomment to see the output logs of building the client.
        // Utils.message(stdout);

        Utils.message("Finished building client.");
    });

    Utils.message("End of index. Server is good to go. :)");
    Utils.message("Game can be played at http://localhost:4567");
}

init();