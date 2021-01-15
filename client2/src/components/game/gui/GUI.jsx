import React from "react";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";

function GUI() {
    return (
        <div className="gui">
            <Meters />

            <div className="top-left-corner-cont gui-zoomable">
                <GloryCounter />
                <DefenceCounter />
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
