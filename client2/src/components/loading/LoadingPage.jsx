import React, { useEffect, useState } from "react";
import "./LoadingPage.scss";
import { autorun } from "mobx";
import playButtonBorder from "./assets/play-button-border.png";
import hintImageBat from "./assets/hints/bat.png";
import { app } from "../../shared/States";

function LoadingPage() {
    const [hint, setHint] = useState("Some creatures only come out at night.");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        autorun(() => {
            setLoading(app.loading);
        });
    }, []);

    const nextHintPressed = () => {
        app.setLoading(false);
    };

    const playPressed = () => {
        app.setLoadAccepted(true);
    };

    return (
        <div className="loading-page">

            {loading && (
            <div className="loading-heading">
                Loading...
            </div>
            )}
            {!loading && (
            <div className="loading-heading">Game loaded</div>
            )}

            <div className="loading-hint-cont">
                <div className="col image">
                    <img src={hintImageBat} className="loading-hint-image" />
                </div>
                <div className="col loading-hint-text">
                    {hint}
                </div>
            </div>

            <div className="loading-next-hint-button" onClick={nextHintPressed}>
                Next hint
            </div>

            {!loading && (
            <div className="loading-play-button-cont" onClick={playPressed}>
                <img className="loading-play-button-border" src={playButtonBorder} />
                <div className="loading-play-text">
                    Play
                </div>
            </div>
            )}
            {loading && (
            <div />
            )}

        </div>
    );
}

export default LoadingPage;
