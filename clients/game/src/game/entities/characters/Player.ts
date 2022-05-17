import { getRandomIntInclusive, tileDistanceBetween } from '@rogueworld/utils';
import Global from '../../../shared/Global';
import { ApplicationState, GUIState, PlayerState } from '../../../shared/state';
import { BouncyText } from '../../../shared/types';
import Entity from '../Entity';

class GloryParticleIcon extends Phaser.GameObjects.Sprite {
    verticalTween?: Phaser.Tweens.Tween;
}

class Player extends Entity {
    static animationSetName = 'player';

    warningText?: Phaser.GameObjects.Text;

    constructor(x: number, y: number, config: any) {
        super(x, y, config);

        this.bringToTop(this.curseEffect!);
        this.bringToTop(this.enchantmentEffect!);
        this.bringToTop(this.displayName!);
        this.sendToBack(this.baseSprite);

        const style = {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '16px',
            align: 'center',
            fill: '#f5f5f5',
            stroke: '#000000',
            strokeThickness: 5,
            wordWrap: {
                width: 250,
            },
        };
        this.warningText = Global.gameScene.add.text(0, -13, '', style);
        this.warningText.setOrigin(0.5);
        this.warningText.setScale(0.25);
        this.warningText.setVisible(false);
        this.add(this.warningText);

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

    onPointerDown(pointer, x, y, event) {
        // Check don't try to interact with self.
        if(this.entityId !== PlayerState.entityId) {
            event.stopPropagation();

            GUIState.setSelectedEntity(this);

            const playerDynamic = Global.gameScene.dynamics[PlayerState.entityId];
            const thisDynamic = Global.gameScene.dynamics[this.entityId];
            const dist = tileDistanceBetween(playerDynamic, thisDynamic);

            if(dist <= 1) {
                ApplicationState.connection?.sendEvent(
                    'interact',
                    {
                        id: thisDynamic.id,
                        row: thisDynamic.row,
                        col: thisDynamic.col,
                    },
                );
            }
        }
    }

    onFoodModified?(amount: string) {
        if(parseInt(amount) < 0) {
            // Only show the food drain when on low food.
            if(PlayerState.food > (PlayerState.maxFood * 0.2)) return;
        }
        else {
            amount = `+${amount}`;
        }

        const particle = Global.gameScene.add.text(0, 0, amount, {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '16px',
            align: 'center',
            color: '#d95763',
            stroke: '#000000',
            strokeThickness: 5,
        }) as BouncyText;
        particle.setOrigin(0.5, 1);
        particle.setScale(0.25);

        const xOffset = getRandomIntInclusive(-20, 20);

        particle.horizontalTween = Global.gameScene.tweens.add({
            targets: particle,
            x: `+=${xOffset}`,
            duration: 1000,
            alpha: 0,
            ease: 'Linear',
        });
        particle.verticalTween = Global.gameScene.tweens.add({
            targets: particle,
            y: '-=20',
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: function cb(tween: Phaser.Tweens.Tween, targets: Array<BouncyText>) {
                targets[0].destroy();
            },
        });

        this.add(particle);
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

        this.add(icon);

        if (parseInt(amount) > 0) {
            amount = `+${amount}`;
        }

        const text = Global.gameScene.add.text(0, 0, amount, {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '16px',
            align: 'center',
            color: '#76428a',
            stroke: '#000000',
            strokeThickness: 5,
        }) as BouncyText;
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

        this.add(text);
    }
}

export default Player;
