import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PanelTemplate from "../panel_template/PanelTemplate";
import settingsIcon from "../../../../../assets/images/gui/hud/settings/settings-icon.png";
import fullscreenIcon from "../../../../../assets/images/gui/hud/settings/fullscreen-icon.png";
import zoomIcon from "../../../../../assets/images/gui/hud/settings/zoom-icon.png";
import inventoryIcon from "../../../../../assets/images/gui/hud/inventory-icon.png";
import audioIcon from "../../../../../assets/images/gui/hud/settings/audio-icon.png";
import toggleActiveIcon from "../../../../../assets/images/gui/hud/settings/toggle-active.png";
import toggleInactiveIcon from "../../../../../assets/images/gui/hud/settings/toggle-inactive.png";
import plusIcon from "../../../../../assets/images/gui/hud/plus-icon.png";
import minusIcon from "../../../../../assets/images/gui/hud/minus-icon.png";
import Utils from "../../../../../shared/Utils";
import "./SettingsPanel.scss";
import gameConfig from "../../../../../shared/GameConfig";
import dungeonz from "../../../../../shared/Global";

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
          className={`button ${state === 100 ? "disabled" : ""}`}
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
    const [guiScale, setGUIScale] = useState(50);
    const [addToHotbar, setAddToHotbar] = useState(gameConfig.addToHotbar);
    const [musicVolume, setMusicVolume] = useState(50);
    const [effectsVolume, setEffectsVolume] = useState(50);

    const onFullscreenTogglePressed = () => {
        if (dungeonz.gameScene.scale.isFullscreen) {
            dungeonz.gameScene.scale.stopFullscreen();
        }
        else {
            dungeonz.gameScene.scale.startFullscreen();
        }

        setFullscreen(!dungeonz.gameScene.scale.isFullscreen);
    };

    useEffect(() => {
        console.log("guiscale effect:", guiScale);
        if (guiScale > 100) {
            setGUIScale(100);
        }
        else if (guiScale < 0) {
            setGUIScale(0);
        }
    }, [guiScale]);

    const onAddToHotbarTogglePressed = () => {
        gameConfig.addToHotbar = !addToHotbar;

        setAddToHotbar(!addToHotbar);
    };

    useEffect(() => {
        console.log("musicVolume effect:", musicVolume);
        if (musicVolume > 100) {
            setMusicVolume(100);
        }
        else if (musicVolume < 0) {
            setMusicVolume(0);
        }
    }, [musicVolume]);

    useEffect(() => {
        console.log("effectsVolume effect:", effectsVolume);
        if (effectsVolume > 100) {
            setEffectsVolume(100);
        }
        else if (effectsVolume < 0) {
            setEffectsVolume(0);
        }
    }, [effectsVolume]);

    return (
        <div className="settings-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="50vw"
              height="80vh"
              panelName={Utils.getTextDef("Settings panel: name")}
              icon={settingsIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="cols">
                        <div className="col left">
                            <div className="row">
                                <img src={fullscreenIcon} className="icon" />
                                <span>Fullscreen</span>
                            </div>
                            <div className="row">
                                <img src={zoomIcon} className="icon" />
                                <span>GUI size</span>
                            </div>
                            <div className="row">
                                <img src={inventoryIcon} className="icon" />
                                <span>Add picked up items to hotbar</span>
                            </div>
                            <div className="row">
                                <img src={audioIcon} className="icon" />
                                <span>Music volume</span>
                            </div>
                            <div className="row">
                                <img src={audioIcon} className="icon" />
                                <span>Effects volume</span>
                            </div>
                        </div>
                        <div className="col right">
                            <div className="row">
                                <img
                                  src={fullscreen ? toggleActiveIcon : toggleInactiveIcon}
                                  className="button"
                                  draggable={false}
                                  onClick={onFullscreenTogglePressed}
                                />
                            </div>
                            <div className="row">
                                <MinusButton state={guiScale} setter={setGUIScale} />
                                <span className="value">{`${guiScale}%`}</span>
                                <PlusButton state={guiScale} setter={setGUIScale} />
                            </div>
                            <div className="row">
                                <img
                                  src={addToHotbar ? toggleActiveIcon : toggleInactiveIcon}
                                  className="button"
                                  draggable={false}
                                  onClick={onAddToHotbarTogglePressed}
                                />
                            </div>
                            <div className="row">
                                <MinusButton state={musicVolume} setter={setMusicVolume} />
                                <span className="value">{`${musicVolume}%`}</span>
                                <PlusButton state={musicVolume} setter={setMusicVolume} />
                            </div>
                            <div className="row">
                                <MinusButton state={effectsVolume} setter={setEffectsVolume} />
                                <span className="value">{`${effectsVolume}%`}</span>
                                <PlusButton state={effectsVolume} setter={setEffectsVolume} />
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
