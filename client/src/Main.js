(function () {
    const game = new Phaser.Game({
        type: Phaser.WEBGL,
        parent: "game_canvas",
        width: 100,
        height: 100,
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            fullscreenTarget: "game_cont",
        },
        scene: [dungeonz.Boot, dungeonz.Game]
    });

    game.scene.start("Boot");

    // Check if the game should be run in dev mode by checking if it is localhost, or what other server to
    // connect to based on the domain, i.e. go to test server for test.dungeonz.io, or live server for dungeonz.io
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        console.log("* Running in dev mode.");
        window.devMode = true;
        window.host = "local";
    }
    else if (location.hostname === "test.dungeonz.io") {
        console.log("* Running in test mode.");
        window.devMode = true;
        window.host = "test";
    }
    else {
        console.log("* Running in prod mode.");
        window.devMode = false;
        window.host = "live";
    }
})();