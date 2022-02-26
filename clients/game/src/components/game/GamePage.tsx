import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import createGame from '../../game/PhaserConfig';
import GUI from './gui/GUI';
import { ApplicationState } from '../../shared/state';
import { LOAD_ACCEPTED, BEFORE_PAGE_UNLOAD } from '../../shared/EventTypes';
import { removeGameEventResponses } from '../../network/websocket_events/WebSocketEvents';
import styles from './GamePage.module.scss';
import Config from '../../shared/Config';

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

        gameInstance.scene.start('Boot');

        // Add handler to browser event to prevent closing game by
        // misclick, if client is not in devmode.
        if (Config.devMode === false) {
            window.onbeforeunload = () => {
                PubSub.publish(BEFORE_PAGE_UNLOAD);
                return ('');
            };
        }

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
        document.querySelectorAll('input')
            .forEach((input) => input.blur());
    };

    return (
        <div>
            <div id={styles['game-cont']} className={`${loadFinished ? styles['fade-in'] : ''}`}>
                <div id={styles['game-canvas']} onClick={loseAllInputFocus} />
                <GUI />
            </div>
        </div>
    );
}

export default GamePage;
