import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import createGame from "./PhaserConfig";
import GUI from "./gui/GUI";
import { ApplicationState } from "../../shared/state/States";
import { LOAD_ACCEPTED } from "../../shared/EventTypes";
import { removeGameEventResponses } from "../../network/websocket_events/WebSocketEvents";
import "./GamePage.scss";

function GamePage() {
    const [loadFinished, setLoadFinished] = useState({});

    // Initial setup.
    useEffect(() => {
        // Show the loading screen, then start loading the game.
        ApplicationState.setLoading(true);

        const subs = [
            PubSub.subscribe(LOAD_ACCEPTED, (msg, data) => {
                // Wait for the user to accept the finished load,
                // in case they want to finish reading a hint.
                setLoadFinished(data.new);
            }),
        ];

        // By this point the game canvas container should be set
        // up ok, ready for the Phaser game to be injected into it.
        const gameInstance = createGame();

        gameInstance.scene.start("Boot");

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });

            // Remove the gameplay event listeners, or they will
            // throw errors without the game instance to use.
            removeGameEventResponses();

            // Destroy the Phaser game instance.
            gameInstance.destroy(true);
        };
    }, []);

    const loseAllInputFocus = () => {
        document.querySelectorAll("input")
            .forEach((input) => input.blur());
    };

    return (
        <div>
            <div id="game-cont" className={`normal-cursor ${loadFinished ? "fade-in" : ""}`}>
                <div id="game-canvas" onClick={loseAllInputFocus} />
                <GUI />
            </div>
        </div>
    );
}

export default GamePage;
