import React, { useEffect, useState } from "react";
import { autorun, runInAction } from "mobx";
import createGame from "./PhaserConfig";
import GUI from "./gui/GUI";
import { app } from "../../shared/States";
import "./GamePage.scss";

function GamePage() {
    const [game, setGame] = useState({});
    const [loadFinished, setLoadFinished] = useState({});

    // Initial setup.
    useEffect(() => {
        autorun(() => {
            // Wait for the user to accept the finished load,
            // in case they want to finish reading a hint.
            setLoadFinished(app.loadAccepted);
        });

        runInAction(() => {
            // app.setLoading(true);
        });

        // By this point the game canvas container should be set
        // up ok, ready for the Phaser game to be injected into it.
        const theGame = createGame();
        setGame(theGame);

        theGame.scene.start("Boot");
    }, []);

    useEffect(() => {
        console.log("game set:", game);
    }, [game]);

    return (
        <div>
            <div id="game-cont" className={`normal-cursor ${loadFinished ? "fade-in" : ""}`}>
                <div id="game-canvas" />
                <GUI />
            </div>
        </div>
    );
}

export default GamePage;
