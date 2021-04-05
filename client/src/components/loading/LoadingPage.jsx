import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import playButtonBorder from "../../assets/images/misc/play-button-border.png";
import hintImageBat from "../../assets/images/misc/hints/bat.png";
import "./LoadingPage.scss";
import { LOADING, LOAD_PROGRESS, LOAD_FILE_PROGRESS } from "../../shared/EventTypes";
import { ApplicationState } from "../../shared/state/States";
import Utils from "../../shared/Utils";

function LoadingBar() {
    const [progress, setProgress] = useState("0%");
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOAD_PROGRESS, (msg, data) => {
                setProgress(`${Math.floor(data * 100)}%`);
            }),
            PubSub.subscribe(LOAD_FILE_PROGRESS, (msg, data) => {
                setFileName(data);
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
        <div className="progress-bar">
            <div className="filled" style={{ width: progress }} />
            <div className="info">
                <div className="percent">{progress}</div>
                <div className="file-name">{`( ${fileName} )`}</div>
            </div>
        </div>
    );
}

function LoadingPage() {
    const [hint, setHint] = useState("Some creatures only come out at night.");
    const [loading, setLoading] = useState(ApplicationState.loading);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOADING, (msg, data) => {
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
                <div className="heading animated-ellipsis">
                    {Utils.getTextDef("Loading")}
                </div>
            )}
            {!loading && (
                <div className="heading">{Utils.getTextDef("Game loaded")}</div>
            )}

            <div className="loading-hint-cont">
                <div className="col image">
                    <img src={hintImageBat} className="loading-hint-image" draggable={false} />
                </div>
                <div className="col loading-hint-text">
                    {hint}
                </div>
            </div>

            <div className="loading-next-hint-button" onClick={nextHintPressed}>
                {Utils.getTextDef("Next hint")}
            </div>

            {!loading && (
                <div className="loading-play-button-cont" onClick={playPressed}>
                    <img className="loading-play-button-border" src={playButtonBorder} draggable={false} />
                    <div className="loading-play-text">{Utils.getTextDef("Play")}</div>
                </div>
            )}
            {loading && (
                <LoadingBar />
            )}
        </div>
    );
}

export default LoadingPage;
