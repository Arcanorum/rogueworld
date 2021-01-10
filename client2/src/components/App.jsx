import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import LoginPage from "./login/LoginPage";
import GamePage from "./game/GamePage";
import LoadingPage from "./loading/LoadingPage";
import { ApplicationState } from "../shared/state/States";
import { LOADING, JOINED } from "../shared/EventTypes";
import "./App.scss";

function App() {
    const [currentPage, setCurrentPage] = useState("login");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(JOINED, (msg, data) => {
                if (data.new) {
                    setCurrentPage("game");
                } else {
                    setCurrentPage("login");
                }
            }),
            PubSub.subscribe(LOADING, (msg, data) => {
                // Wait for the user to accept the finished load,
                // in case they want to finish reading a hint.
                setLoading(ApplicationState.loading || !ApplicationState.loadAccepted);
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="App press-start-font">
            {currentPage === "login" && <LoginPage />}
            {currentPage === "game" && <GamePage />}
            {loading && <LoadingPage />}
        </div>
    );
}

export default App;
