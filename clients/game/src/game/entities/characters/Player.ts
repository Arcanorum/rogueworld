import Global from '../../../shared/Global';
import { BouncyText } from '../../../shared/types';
import Entity from '../Entity';
import Sprite from '../Sprite';
import Text from '../Text';

class GloryParticleIcon extends Sprite {
    verticalTween?: Phaser.Tweens.Tween;
}

class Player extends Entity {
    static animationSetName = 'player';

    warningText?: Text;

    constructor(x: number, y: number, config: any) {
        super(x, y, config);

        const style = {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '16',
            align: 'center',
            fill: '#f5f5f5',
            stroke: '#000000',
            strokeThickness: 8,
            wordWrap: {
                width: 250,
            },
        };
        this.warningText = new Text(0, -13, '', style);
        this.warningText.setOrigin(0.5);
        this.warningText.setScale(0.25);
        this.warningText.setVisible(false);
        this.addFollower(this.warningText);

        // TODO: add a chat bubble above head when someone starts chatting.
    }

    onMove(playMoveAnim?: boolean, moveAnimDuration?: number) {
        if (playMoveAnim === true) {
            // if (!this.clothes.anims.isPlaying) {
            //     this.clothes.play({
            //         key: `${this.clothes.clothesName}`,
            //         // See Character.onMove for what is going on here.
            //         duration: moveAnimDuration * 1.9 || 4000,
            //         frameRate: null, // Need to provide this or the duration won't take effect. Phaser 3.55.2 bug.
            //     });
            // }
        }

        super.onMove(playMoveAnim, moveAnimDuration);
    }

    /**
     * Show how much glory was gained/lost.
     */
    onGloryModified?(amount: string) {
        const icon = Global.gameScene.add.sprite(0, -1, 'game-atlas', 'glory-icon') as GloryParticleIcon;
        icon.setOrigin(0.5, 1);
        icon.setScale(0.25);

        icon.verticalTween = Global.gameScene.tweens.add({
            targets: icon,
            y: '-=20',
            duration: 1500,
            ease: 'Back.easeOut',
            onComplete: function cb(tween: Phaser.Tweens.Tween, targets: Array<BouncyText>) {
                targets[0].destroy();
            },
        });

        this.addFollower(icon);

        if (parseInt(amount) > 0) {
            amount = `+${amount}`;
        }

        const text = new BouncyText(0, 0, amount, {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '16px',
            align: 'center',
            color: '#76428a',
            stroke: '#000000',
            strokeThickness: 5,
        });
        text.setOrigin(0.5, 0);
        text.setScale(0.25);

        text.verticalTween = Global.gameScene.tweens.add({
            targets: text,
            y: '-=20',
            duration: 1500,
            ease: 'Back.easeOut',
            onComplete: function cb(tween: Phaser.Tweens.Tween, targets: Array<BouncyText>) {
                targets[0].destroy();
            },
        });

        this.addFollower(text);
    }
}

export default Player;
