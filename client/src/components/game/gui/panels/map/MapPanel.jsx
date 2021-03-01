import React from "react";
import PropTypes from "prop-types";
import {
    MapContainer as Map, TileLayer, Marker, Popup,
} from "react-leaflet";
import { CRS } from "leaflet";
import PanelTemplate from "../panel_template/PanelTemplate";
import mapIcon from "../../../../../assets/images/gui/hud/map-icon.png";
import "./MapPanel.scss";
// import { PlayerState } from "../../../../../shared/state/States";

function MapPanel({ onCloseCallback }) {
    const state = {
        // center: [-PlayerState.row, PlayerState.col],
        center: [-100, 250],
        zoom: 2,
    };

    return (
        <div className="map-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="80vw"
              height="80vh"
              panelName="World map"
              icon={mapIcon}
              onCloseCallback={onCloseCallback}
            >
                <Map
                  center={state.center}
                  zoom={state.zoom}
                  maxZoom={4}
                  minZoom={1}
                  crs={CRS.Simple}
                >
                    <TileLayer url="http://127.0.0.1:4567/map/{z}/{x}/{y}.png" />
                    {/* not sure how to add dynamic marker based on player coordinates */}
                    {/* <Marker position={state.center}>
                        <Popup>You</Popup>
                    </Marker> */}
                </Map>
            </PanelTemplate>
        </div>
    );
}

MapPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default MapPanel;
