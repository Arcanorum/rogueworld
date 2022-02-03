import Phaser from 'phaser';
import PubSub from 'pubsub-js';
import SoundManager from './SoundManager';
import gameAtlasImage from '../assets/images/game-atlas.png';
import gameAtlasData from '../assets/images/game-atlas.json';
import groundTileset from '../assets/images/ground.png';
import staticsTileset from '../assets/images/statics.png';
import highlightImage from '../assets/images/gui/highlight.png';
import actionProgressBarImage from '../assets/images/gui/action-progress-bar.png';
import actionProgressBorderImage from '../assets/images/gui/action-progress-border.png';
import { LOAD_FILE_PROGRESS, LOAD_PROGRESS } from '../shared/EventTypes';
import { ApplicationState, GUIState, InventoryState } from '../shared/state';
import Config from '../shared/Config';
import { getStyle, message } from '../../../../shared/utils/src';

const audioAssetPaths = SoundManager.getAudioAssetPaths();

class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    async preload() {
        message('Boot preload');

        this.load.on('progress', (value: string) => {
            PubSub.publish(LOAD_PROGRESS, value);
        });

        this.load.on('fileprogress', (file: Phaser.Loader.File) => {
            PubSub.publish(LOAD_FILE_PROGRESS, file.key);
        });

        // Graphics.
        this.load.image('highlight', highlightImage.src);
        this.load.image('action-progress-bar', actionProgressBarImage.src);
        this.load.image('action-progress-border', actionProgressBorderImage.src);
        this.load.atlas('game-atlas', gameAtlasImage.src, gameAtlasData);
        this.load.spritesheet('ground-tileset', groundTileset.src, {
            frameWidth: 16 * Config.GAME_SCALE,
            frameHeight: 16 * Config.GAME_SCALE,
            margin: 1 * Config.GAME_SCALE,
            spacing: 2 * Config.GAME_SCALE,
        });
        this.load.spritesheet('statics-tileset', staticsTileset.src, {
            frameWidth: 16,
            frameHeight: 16,
            margin: 1,
            spacing: 2,
        });

        Object.entries(audioAssetPaths).forEach(([ name, paths ]) => {
            this.load.audio(name, paths as Array<string>);
        });

        // TODO: handle missing resources, send back to login screen :/
        const itemTypesRes = await fetch(`${ApplicationState.httpServerURL}/api/item-types`);
        console.log('itemTypesRes', itemTypesRes);
    }

    create() {
        message('Boot create');

        // Keep the game running even when the window loses focus.
        this.events.on('hidden', () => {
            message('hidden');
        }, this);

        this.events.on('visible', () => {
            message('visible');
        }, this);

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        // TODO: Need to clean this up. in this scene, or in game scene destroy event?
        document.addEventListener('click', () => {
            // console.log("click");
            window.focus();
        }, false);

        // Load any previous settings on this device.
        const musicVolume = JSON.parse(localStorage.getItem('music_volume') || 'null');
        if (typeof musicVolume === 'number') {
            GUIState.musicVolume = musicVolume;
        }

        const effectsVolume = JSON.parse(localStorage.getItem('effects_volume') || 'null');
        if (typeof effectsVolume === 'number') {
            GUIState.effectsVolume = effectsVolume;
        }

        // const guiScale = JSON.parse(localStorage.getItem('gui_scale') || 'null');
        // if (typeof guiScale === 'number') {
        //     GUIState.guiScale = guiScale;

        //     const style = getStyle('.gui-scalable');

        //     if (style) {
        //         style.zoom = guiScale / 100;
        //         style['-moz-transform'] = `scale(${guiScale / 100})`;
        //     }
        // }

        const virtualDPadEnabled = JSON.parse(localStorage.getItem('virtual_d_pad_enabled') || 'null');
        if (typeof virtualDPadEnabled === 'boolean') {
            GUIState.virtualDPadEnabled = virtualDPadEnabled;
        }
        else {
            // If not on desktop, enable the virtual D-pad.
            GUIState.virtualDPadEnabled = !this.sys.game.device.os.desktop;
        }

        const autoAddToHotbar = JSON.parse(localStorage.getItem('auto_add_to_hotbar') || 'null');
        if (typeof autoAddToHotbar === 'boolean') {
            InventoryState.autoAddToHotbar = autoAddToHotbar;
        }

        const profanityFilterEnabled = JSON.parse(localStorage.getItem('profanity_filter_enabled') || 'null');
        if (typeof profanityFilterEnabled === 'boolean') {
            GUIState.profanityFilterEnabled = profanityFilterEnabled;
        }

        const lightFlickerEnabled = JSON.parse(localStorage.getItem('light_flicker_enabled') || 'null');
        if (typeof lightFlickerEnabled === 'boolean') {
            GUIState.lightFlickerEnabled = lightFlickerEnabled;
        }

        const showFPS = JSON.parse(localStorage.getItem('show_fps') || 'null');
        if (typeof showFPS === 'boolean') {
            GUIState.showFPS = showFPS;
        }

        if (Config.devMode === false) {
            // Disable the right click context menu on the game in prod.
            document.getElementById('game-cont')!.addEventListener('contextmenu', (event) => event.preventDefault());
        }

        // Start the game state.
        this.scene.start('Game');
    }
}

export default BootScene;
