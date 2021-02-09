import React from "react";
import PropTypes from "prop-types";
import PanelTemplate from "../panel_template/PanelTemplate";
import mapIcon from "../../../../../assets/images/gui/hud/map-icon.png";
import "./MapPanel.scss";

function MapPanel({ onCloseCallback }) {
    return (
        <div className="map-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="80vw"
              height="80vh"
              panelName="World map"
              icon={mapIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont" />
            </PanelTemplate>
        </div>
    );
}

MapPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default MapPanel;
