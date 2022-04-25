import { getRandomIntInclusive } from '@dungeonz/utils';
import Phaser from 'phaser';
import Global from '../../shared/Global';
import { BouncyText } from '../../shared/types';

/**
 * Wrapper around the core Phaser container, for some common things that might be used by any entity containers.
 * Avoids having to modify the Phaser container prototype.
 */
// class Container extends Phaser.GameObjects.Container {
//     displayName?: Phaser.GameObjects.Text;

//     constructor(x: number, y: number, data: any) {
//         super(Global.gameScene, x, y);
//         Global.gameScene.add.existing(this);
//     }


// }

// export default Container;
