import React, { useEffect, useState } from "react";
import createGame from "./PhaserConfig";
import GUI from "./gui/GUI";

function GamePage() {
    const [game, setGame] = useState({});

    // Initial setup.
    useEffect(() => {
        console.log("game setup");

        // By this point the game canvas container should be set
        // up ok, ready for the Phaser game to be injected into it.
        const theGame = createGame();
        setGame(theGame);

        theGame.scene.start("Boot");
    }, []);

    useEffect(() => {
        console.log("game set:", game);
    }, [game]);

    // console.log("game?:", game);

    return (
        <div>
            <div id="game-cont" className="press-start-font normal-cursor">
                <div id="game-canvas" />
                <GUI />
            </div>
        </div>
    );
}

export default GamePage;
