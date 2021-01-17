import React, { useState } from "react";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";
import PanelButton from "./PanelButton";
import StatsPanel from "./panels/stats_panel/StatsPanel";
import statsIcon from "../../../assets/images/gui/hud/stats-icon.png";

function GUI() {
    const [showStatsPanel, setShowStatsPanel] = useState(false);
    return (
        <div className="gui">
            <Meters />

            <div className="top-left-corner-cont gui-zoomable">
                <GloryCounter />
                <DefenceCounter />
                <PanelButton
                  icon={statsIcon}
                  onClick={() => {
                      setShowStatsPanel(!showStatsPanel);
                  }}
                  tooltip="stats tooltip"
                />
            </div>

            <div className="panel-cont">
                {showStatsPanel && (
                <StatsPanel
                  onCloseCallback={() => {
                      setShowStatsPanel(false);
                  }}
                />
                )}
            </div>

            <input
              id="chat-input"
              type="text"
              minLength="1"
              maxLength="46"
              placeholder="Enter a message"
            />
        </div>
    );
}

export default GUI;
