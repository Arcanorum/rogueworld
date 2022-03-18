import Leaflet, { CRS, LatLngLiteral, LatLngTuple } from 'leaflet';
import { useState } from 'react';
import {
    MapContainer, Marker, TileLayer, Tooltip, useMapEvents,
} from 'react-leaflet';
import mapIcon from '../../../../../assets/images/gui/hud/map-icon.png';
import destinationIcon from '../../../../../assets/images/gui/panels/map/destination-marker.png';
import playerIcon from '../../../../../assets/images/gui/panels/map/player-marker.png';
import { ApplicationState, PlayerState } from '../../../../../shared/state';
import PanelTemplate from '../panel_template/PanelTemplate';
import styles from './MapPanel.module.scss';
import panelTemplateStyles from '../panel_template/PanelTemplate.module.scss';

const markerScale = 4;

const playerMarker = Leaflet.icon({
    iconUrl: playerIcon.src,
    iconSize: [12 * markerScale, 14 * markerScale],
    iconAnchor: [24, 48],
});

const locationMarker = Leaflet.icon({
    iconUrl: destinationIcon.src,
    iconSize: [12 * markerScale, 14 * markerScale],
    iconAnchor: [24, 48],
});

type Position = LatLngLiteral | null;

function LocationMarker() {
    const [position, setPosition] = useState<Position>(null);

    useMapEvents({
        click(e) {
            let { lat, lng } = e.latlng;

            lat = Math.floor(lat);
            lng = Math.floor(lng);
            lng += 0.5;

            let newPosition: Position = { lat, lng };

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
            <Tooltip className={`press-start-font ${styles.tooltip}`} direction="top" offset={[0, -44]} opacity={1} permanent>
                { `X: ${Math.abs(Math.floor(position.lng))}, Y: ${Math.abs(position.lat)}` }
            </Tooltip>
        </Marker>
    );
}

function MapPanel({ onCloseCallback }: { onCloseCallback: () => void }) {
    const leafletConfig = {
        center: [
            -PlayerState.row,
            PlayerState.col + 1 - 0.5,
        ] as LatLngTuple,
        zoom: 3,
    };

    return (
        <div className={`${styles['map-panel']} ${panelTemplateStyles.centered} ${panelTemplateStyles['panel-template-cont']}`}>
            <PanelTemplate
                width="80vw"
                height="80vh"
                panelName="World map"
                icon={mapIcon.src}
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
                    <TileLayer url={`${ApplicationState.mapServiceHTTPServerURL}/map/{z}/{x}/{y}.png`} />
                    <Marker position={leafletConfig.center} icon={playerMarker}>
                        <Tooltip className={`press-start-font ${styles.tooltip}`} direction="top" offset={[0, -44]} opacity={1} permanent>
                            You
                            <br />
                            {/* The center is a decimal (with the extra half tile), so round down for display. */}
                            { `X: ${Math.abs(Math.floor(leafletConfig.center[1]))}, Y: ${Math.abs(leafletConfig.center[0])}` }
                        </Tooltip>
                    </Marker>
                    <LocationMarker />
                </MapContainer>
            </PanelTemplate>
        </div>
    );
}

export default MapPanel;
