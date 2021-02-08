import React, { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import Utils from "../../../../shared/Utils";
import "./DungeonTimer.scss";
import { DUNGEON_TIME_LIMIT_MINUTES } from "../../../../shared/EventTypes";

let timerLoop = 0;

function DungeonTimer() {
    const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);

    const countDown = () => {
        setTimeRemainingSeconds(timeRemainingSeconds - 1);
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(DUNGEON_TIME_LIMIT_MINUTES, (msg, timeRemainingMinutes) => {
                // Clear any existing loop.
                clearTimeout(timerLoop);

                // Add one so they don't lo se one second immediately.
                setTimeRemainingSeconds(timeRemainingMinutes * 60);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });

            clearTimeout(timerLoop);
        };
    }, []);

    useEffect(() => {
        if (timeRemainingSeconds > 0) {
            timerLoop = setTimeout(countDown, 1000);
        }
    }, [timeRemainingSeconds]);

    return (
        <>
            {timeRemainingSeconds && (
            <div className="dungeon-timer-cont">
                <div className="text">{`${Utils.getTextDef("Time remaining")}:`}</div>
                <div className="value">{timeRemainingSeconds}</div>
            </div>
            )}
        </>
    );
}

export default DungeonTimer;
