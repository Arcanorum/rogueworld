import React, { useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import PubSub from "pubsub-js";
import gloryIcon from "../../../../assets/images/gui/hud/glory-icon.png";
import { GLORY_VALUE } from "../../../../shared/EventTypes";
import PanelButton from "../panel_button/PanelButton";
import Utils from "../../../../shared/Utils";

function GloryCounter() {
    const [glory, setGlory] = useState(0);
    // Use a string, so it will show the + when positive change.
    const [difference, setDifference] = useState("");

    const formatValue = (value) => value.toFixed(0);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(GLORY_VALUE, (msg, data) => {
                const diff = data.old - data.new;
                if (difference > 0) {
                    setDifference(`+${diff}`);
                }
                else {
                    setDifference(`${diff}`);
                }

                setGlory(data.new);
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
        <div>
            <PanelButton
              icon={gloryIcon}
              tooltipText={Utils.getTextDef("Glory tooltip")}
            />
            <AnimatedNumber
              value={glory}
              formatValue={formatValue}
              className="high-contrast-text"
            />
            <div className="text-counter text-counter-transition high-contrast-text">{difference}</div>
        </div>
    );
}

export default GloryCounter;
