import React, { useState } from "react";
import PropTypes from "prop-types";

function PanelButton({ icon, onClick, tooltip }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div>
            <div>
                <img
                  className="gui-icon"
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
                {showTooltip && <div className="meter-tooltip generic-tooltip left">{tooltip}</div>}
            </div>
        </div>
    );
}

PanelButton.propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired,
};

export default PanelButton;
