import { message } from '@dungeonz/utils';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import Config from '../shared/Config';
import { JOINED, LOADING, LOAD_ACCEPTED } from '../shared/EventTypes';
import { ApplicationState } from '../shared/state';
import GamePage from './game/GamePage';
import Hints from './loading/Hints';
import LoadingPage from './loading/LoadingPage';
import LoginPage from './login/LoginPage';

// Check if the game should be run in dev mode by checking if it is localhost, or what other server to
// connect to based on the domain, i.e. go to test server for test.dungeonz.io, or live server for dungeonz.io
if (
    (window as any).location.hostname === 'localhost' ||
    (window as any).location.hostname === '127.0.0.1' ||
    (window as any).location.hostname === ''
) {
    message('Running in dev mode.');
    Config.devMode = true;
    Config.host = 'local';
}
else if ((window as any).location.hostname === 'test.dungeonz.io') {
    message('Running in test mode.');
    Config.devMode = false;
    Config.host = 'test';
}
else {
    message('Running in prod mode.');
    Config.devMode = false;
    Config.host = 'live';
}

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Hide the initial page load loading message.
        document.getElementById('page-load')!.style.display = 'none';

        // Preload the hint images, or they might not be ready during the loading screen, which makes them a bit pointless.
        Hints.forEach((hintConfig) => {
            new Image().src = hintConfig.image;
        });

        const onLoadEvent = () => {
            // Wait for the user to accept the finished load,
            // in case they want to finish reading a hint.
            setLoading(ApplicationState.loading || !ApplicationState.loadAccepted);
        };

        const subs = [
            PubSub.subscribe(JOINED, (msg, data) => {
                if (data.new) {
                    setCurrentPage('game');
                }
                else {
                    setCurrentPage('login');
                }
            }),
            PubSub.subscribe(LOADING, onLoadEvent),
            PubSub.subscribe(LOAD_ACCEPTED, onLoadEvent),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="press-start-font normal-cursor">
            {currentPage === 'login' && <LoginPage />}
            {currentPage === 'game' && <GamePage />}
            {loading && <LoadingPage />}
        </div>
    );
}

export default App;
