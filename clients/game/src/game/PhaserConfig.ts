import Phaser from 'phaser';
import BootScene from './BootScene';
import GameScene from './GameScene';
import Global from '../shared/Global';
import Config from '../shared/Config';

const PhaserGame = () => {
    const config = {
        type: Phaser.WEBGL,
        // - 2 to the view diameter so the outer edges are not visible during map edge transitons.
        // Used to hide the ugly transition pop-in of new tiles/entities during the player move tween.
        width: (Config.SCALED_TILE_SIZE * (Config.VIEW_DIAMETER - 2)) || 100,
        height: (Config.SCALED_TILE_SIZE * (Config.VIEW_DIAMETER - 2)) || 100,
        canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        scale: {
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

export default PhaserGame;
