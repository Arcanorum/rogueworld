/* eslint-disable global-require */
const fs = require("fs");
const { exec } = require("child_process");
const { extrudeTilesetToImage } = require("tile-extruder");
const settings = require("./settings");
const Utils = require("./src/Utils");
const ItemsLoader = require("./src/items/ItemsLoader");
const EntitiesLoader = require("./src/entities/EntitiesLoader");
const StarterInventoryItemConfigs = require("./src/inventory/StarterInventoryItemConfigs");
const StarterBankItemConfigs = require("./src/bank/StarterBankItemConfigs");
const CraftingRecipesLoader = require("./src/crafting/CraftingRecipesLoader");
const ShopsLoader = require("./src/shops/ShopsLoader");
const RewardListLoader = require("./src/tasks/RewardsListLoader");

Utils.message("Start of index");

async function init() {
    const { wss } = require("./src/Server");

    ItemsLoader.populateList();
    ShopsLoader.populateList();
    EntitiesLoader.populateList();

    ItemsLoader.initialiseList();
    ShopsLoader.initialiseList();
    EntitiesLoader.initialiseList();

    // Do these after the items list is set up, as they need to check the items they use are valid.
    CraftingRecipesLoader.populateList();
    StarterInventoryItemConfigs.populateList();
    StarterBankItemConfigs.populateList();
    RewardListLoader.populateList();

    ItemsLoader.createCatalogue();
    EntitiesLoader.createCatalogue();
    CraftingRecipesLoader.createCatalogue();
    ShopsLoader.createCatalogue();

    require("./src/WebSocketEvents");
    require("./src/scripts/TextDefinitionsParser");
    // require("./src/items/holdable/spell_books/SpellBooksList");
    require("./src/ChatWarnings");

    // const clanManager = require("./src/ClanManager");
    const world = require("./src/World");
    world.init();

    const AccountManager = require("./src/account/AccountManager");
    await AccountManager.setup(world);

    require("./src/scripts/CatalogueBuilders").buildDungeonPrompts();

    // Give all Items access to the finished EntitiesList. Needs to be done when it is finished initing, or accessing entities causes errors.
    require("./src/items/classes/Item").prototype.EntitiesList = require("./src/entities/EntitiesList");

    function cleanUp() {
        Utils.message("index.js cleanup");

        Utils.message("Exitting");

        process.exit();
    }

    // process.on("cleanup", cleanUp);

    // Do cleaning before exiting.
    process.on("exit", async () => {
        Utils.message("Server exit");

        cleanUp();

        // process.emit("cleanup");
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
    if (fs.existsSync("../client/src/assets/images") === false) {
        fs.mkdirSync("../client/src/assets/images");
    }
    // Copy the tileset image sources to the client, so they are the same as what the server is using.
    // Saves having to copy over the images when a change is made to the one used in Tiled.
    // Also extrudes them by 1 pixel in each direction, as Phaser 3 has some issues with exact size tiles.
    // https://phaser.io/news/2018/05/webgl-tile-extruder
    await extrudeTilesetToImage(16, 16, "./map/tilesets/ground.png", "../client/src/assets/images/ground.png");
    await extrudeTilesetToImage(16, 16, "./map/tilesets/statics.png", "../client/src/assets/images/statics.png");

    Utils.message("Tilesets copied to client assets.");

    // Rebuild the client as some of the resources it uses might have been updated by the server init.
    // Should only need to do this for a prod build, as the Webpack dev server should take care of
    // detecting changes and rebuilding the client during development.
    // if (settings.DEV_MODE === false) {
    //     Utils.message("In prod mode. Starting to build client.");

    //     exec("cd .. && npm run client", (error, stdout, stderr) => {
    //         if (error || stderr) {
    //             Utils.error(error || stderr);
    //         }
    //         // Uncomment to see the output logs of building the client.
    //         // Utils.message(stdout);

    //         Utils.message("Finished building client.");
    //     });
    // }

    Utils.message("End of index. Server is good to go. :)");
    Utils.message("Game can be played at http://localhost:4567");
}

init();
