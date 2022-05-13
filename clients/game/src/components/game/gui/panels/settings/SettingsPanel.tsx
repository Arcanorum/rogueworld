import { useEffect, useState } from 'react';
import PanelTemplate from '../panel_template/PanelTemplate';
import settingsIcon from '../../../../../assets/images/gui/panels/settings/settings-icon.png';
import toggleActiveIcon from '../../../../../assets/images/gui/panels/settings/toggle-active.png';
import toggleInactiveIcon from '../../../../../assets/images/gui/panels/settings/toggle-inactive.png';
import plusIcon from '../../../../../assets/images/gui/hud/plus-icon.png';
import minusIcon from '../../../../../assets/images/gui/hud/minus-icon.png';
import styles from './SettingsPanel.module.scss';
import Global from '../../../../../shared/Global';
import { GUIState, InventoryState } from '../../../../../shared/state';
import { getStyle, warning } from '@rogueworld/utils';
import getTextDef from '../../../../../shared/GetTextDef';

function MinusButton({
    state,
    setter,
}: {
    state: number;
    setter: (value: number) => void;
}) {
    return (
        <img
            src={minusIcon.src}
            className={`button ${state === 0 ? 'disabled' : ''}`}
            draggable={false}
            onClick={() => {
                setter(state - 5);
            }}
        />
    );
}

function PlusButton({
    state,
    setter,
}: {
    state: number;
    setter: (value: number) => void;
}) {
    return (
        <img
            src={plusIcon.src}
            className={`button ${state === 200 ? 'disabled' : ''}`}
            draggable={false}
            onClick={() => {
                setter(state + 5);
            }}
        />
    );
}

