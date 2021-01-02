import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { player } from "../../../../shared/States";
import hitpointIcon from "../../../../assets/images/gui/hud/hitpoint-icon.png";
import hitpointCounter from "../../../../assets/images/gui/hud/hitpoint-counter.png";
import energyIcon from "../../../../assets/images/gui/hud/energy-icon.png";
import energyCounter from "../../../../assets/images/gui/hud/energy-counter.png";
import emptyCounter from "../../../../assets/images/gui/hud/empty-counter.png";
import "./Meters.scss";

// How many of the little circle counters to show on each meter bar.
const maxCounters = 20;

const Counters = observer(({ stat, maxStat, counterImage }) => {
    // The value might be in 0.5s as well as whole numbers, so round down to only count each full counter.
    stat = Math.floor(stat);
    // Get the % of the stat this player has. i.e.
    const filledCount = Math.floor((stat / maxStat) * maxCounters);
    // Add some counters, up to the max amount, and show them filled in
    // if they are within the amount of HP/energy that the player has.
    return Array.from({ length: maxCounters }, (v, i) => {
        if (i < filledCount) {
            return <img src={counterImage} draggable={false} className="meter-counter" />;
        }
        return <img src={emptyCounter} draggable={false} className="meter-counter" />;
    });
});

function Meters() {
    const [showHitPointTooltip, setShowHitPointTooltip] = useState(false);
    const [showEnergyTooltip, setShowEnergyTooltip] = useState(false);

    return (
        <div className="meters gui-zoomable">
            <div className="meter inline-cont">
                <img
                  className="gui-icon"
                  src={hitpointIcon}
                  draggable={false}
                  onMouseEnter={() => {
                      setShowHitPointTooltip(true);
                  }}
                  onMouseLeave={() => {
                      setShowHitPointTooltip(false);
                  }}
                />
                <div>
                    <Counters
                      stat={player.hitPoints}
                      maxStat={player.maxHitPoints}
                      counterImage={hitpointCounter}
                    />
                </div>
                {showHitPointTooltip && <div className="meter-tooltip top-left-tooltip generic-tooltip">Hitpoint tooltip text</div>}
            </div>
            <div className="meter inline-cont">
                <img
                  className="gui-icon"
                  src={energyIcon}
                  draggable={false}
                  onMouseEnter={() => {
                      setShowEnergyTooltip(true);
                  }}
                  onMouseLeave={() => {
                      setShowEnergyTooltip(false);
                  }}
                />
                <div id="energy-counters">
                    <Counters
                      stat={player.energy}
                      maxStat={player.maxEnergy}
                      counterImage={energyCounter}
                    />
                </div>
                {showEnergyTooltip && <div className="meter-tooltip top-left-tooltip generic-tooltip">Energy tooltip text</div>}
            </div>
        </div>
    );
}

export default Meters;
