import Phaser from 'phaser';
import Global from '../../shared/Global';
import Followable from './Followable';
import Follower from './Follower';

class Text extends Phaser.GameObjects.Text implements Follower {
    following?: Followable;

    constructor(
        x: number,
        y: number,
        text?: string,
        style?: Phaser.Types.GameObjects.Text.TextStyle,
    ) {
        super(Global.gameScene, x, y, text, style);
        Global.gameScene.add.existing(this);

        // TODO: add delete followers logic onDestroy? looks ok so far
    }

    destroy(fromScene?: boolean): void {
        this.following?.removeFollower(this);

        super.destroy(fromScene);
    }
}

export default Text;
