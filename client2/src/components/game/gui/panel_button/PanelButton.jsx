import React, { useState } from "react";
import PropTypes from "prop-types";
import { GUIState } from "../../../../shared/state/States";
import "./PanelButton.scss";

function PanelButton({ icon, onClick, tooltip }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="panel-button">
            <img
              className={`gui-icon ${onClick ? "interactive" : ""}`}
              src={icon}
              draggable={false}
              onMouseEnter={() => {
                  setShowTooltip(true);
              }}
              onMouseLeave={() => {
                  setShowTooltip(false);
              }}
              onClick={onClick}
            />
            {showTooltip && <div className={`generic-tooltip top ${GUIState.cursorInLeftSide ? "left" : "right"}`}>{tooltip}</div>}

        </div>
    );
}

PanelButton.propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    tooltip: PropTypes.string.isRequired,
};

PanelButton.defaultProps = {
    onClick: null,
};

export default PanelButton;