function SettingsPanel({ onCloseCallback }: { onCloseCallback: () => void }) {
    const [fullscreen, setFullscreen] = useState(Global.gameScene.scale.isFullscreen);
    const [musicVolume, setMusicVolume] = useState(GUIState.musicVolume);
    const [effectsVolume, setEffectsVolume] = useState(GUIState.effectsVolume);
    // const [ guiScale, setGUIScale ] = useState(GUIState.guiScale);
    const [autoAddToHotbar, setAutoAddToHotbar] = useState(InventoryState.autoAddToHotbar);
    const [profanityFilterEnabled, setProfanityFilterEnabled] = useState(
        GUIState.profanityFilterEnabled,
    );
    const [lightFlickerEnabled, setLightFlickerEnabled] = useState(GUIState.lightFlickerEnabled);
    const [showFPS, setShowFPS] = useState(GUIState.showFPS);

    const saveSetting = (key: string, value: any) => {
        try {
            // Save the setting to local storage.
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            warning(error);
        }
    };

    const onFullscreenTogglePressed = () => {
        if (Global.gameScene.scale.isFullscreen) {
            Global.gameScene.scale.stopFullscreen();
        }
        else {
            Global.gameScene.scale.startFullscreen();
        }

        setFullscreen(!Global.gameScene.scale.isFullscreen);

        // Don't save fullscreen setting. They should choose if they want to go fullscreen every time they play.
    };

    useEffect(() => {
        if (musicVolume > 200) {
            setMusicVolume(200);
        }
        else if (musicVolume < 0) {
            setMusicVolume(0);
        }

        GUIState.musicVolume = musicVolume;

        Global.gameScene.soundManager.music.updateVolume();

        saveSetting('music_volume', musicVolume);
    }, [musicVolume]);

    useEffect(() => {
        if (effectsVolume > 200) {
            setEffectsVolume(200);
        }
        else if (effectsVolume < 0) {
            setEffectsVolume(0);
        }

        GUIState.effectsVolume = effectsVolume;

        Global.gameScene.soundManager.effects.updateVolume();

        saveSetting('effects_volume', effectsVolume);
    }, [effectsVolume]);

    // useEffect(() => {
    //     if (guiScale > 200) {
    //         setGUIScale(200);
    //     }
    //     else if (guiScale < 0) {
    //         setGUIScale(0);
    //     }

    //     const style = getStyle('.gui-scalable');

    //     if (style) {
    //         style.zoom = guiScale / 100;
    //         style['-moz-transform'] = `scale(${guiScale / 100})`;
    //     }

    //     GUIState.guiScale = guiScale;

    //     saveSetting('gui_scale', guiScale);
    // }, [ guiScale ]);

    const onAutoAddToHotbarTogglePressed = () => {
        InventoryState.autoAddToHotbar = !autoAddToHotbar;

        setAutoAddToHotbar(!autoAddToHotbar);

        saveSetting('auto_add_to_hotbar', !autoAddToHotbar);
    };

    const onProfanityFilterTogglePressed = () => {
        GUIState.profanityFilterEnabled = !profanityFilterEnabled;

        setProfanityFilterEnabled(!profanityFilterEnabled);

        saveSetting('profanity_filter_enabled', !profanityFilterEnabled);
    };

    const onLightFlickerTogglePressed = () => {
        GUIState.lightFlickerEnabled = !lightFlickerEnabled;

        setLightFlickerEnabled(!lightFlickerEnabled);

        saveSetting('light_flicker_enabled', !lightFlickerEnabled);
    };

    const onShowFPSTogglePressed = () => {
        GUIState.showFPS = !showFPS;

        setShowFPS(!showFPS);

        if (Global.gameScene.fpsText) {
            Global.gameScene.fpsText.style.display = !showFPS ? 'block' : 'none';
        }

        saveSetting('show_fps', !showFPS);
    };

    return (
        <div className="settings-panel centered panel-template-cont">
            <PanelTemplate
                width="50vw"
                height="80vh"
                panelName={getTextDef('Settings')}
                icon={settingsIcon.src}
                onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="rows">
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Fullscreen')}</span>
                            <div className="action">
                                <img
                                    src={fullscreen ? toggleActiveIcon.src : toggleInactiveIcon.src}
                                    className="button"
                                    draggable={false}
                                    onClick={onFullscreenTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Music volume')}</span>
                            <div className="action">
                                <MinusButton state={musicVolume} setter={setMusicVolume} />
                                <span className="high-contrast-text value">{`${musicVolume}%`}</span>
                                <PlusButton state={musicVolume} setter={setMusicVolume} />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Effects volume')}</span>
                            <div className="action">
                                <MinusButton state={effectsVolume} setter={setEffectsVolume} />
                                <span className="high-contrast-text value">{`${effectsVolume}%`}</span>
                                <PlusButton state={effectsVolume} setter={setEffectsVolume} />
                            </div>
                        </div>
                        {/* <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: GUI scale')}</span>
                            <div className="action">
                                <MinusButton state={guiScale} setter={setGUIScale} />
                                <span className="high-contrast-text value">{`${guiScale}%`}</span>
                                <PlusButton state={guiScale} setter={setGUIScale} />
                            </div>
                        </div> */}
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Add to hotbar')}</span>
                            <div className="action">
                                <img
                                    src={autoAddToHotbar
                                        ? toggleActiveIcon.src
                                        : toggleInactiveIcon.src}
                                    className="button"
                                    draggable={false}
                                    onClick={onAutoAddToHotbarTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Profanity filter')}</span>
                            <div className="action">
                                <img
                                    src={
                                        profanityFilterEnabled
                                            ? toggleActiveIcon.src
                                            : toggleInactiveIcon.src
                                    }
                                    className="button"
                                    draggable={false}
                                    onClick={onProfanityFilterTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Light flicker')}</span>
                            <div className="action">
                                <img
                                    src={
                                        lightFlickerEnabled ?
                                            toggleActiveIcon.src :
                                            toggleInactiveIcon.src
                                    }
                                    className="button"
                                    draggable={false}
                                    onClick={onLightFlickerTogglePressed}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="high-contrast-text description">{getTextDef('Setting: Show FPS')}</span>
                            <div className="action">
                                <img
                                    src={showFPS ? toggleActiveIcon.src : toggleInactiveIcon.src}
                                    className="button"
                                    draggable={false}
                                    onClick={onShowFPSTogglePressed}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

export default SettingsPanel;
