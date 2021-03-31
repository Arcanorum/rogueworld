import React, { useEffect, useState } from "react";
import AnimatedNumber from "animated-number-react";
import PubSub from "pubsub-js";
import defenceIcon from "../../../../assets/images/gui/hud/defence-icon.png";
import { DEFENCE_VALUE } from "../../../../shared/EventTypes";
import Utils from "../../../../shared/Utils";
import PanelButton from "../panel_button/PanelButton";
import "./DefenceCounter.scss";

function DefenceCounter() {
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
        <div className="defence-counter">
            <PanelButton
              icon={defenceIcon}
              tooltipText={Utils.getTextDef("Defence tooltip")}
            />
            <AnimatedNumber
              value={defence}
              formatValue={formatValue}
              className="high-contrast-text"
            />
        </div>
    );
}

export default DefenceCounter;
