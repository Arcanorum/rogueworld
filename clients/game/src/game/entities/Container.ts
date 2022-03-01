import { getRandomIntInclusive } from '@dungeonz/utils';
import Phaser from 'phaser';
import Global from '../../shared/Global';
import { BouncyText } from '../../shared/types';

/**
 * Wrapper around the core Phaser container, for some common things that might be used by any entity containers.
 * Avoids having to modify the Phaser container prototype.
 */
class Container extends Phaser.GameObjects.Container {
    displayName?: Phaser.GameObjects.Text;

    constructor(x: number, y: number, data: any) {
        super(Global.gameScene, x, y);
        Global.gameScene.add.existing(this);
    }

    onMove(playMoveAnim?: boolean, moveAnimDuration?: number) { return; }

    /**
     * Show the damage marker, with the amount of damage/healing taken.
     */
    onHitPointsModified(amount: string) {
        if (parseInt(amount) < 0) {
            const damageParticle = Global.gameScene.add.text(0, 0, amount, {
                fontFamily: '\'Press Start 2P\'',
                fontSize: '16px',
                align: 'center',
                color: '#ff2f00',
                stroke: '#000000',
                strokeThickness: 5,
            }) as BouncyText;
            damageParticle.setOrigin(0.5, 1);
            damageParticle.setScale(0.25);

            const xOffset = getRandomIntInclusive(-50, 50);

            damageParticle.horizontalTween = Global.gameScene.tweens.add({
                targets: damageParticle,
                x: `+=${xOffset}`,
                duration: 1000,
                alpha: 0,
                ease: 'Linear',
            });
            damageParticle.verticalTween = Global.gameScene.tweens.add({
                targets: damageParticle,
                y: '-=10',
                duration: 1000,
                ease: 'Back.easeOut',
                onComplete: function cb(tween: Phaser.Tweens.Tween, targets: Array<BouncyText>) { // TODO: test this is right
                    targets[0].destroy();
                },
            });

            this.add(damageParticle);
        }
        else {
            amount = `+${amount}`;

            const damageParticle = Global.gameScene.add.text(0, 0, amount, {
                fontFamily: '\'Press Start 2P\'',
                fontSize: '16px',
                align: 'center',
                color: '#6abe30',
                stroke: '#000000',
                strokeThickness: 5,
            }) as BouncyText;
            damageParticle.setOrigin(0.5, 1);
            damageParticle.setScale(0.25);

            const xOffset = getRandomIntInclusive(-20, 20);

            damageParticle.horizontalTween = Global.gameScene.tweens.add({
                targets: damageParticle,
                x: `+=${xOffset}`,
                duration: 1000,
                alpha: 0,
                ease: 'Linear',
            });
            damageParticle.verticalTween = Global.gameScene.tweens.add({
                targets: damageParticle,
                y: '-=20',
                duration: 1000,
                ease: 'Back.easeOut',
                onComplete: function cb(tween: Phaser.Tweens.Tween, targets: Array<BouncyText>) {
                    targets[0].destroy();
                },
            });

            this.add(damageParticle);
        }
    }

    /**
     * Show the display name of this entity when it is hovered over.
     */
    onPointerOver() {
        if(this.displayName) {
            this.displayName.visible = true;
        }
    }

    /**
     * Hide the display name when it isn't being hovered over any more.
     */
    onPointerOut() {
        if(this.displayName) {
            this.displayName.visible = false;
        }
    }

    /**
     * Add a text object to this sprite to use as the display name.
     */
    addDisplayName(displayName: string) {
        // The anchor is still in the top left, so offset by half the width to center the text.
        this.displayName = Global.gameScene.add.text(0, -6, displayName, {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '20px',
            align: 'center',
            color: '#f5f5f5',
            stroke: '#000000',
            strokeThickness: 5,
        });
        this.displayName.setOrigin(0.5, 1);
        this.displayName.setScale(0.25);
        this.displayName.visible = false;
        this.add(this.displayName);
    }
}

export default Container;
