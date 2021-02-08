import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import playButtonBorder from "../../assets/images/misc/play-button-border.png";
import hintImageBat from "../../assets/images/misc/hints/bat.png";
import "./LoadingPage.scss";
import { LOADING } from "../../shared/EventTypes";
import { ApplicationState } from "../../shared/state/States";

function LoadingPage() {
    const [hint, setHint] = useState("Some creatures only come out at night.");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOADING, (msd, data) => {
                setLoading(data.new);
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    const nextHintPressed = () => {
        // ApplicationState.setLoading(false);
    };

    const playPressed = () => {
        ApplicationState.setLoadAccepted(true);
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
