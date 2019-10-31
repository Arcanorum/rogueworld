
"use strict";

(function () {
    // Load the saved renderer preference.
    window.renderer = localStorage.getItem('renderer') || 'webgl';
    let renderer = Phaser.WEBGL;
    if(window.renderer === 'canvas'){
        renderer = Phaser.CANVAS;
    }

    const game = new Phaser.Game(100, 100, renderer, '', null, true, false);

    game.state.add('Game',              dungeonz.Game);
    game.state.add('Boot',              dungeonz.Boot);

    game.state.start('Boot');

    // Check if the game should be run in dev mode by checking if a file exists.
    const http = new XMLHttpRequest();
    // This file only exists in the server directory, which only the developer has.
    // Load it synchronously with false.
    http.open('HEAD', "../server/admin-commands", false);
    http.send();
    if(http.status === 200){
        console.log("* Running in dev mode.");
        window.devMode = true;
    }
    else {
        console.log("* Running in prod mode.");
        window.devMode = false;
    }

})();