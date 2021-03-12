import React, { useState } from "react";
import PropTypes from "prop-types";
import { GUIState } from "../../../../shared/state/States";
import "./PanelButton.scss";

function Tooltip(content) {
    return (
        <div className="tooltip-panel-button">
            {content}
        </div>
    );
}

function PanelButton({ icon, onClick, tooltipText }) {
    return (
        <div className="panel-button">
            <img
              className={`gui-icon ${onClick ? "interactive" : ""}`}
              src={icon}
              draggable={false}
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      Tooltip(tooltipText),
                  );
              }}
              onMouseLeave={() => {
                  GUIState.setTooltipContent(null);
              }}
              onClick={onClick}
            />
        </div>
    );
}

PanelButton.propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    tooltipText: PropTypes.string.isRequired,
};

PanelButton.defaultProps = {
    onClick: null,
};

export default PanelButton;
