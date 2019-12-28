console.log("* Start of index");

require('./src/AccountManager').setup()
    .then(init);

async function init() {
    const wss = require('./src/Server');
    require('./src/WebSocketEvents');
    require('./src/TextDefinitionsParser');
    require('./src/items/holdable/spell_books/SpellBooksList');
    require('./src/ChatWarnings');
    require('./src/DungeonsList');
    //const clanManager = require('./src/ClanManager');
    const world = require('./src/World');
    world.init();

    // Create a finished reference to the list of items. Mainly useful for the BankManager.
    require('./src/ItemsList').LIST = require('./src/ItemsList');
    // Give all Items access to the finished EntitiesList. Needs to be done when it is finished initing, or accessing entities causes errors.
    require('./src/items/Item').prototype.EntitiesList = require('./src/EntitiesList');

    const fs = require('fs');

    function cleanUp () {
        console.log("* index.js cleanup");
        // Attempt to save the player data to local storage.
        world.accountManager.saveAllPlayersData(wss);

        // Save the clans data.
        //clanManager.saveDataToFile();

        console.log("* Exitting");


        process.exit();
    }

    //process.on('cleanup', cleanUp);

    // Do cleaning before exiting.
    process.on('exit', async () => {
        console.log("* Server exit");

        cleanUp();

        //process.emit('cleanup');
    });

    // Catch Ctrl+C event and exit normally.
    process.on('SIGINT', () => {
        console.log("* Server SIGINT");
        console.log('* * * * Ctrl-C');
        process.exit();
    });

    process.on('SIGTERM', () => {
        console.log("* Server SIGTERM");
        process.exit();
    });

    process.on('SIGHUP', () => {
        console.log("* Server SIGKILL");
        process.exit();
    });

    /**
     * Catch any uncaught exceptions (which will be most of them), then exit normally.
     */
    process.on('uncaughtException', (error) => {
        console.log("* * * * Caught exception!:", error);
        process.exit();
    });

    // Check the image exists. Catches the case that this is the deployment server
    // and thus doesn't have a client directory, and thus no type catalogue.
    if (fs.existsSync('../client/assets/img/ground.png')) {
        // Copy the tileset image sources to the client, so they are the same as what the server is using.
        // Saves having to copy over the images when a change is made to the one used in Tiled.
        fs.createReadStream('./map/tilesets/ground.png').pipe(fs.createWriteStream('../client/assets/img/ground.png'));
        fs.createReadStream('./map/tilesets/statics.png').pipe(fs.createWriteStream('../client/assets/img/statics.png'));

        console.log("* Tilesets copied to client assets.");
    }

    console.log("* End of index. Server is good to go :)");
}