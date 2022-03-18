import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { JOINED, LOADING, LOAD_ACCEPTED } from '../shared/EventTypes';
import { ApplicationState } from '../shared/state';
import GamePage from './game/GamePage';
import Hints from './loading/Hints';
import LoadingPage from './loading/LoadingPage';
import LoginPage from './login/LoginPage';

type Page = 'login' | 'game';

function App() {
    const [currentPage, setCurrentPage] = useState<Page>('login');
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
