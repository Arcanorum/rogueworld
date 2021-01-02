import React from "react";
import Meters from "./meters/Meters";
import "./GUI.scss";

function GUI() {
    return (
        <div>
            <Meters />

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
