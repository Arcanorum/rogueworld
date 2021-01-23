import React, { useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import PubSub from "pubsub-js";
import gloryIcon from "../../../../assets/images/gui/hud/glory-icon.png";
import { GLORY_VALUE } from "../../../../shared/EventTypes";

function GloryCounter() {
    const [showTooltip, setShowTooltip] = useState(false);
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
        <div className="inline-cont">
            <img
              className="gui-icon"
              src={gloryIcon}
              draggable={false}
              onMouseEnter={() => {
                  setShowTooltip(true);
              }}
              onMouseLeave={() => {
                  setShowTooltip(false);
              }}
            />
            <AnimatedNumber
              value={glory}
              formatValue={formatValue}
              className="high-contrast-text"
            />
            <div className="text-counter text-counter-transition high-contrast-text">{difference}</div>
            {showTooltip && <div className="generic-tooltip top left">Glory tooltip text</div>}
        </div>
    );
}

export default GloryCounter;
