import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    MapContainer as Map, TileLayer, Marker, Popup, useMapEvents, Tooltip,
} from "react-leaflet";
import { CRS } from "leaflet";
import PanelTemplate from "../panel_template/PanelTemplate";
import mapIcon from "../../../../../assets/images/gui/hud/map-icon.png";
import "./MapPanel.scss";
import { PlayerState } from "../../../../../shared/state/States";

function LocationMarker() {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            let { lat, lng } = e.latlng;

            lat = parseInt(lat, 10);
            lng = parseInt(lng, 10);

            let newPosition = { lat, lng };

            // remove marker if previous position is same as new position
            if (position !== null) {
                if (position.lat === newPosition.lat
                && position.lng === newPosition.lng) {
                    newPosition = null;
                }
            }

            setPosition(newPosition);

            console.log("clicked", e);
        },
    });

    return position === null ? null : (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Marker position={position}>
            <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
                {position.lat}
                ,
                {position.lng}
            </Tooltip>
        </Marker>
    );
}

function MapPanel({ onCloseCallback }) {
    const [markers, addMarkers] = useState([]);

    const leafletConfig = {
        center: [-PlayerState.row + 32, PlayerState.col - 248],
        // center: [-100, 250],
        zoom: 3,
    };

    const addMarker = (e) => {
        console.log("adding", e);
        addMarkers([...markers, e.latlng]);
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
                  center={leafletConfig.center}
                  zoom={leafletConfig.zoom}
                  maxZoom={4}
                  minZoom={1}
                  crs={CRS.Simple}
                  doubleClickZoom={false}
                >
                    <TileLayer onClick={(e) => console.log("Hello")} url="http://127.0.0.1:4567/map/{z}/{x}/{y}.png" />
                    <Marker position={leafletConfig.center}>
                        <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
                            You
                            <br />
                            { leafletConfig.center[0] }
                            ,
                            { leafletConfig.center[1] }
                        </Tooltip>
                    </Marker>
                    <LocationMarker />
                </Map>
            </PanelTemplate>
        </div>
    );
}

MapPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default MapPanel;
