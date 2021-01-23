import React, { useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import PubSub from "pubsub-js";
import defenceIcon from "../../../../assets/images/gui/hud/defence-icon.png";
import { DEFENCE_VALUE } from "../../../../shared/EventTypes";

function DefenceCounter() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [defence, setDefence] = useState(0);

    const formatValue = (value) => value.toFixed(0);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(DEFENCE_VALUE, (msg, data) => {
                setDefence(data.new);
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
              src={defenceIcon}
              draggable={false}
              onMouseEnter={() => {
                  setShowTooltip(true);
              }}
              onMouseLeave={() => {
                  setShowTooltip(false);
              }}
            />
            <AnimatedNumber
              value={defence}
              formatValue={formatValue}
              className="high-contrast-text"
            />
            {showTooltip && <div className="generic-tooltip top left">Defence tooltip text</div>}
        </div>
    );
}

export default DefenceCounter;
