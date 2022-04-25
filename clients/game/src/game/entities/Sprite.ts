import Phaser from 'phaser';
import Global from '../../shared/Global';
import Followable from './Followable';
import Follower from './Follower';

/**
 * A wrapper around the core Phaser sprite, for some common things that might be used by any entity sprites.
 * Avoids having to modify the Phaser sprite prototype.
 */
class Sprite extends Phaser.GameObjects.Sprite implements Followable {
    static setupAnimations: () => void;

    static addAnimationSet: () => void;

    centered!: boolean;

    xOffset = 0;
    yOffset = 0;
    followers: Array<Follower> = [];

    constructor(x: number, y: number, frame?: string) {
        super(Global.gameScene, x, y, 'game-atlas', frame);
        Global.gameScene.add.existing(this);

        // TODO: add delete followers logic onDestroy? looks ok so far
    }

    update(...args: any[]): void {
        this.updateFollowers();
        super.update();
    }

    setX(value?: number): this {
        super.setX(value);

        // ...my side effect logic

        return this;
    }

    addFollower(follower: Follower) {
        this.followers.push(follower);
    }

    removeFollower(follower: Follower) {
        const index = this.followers.indexOf(follower);

        if (-1 !== index) {
            this.followers.splice(index, 1);
        }
    }

    updateFollowers() {
        if(this.followers.length) {
            this.followers.forEach((follower) => {
                follower.x = this.x + follower.xOffset;
                follower.y = this.y + follower.yOffset;
            });
        }
    }

    onMove(playMoveAnim?: boolean, moveAnimDuration?: number) { return; }
}

Sprite.setupAnimations = () => { return; };

Sprite.addAnimationSet = () => { return; };

Sprite.prototype.centered = false;

export default Sprite;
