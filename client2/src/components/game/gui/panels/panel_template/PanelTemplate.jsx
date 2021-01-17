import React from "react";
import PropTypes from "prop-types";
import "./PanelTemplate.scss";
import closeButtonImage from "../../../../../assets/images/gui/panels/panel-close-button.png";
import cornerImage from "../../../../../assets/images/gui/panels/panel-corner.png";
import iconBorderImage from "../../../../../assets/images/gui/panels/panel-icon-border.png";

function PanelTemplate({
    children, width, height, panelName, icon, onCloseCallback,
}) {
    return (
        <div
          className="panel-template-main-cont"
          style={{ width: `${width}px`, height: `${height}px` }}
          draggable={false}
        >
            <img
              src={iconBorderImage}
              className="centered panel-template-icon-border"
              draggable={false}
            />

            <div className="panel-template-name-border">
                {`\xa0\xa0${panelName}`}
            </div>

            <div className="panel-template-name">
                {`\xa0\xa0${panelName}`}
            </div>

            <img
              src={icon}
              className="centered panel-template-icon"
              draggable={false}
            />

            {onCloseCallback && (
            <img
              src={closeButtonImage}
              className="centered panel-template-close-button"
              draggable={false}
              onClick={onCloseCallback}
            />
            )}
            {!onCloseCallback && (
            <img
              src={cornerImage}
              className="centered panel-template-top-corner"
              draggable={false}
            />
            )}

            <img
              src={iconBorderImage}
              className="centered panel-template-left-corner"
              draggable={false}
            />

            <img
              src={iconBorderImage}
              className="centered panel-template-right-corner"
              draggable={false}
            />

            <div className="panel-template-contents-cont">
                {children}
            </div>
        </div>
    );
}

PanelTemplate.propTypes = {
    children: PropTypes.node.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    panelName: PropTypes.string,
    onCloseCallback: PropTypes.func,
};

PanelTemplate.defaultProps = {
    panelName: "",
    onCloseCallback: false,
};

export default PanelTemplate;
