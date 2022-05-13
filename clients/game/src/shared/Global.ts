import GameScene from '../game/GameScene';
import Config from './Config';
import * as states from './state';

// Provide a global namespace to attach any game specfic stuff to.
const Global = {
    Config,
    /** A global reference to the currently running Phaser scene. */
    gameScene: {} as GameScene,
    states,
};

// Make available from the browser console for debugging.
(window as any).rogueworld = Global;

export default Global;
