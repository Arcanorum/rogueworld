import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PanelTemplate from "../panel_template/PanelTemplate";
import settingsIcon from "../../../../../assets/images/gui/panels/settings/settings-icon.png";
import toggleActiveIcon from "../../../../../assets/images/gui/panels/settings/toggle-active.png";
import toggleInactiveIcon from "../../../../../assets/images/gui/panels/settings/toggle-inactive.png";
import plusIcon from "../../../../../assets/images/gui/hud/plus-icon.png";
import minusIcon from "../../../../../assets/images/gui/hud/minus-icon.png";
import Utils from "../../../../../shared/Utils";
import "./SettingsPanel.scss";
import gameConfig from "../../../../../shared/GameConfig";
import dungeonz from "../../../../../shared/Global";
import { GUIState } from "../../../../../shared/state/States";

function MinusButton({ state, setter }) {
    return (
        <img
          src={minusIcon}
          className={`button ${state === 0 ? "disabled" : ""}`}
          draggable={false}
          onClick={() => {
              setter((state - 5));
          }}
        />
    );
}

MinusButton.propTypes = {
    state: PropTypes.number.isRequired,
    setter: PropTypes.func.isRequired,
};

function PlusButton({ state, setter }) {
    return (
        <img
          src={plusIcon}
          className={`button ${state === 200 ? "disabled" : ""}`}
          draggable={false}
          onClick={() => {
              setter((state + 5));
          }}
        />
    );
}

PlusButton.propTypes = {
    state: PropTypes.number.isRequired,
    setter: PropTypes.func.isRequired,
};

function SettingsPanel({ onCloseCallback }) {
    const [fullscreen, setFullscreen] = useState(dungeonz.gameScene.scale.isFullscreen);
    const [musicVolume, setMusicVolume] = useState(GUIState.musicVolume);
    const [effectsVolume, setEffectsVolume] = useState(GUIState.effectsVolume);
    const [guiScale, setGUIScale] = useState(GUIState.guiScale);
    const [autoAddToHotbar, setAutoAddToHotbar] = useState(GUIState.autoAddToHotbar);
    const [lightFlickerEnabled, setLightFlickerEnabled] = useState(GUIState.lightFlickerEnabled);
    const [showFPS, setShowFPS] = useState(GUIState.showFPS);

    const saveSetting = (key, value) => {
        try {
            // Save the setting to local storage.
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            Utils.warning(error);
        }
    };

    const onFullscreenTogglePressed = () => {
        if (dungeonz.gameScene.scale.isFullscreen) {
            dungeonz.gameScene.scale.stopFullscreen();
        }
        else {
            dungeonz.gameScene.scale.startFullscreen();
        }

        setFullscreen(!dungeonz.gameScene.scale.isFullscreen);
    };

    const onLightFlickerTogglePressed = () => {
        GUIState.lightFlickerEnabled = !lightFlickerEnabled;

        setLightFlickerEnabled(!lightFlickerEnabled);

        saveSetting("light_flicker_enabled", !lightFlickerEnabled);
    };

    const onAutoAddToHotbarTogglePressed = () => {
        GUIState.autoAddToHotbar = !autoAddToHotbar;

        setAutoAddToHotbar(!autoAddToHotbar);

        saveSetting("auto_add_to_hotbar", !autoAddToHotbar);
    };

    const onShowFPSTogglePressed = () => {
        GUIState.showFPS = !showFPS;

        setAutoAddToHotbar(!showFPS);

        saveSetting("show_fps", !autoAddToHotbar);
    };

    useEffect(() => {
        console.log("musicVolume effect:", musicVolume);
        if (musicVolume > 200) {
            setMusicVolume(200);
        }
        else if (musicVolume < 0) {
            setMusicVolume(0);
        }

        saveSetting("music_volume", musicVolume);
    }, [musicVolume]);

    useEffect(() => {
        console.log("effectsVolume effect:", effectsVolume);
        if (effectsVolume > 200) {
            setEffectsVolume(200);
        }
        else if (effectsVolume < 0) {
            setEffectsVolume(0);
        }

        saveSetting("effects_volume", effectsVolume);
    }, [effectsVolume]);

    useEffect(() => {
        console.log("guiscale effect:", guiScale);
        if (guiScale > 200) {
            setGUIScale(200);
        }
        else if (guiScale < 0) {
            setGUIScale(0);
        }

        const style = Utils.getStyle(".gui-scalable");

        if (style) {
            style.zoom = guiScale / 100;
            style["-moz-transform"] = `scale(${guiScale / 100})`;
        }

        saveSetting("gui_scale", guiScale);
    }, [guiScale]);

    return (
        <div className="settings-panel centered panel-template-cont">
            <PanelTemplate
              width="50vw"
              height="80vh"
              panelName={Utils.getTextDef("Settings panel: name")}
              icon={settingsIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="rows">
                        <div className="row">
                            <span className="high-contrast-text description">Fullscreen</span>
                            <div className="action">
                                <img
                                  src={fullscreen ? toggleActiveIcon : toggleInactiveIcon}
                                  className="button"
                                  draggable={false}
                                  onClick={onFullscreenTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">Music volume</span>
                            <div className="action">
                                <MinusButton state={musicVolume} setter={setMusicVolume} />
                                <span className="high-contrast-text value">{`${musicVolume}%`}</span>
                                <PlusButton state={musicVolume} setter={setMusicVolume} />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">Effects volume</span>
                            <div className="action">
                                <MinusButton state={effectsVolume} setter={setEffectsVolume} />
                                <span className="high-contrast-text value">{`${effectsVolume}%`}</span>
                                <PlusButton state={effectsVolume} setter={setEffectsVolume} />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">GUI scale</span>
                            <div className="action">
                                <MinusButton state={guiScale} setter={setGUIScale} />
                                <span className="high-contrast-text value">{`${guiScale}%`}</span>
                                <PlusButton state={guiScale} setter={setGUIScale} />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">Add picked up items to hotbar</span>
                            <div className="action">
                                <img
                                  src={autoAddToHotbar ? toggleActiveIcon : toggleInactiveIcon}
                                  className="button"
                                  draggable={false}
                                  onClick={onAutoAddToHotbarTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">Light flicker</span>
                            <div className="action">
                                <img
                                  src={fullscreen ? toggleActiveIcon : toggleInactiveIcon}
                                  className="button"
                                  draggable={false}
                                  onClick={onLightFlickerTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">Show FPS</span>
                            <div className="action">
                                <img
                                  src={autoAddToHotbar ? toggleActiveIcon : toggleInactiveIcon}
                                  className="button"
                                  draggable={false}
                                  onClick={onAutoAddToHotbarTogglePressed}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

SettingsPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default SettingsPanel;
