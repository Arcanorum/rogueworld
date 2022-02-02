import Phaser from 'phaser';
import BootScene from './BootScene';
import GameScene from './GameScene';
import Global from '../shared/Global';

export default () => {
    const config = {
        type: Phaser.WEBGL,
        parent: 'game-canvas',
        width: 100,
        height: 100,
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            fullscreenTarget: 'game-cont',
        },
        scene: [
            BootScene,
            GameScene,
        ],
    };

    const game = new Phaser.Game(config);

    game.events.on('destroy', () => {
        Global.gameScene = {} as GameScene;
    });

    return game;
};
