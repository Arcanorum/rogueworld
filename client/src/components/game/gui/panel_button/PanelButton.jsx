import React from "react";
import PropTypes from "prop-types";
import { GUIState } from "../../../../shared/state/States";
import "./PanelButton.scss";
import dungeonz from "../../../../shared/Global";

function Tooltip(content) {
    return (
        <div className="tooltip-panel-button">
            {content}
        </div>
    );
}

function PanelButton({
    icon, onClick, tooltipText, className,
}) {
    return (
        <div className={`panel-button ${className}`}>
            <img
              className={`gui-icon ${onClick ? "interactive hand-cursor" : ""}`}
              src={icon}
              draggable={false}
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      Tooltip(tooltipText),
                  );
                  dungeonz.gameScene.soundManager.effects.playGUITick();
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
    className: PropTypes.string,
};

PanelButton.defaultProps = {
    onClick: null,
    className: "",
};

export default PanelButton;
