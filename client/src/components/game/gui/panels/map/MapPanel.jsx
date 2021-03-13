import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    MapContainer, TileLayer, Marker, useMapEvents, Tooltip,
} from "react-leaflet";
import Leaflet, { CRS } from "leaflet";
import PanelTemplate from "../panel_template/PanelTemplate";
import mapIcon from "../../../../../assets/images/gui/hud/map-icon.png";
import playerIcon from "../../../../../assets/images/gui/panels/map/player-marker.png";
import destinationIcon from "../../../../../assets/images/gui/panels/map/destination-marker.png";
import "leaflet/dist/leaflet.css";
import "./MapPanel.scss";
import { ApplicationState, PlayerState } from "../../../../../shared/state/States";

const markerScale = 4;

const playerMarker = Leaflet.icon({
    iconUrl: playerIcon,
    iconSize: [12 * markerScale, 14 * markerScale],
    iconAnchor: [24, 48],
});

const locationMarker = Leaflet.icon({
    iconUrl: destinationIcon,
    iconSize: [12 * markerScale, 14 * markerScale],
    iconAnchor: [24, 48],
});

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
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={locationMarker}>
            <Tooltip className="press-start-font tooltip" direction="top" offset={[0, -44]} opacity={1} permanent>
                { `${position.lat}, ${position.lng}` }
            </Tooltip>
        </Marker>
    );
}

function MapPanel({ onCloseCallback }) {
    const leafletConfig = {
        center: [
            // The center is a decimal (with the extra half tile), so round down for display.
            Math.floor(-PlayerState.row + 32),
            Math.floor(PlayerState.col - 248 + 0.5),
        ],
        zoom: 3,
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
                <MapContainer
                  center={leafletConfig.center}
                  zoom={leafletConfig.zoom}
                  maxZoom={4}
                  minZoom={1}
                  crs={CRS.Simple}
                  doubleClickZoom={false}
                  /*
                   this should restrict the user from panning outside the map and avoid useless request to server,
                   but can't seem to find a way to dynamically set bounds based on TileLayer's LatLng
                   arrays are coordinates of southwest and northeast corner of TileLayer
                   this can cause problem if different map size is loaded
                  */
                  // bounds={[[-676, 0], [0, 774]]}
                  // maxBounds={[[-676, 0], [0, 774]]}
                  // maxBoundsViscosity={0.9}
                >
                    <TileLayer url={`${ApplicationState.httpServerURL}/map/{z}/{x}/{y}.png`} />
                    <Marker position={leafletConfig.center} icon={playerMarker}>
                        <Tooltip className="press-start-font tooltip" direction="top" offset={[0, -44]} opacity={1} permanent>
                            You
                            <br />
                            { `${leafletConfig.center[0]}, ${leafletConfig.center[1]}` }
                        </Tooltip>
                    </Marker>
                    <LocationMarker />
                </MapContainer>
            </PanelTemplate>
        </div>
    );
}

MapPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default MapPanel;
