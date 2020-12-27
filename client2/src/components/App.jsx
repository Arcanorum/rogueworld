import React, { useEffect, useState } from "react";
import { autorun } from "mobx";
import LoginPage from "./login/LoginPage";
import GamePage from "./game/GamePage";
import "./App.scss";
import States from "../shared/States";

function App() {
    const [currentPage, setCurrentPage] = useState("login");

    useEffect(() => {
        autorun(() => {
            console.log("in loginpage, states changed:", States.playing);

            if (States.playing) {
                setCurrentPage("game");
            } else {
                setCurrentPage("login");
            }
        });
    }, []);

    return (
        <div className="App">
            {currentPage === "login" && <LoginPage />}
            {currentPage === "game" && <GamePage />}
        </div>
    );
}

export default App;
