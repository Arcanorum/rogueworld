import React, { useEffect, useState } from "react";
import { autorun } from "mobx";
import LoginPage from "./login/LoginPage";
import GamePage from "./game/GamePage";
import "./App.scss";
import { app } from "../shared/States";
import LoadingPage from "./loading/LoadingPage";

function App() {
    const [currentPage, setCurrentPage] = useState("login");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        autorun(() => {
            if (app.playing) {
                setCurrentPage("game");
            } else {
                setCurrentPage("login");
            }

            // Waiyt for the user to accept the finished load,
            // in case they want to finish reading a hint.
            setLoading(app.loading || !app.loadAccepted);
        });
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
