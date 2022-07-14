import { message, tileDistanceBetween, warning } from '@rogueworld/utils';
import Panels from '../../components/game/gui/panels/Panels';
import Config from '../../shared/Config';
import { setDefaultCursor, setHandCursor } from '../../shared/Cursors';
import { SELECTED_ENTITY_HITPOINTS } from '../../shared/EventTypes';
import getTextDef from '../../shared/GetTextDef';
import Global from '../../shared/Global';
import { ApplicationState, GUIState, PlayerState } from '../../shared/state';
import Container from './Container';

export interface EntityConfig {
    id: string;
    moveRate?: number;
    hitPoints?: number;
    maxHitPoints?: number;
    frameName?: string;
    displayName?: string;
    displayNameColor?: string;
}

class Entity extends Container {
    /**
     * Debug name of this entity type. Useful for generated classes where the constructor name is
     * meaningless.
     */
    static typeName = 'Entity';

    /**
     * The text definition ID of this entity type, used to get the actual display name value from
     * the loaded text definitions in the current language.
     */
    static displayName = '';

    /** Whether the display name should be shown over the top of the entity when hovered over. */
    static showDisplayNameOnHover = true;

    /**
     * The file name (without file type extension) of the image to use for this entity (i.e. when
     * selected).
     */
    static iconName = '';

    /** The base name of this set of animations. */
    static animationSetName = '';

    /** The numbers of the frames to play, and the order to play them in. */
    static animationFrameSequence: Array<number> = [1, 2];

    /** Whether the animation should loop. i.e. for things that always look moving, such as bats. */
    static animationRepeats = false;

    /** How long the animation should last, in ms. */
    static animationDuration = 500;

    /** Whether this entity should allow opening the crafting panel, and for what station. */
    static craftingStationClass = '';

    /** The sound to play when this entity is destroyed. */
    static destroySound = '';

    entityId: string;

    hitPoints: number;

    maxHitPoints: number;

    moveRate?: number;

    displayNameColor?: string;

    baseSprite: Phaser.GameObjects.Sprite;

    particlesOnDestroy?: boolean;

    healthRegenEffect?: Phaser.GameObjects.Sprite;

    curedEffect?: Phaser.GameObjects.Sprite;

    coldResistanceEffect?: Phaser.GameObjects.Sprite;

    poisonEffect?: Phaser.GameObjects.Sprite;

    burnEffect?: Phaser.GameObjects.Sprite;

    chillEffect?: Phaser.GameObjects.Sprite;

    brokenBonesEffect?: Phaser.GameObjects.Sprite;

    curseEffect?: Phaser.GameObjects.Sprite;

    enchantmentEffect?: Phaser.GameObjects.Sprite;

    actionBorder?: Phaser.GameObjects.Sprite;

    actionProgress?: Phaser.GameObjects.Sprite;

    actionIcon?: Phaser.GameObjects.Sprite;

    actionTimeout?: ReturnType<typeof setTimeout>;

    actionTween?: Phaser.Tweens.Tween;

    constructor(
        x: number,
        y: number,
        config: EntityConfig,
    ) {
        super(x, y, config);

        this.setScale(Config.GAME_SCALE);
        this.entityId = config.id;
        this.moveRate = config.moveRate;
        this.hitPoints = config.hitPoints;
        this.maxHitPoints = config.maxHitPoints;

        const EntityType = this.constructor as typeof Entity;

        let frame;
        if (config.frameName) {
            frame = config.frameName;
        }
        else if (EntityType.animationSetName) {
            frame = `${EntityType.animationSetName}-1`;
        }
        this.baseSprite = Global.gameScene.add.sprite(0, 0, 'game-atlas', frame);
        if (frame) {
            this.baseSprite.setFrame(frame);
        }
        this.baseSprite.setOrigin(0.5);
        this.add(this.baseSprite);

        // Don't bother playing 1 frame animations.
        if (EntityType.animationFrameSequence.length > 1) {
            if (EntityType.animationSetName) {
                this.baseSprite.anims.play(EntityType.animationSetName);
            }
        }

        this.baseSprite.on('animationcomplete', this.moveAnimCompleted, this);

        this.baseSprite.setInteractive();

        this.baseSprite.on('destroy', this.onDestroy, this);

        this.baseSprite.on('pointerdown', this.onPointerDown, this);

        // Use a specific display name if given, or the one for this entity type.
        const displayName = config.displayName || EntityType.displayName;

        if (displayName && EntityType.showDisplayNameOnHover) {
            this.addDisplayName(displayName);

            this.baseSprite.on('pointerover', this.onPointerOver, this);

            this.baseSprite.on('pointerout', this.onPointerOut, this);
        }

        // this.curseEffect = this.addEffect('curse-effect-1');
        // this.curseEffect.x = -6;
        // this.curseEffect.y = -10;
        // this.curseEffect.setScale(0.8);

        // this.enchantmentEffect = this.addEffect('enchantment-effect-1');
        // this.enchantmentEffect.x = 6;
        // this.enchantmentEffect.y = -10;
        // this.enchantmentEffect.setScale(0.8);

        // TODO: Make all this action stuff be added dynamically, don't need it on every entity...
        this.actionProgress = Global.gameScene.add.sprite(0, 4.5, 'game-atlas', 'action-progress');
        this.actionProgress.setScale(0.5);
        this.actionProgress.setOrigin(0.5, 1);
        this.actionProgress.visible = false;
        this.add(this.actionProgress);

        this.actionBorder = Global.gameScene.add.sprite(0, 0, 'game-atlas', 'action-border');
        this.actionBorder.setScale(0.5);
        this.actionBorder.setOrigin(0.5);
        this.actionBorder.visible = false;
        this.add(this.actionBorder);

        this.actionIcon = Global.gameScene.add.sprite(0, 0, 'game-atlas', 'action-punch');
        this.actionIcon.setScale(0.5);
        this.actionIcon.setOrigin(0.5);
        this.actionIcon.visible = false;
        this.add(this.actionIcon);
    }

    onDestroy() {
        if (this.particlesOnDestroy) {
            // Squirt a lot of juice on death.
            Global.gameScene.damageParticleEmitter.emitParticleAt(
                this.x,
                this.y,
                Phaser.Math.Between(15, 25),
            );
        }

        const { dynamics } = Global.gameScene;

        const playerDynamic = dynamics[PlayerState.entityId];
        const thisDynamic = dynamics[this.entityId];

        // Check they are both still in the dynamics list.
        if (playerDynamic && thisDynamic) {
            const EntityType = this.constructor as typeof Entity;

            if (EntityType.destroySound) {
                // If they are close enough to the player, play a death splat sound.
                if (
                    tileDistanceBetween(
                        dynamics[PlayerState.entityId],
                        dynamics[this.entityId],
                    ) <= 5
                ) {
                    Global.gameScene.sound.play(
                        EntityType.destroySound,
                        { volume: GUIState.effectsVolume / 100 },
                    );
                }
            }
        }

        clearTimeout(this.actionTimeout);
        this.actionTimeout = undefined;

        if (this === GUIState.selectedEntity) {
            GUIState.setSelectedEntity(null);
        }
    }

    /**
     * Attempt to interact with the entity when pressed.
     */
    onPointerDown(pointer, x, y, event) {
        // Only do game canvas related logic if the input wasn't over any other GUI element.
        if ((pointer.event.target as Element).id !== 'game-canvas') return;

        // Prevent the pointer event from bubbling up to the scene, so it doesn't try to do a tile
        // action as well.
        event.stopPropagation();

        GUIState.setSelectedEntity(this);

        const playerDynamic = Global.gameScene.dynamics[PlayerState.entityId];
        const thisDynamic = Global.gameScene.dynamics[this.entityId];
        const dist = tileDistanceBetween(playerDynamic, thisDynamic);

        const EntityType = this.constructor as typeof Entity;
        // If this is something that can be crafted at, open the crafting panel.
        if (EntityType.craftingStationClass) {
            // Check they are within range to interact with the entity.
            if (dist <= 1) {
                // Prevent opening the crafting panel when a station is clicked on behind and
                // already open panel.
                if (GUIState.activePanel !== Panels.NONE) {
                    // Except chat panel.
                    if (GUIState.activePanel !== Panels.Chat) return;
                }

                GUIState.setCraftingStation(
                    EntityType.craftingStationClass,
                    EntityType.displayName,
                    EntityType.iconName,
                );
                GUIState.setActivePanel(Panels.Crafting);

                return;
            }
        }

        ApplicationState.connection?.sendEvent(
            'interact',
            {
                id: thisDynamic.id,
                row: thisDynamic.row,
                col: thisDynamic.col,
            },
        );
    }

    /**
     * Show the display name of this entity when it is hovered over.
     */
    onPointerOver() {
        if (this.displayNameTextObject) {
            this.displayNameTextObject.visible = true;
        }
        setHandCursor();
    }

    /**
     * Hide the display name when it isn't being hovered over any more.
     */
    onPointerOut() {
        if (this.displayNameTextObject) {
            this.displayNameTextObject.visible = false;
        }
        setDefaultCursor();
    }

    addEffect(frameName: string) {
        const sprite = Global.gameScene.add.sprite(0, 0, 'game-atlas', frameName);
        sprite.setOrigin(0.5);
        this.add(sprite);
        return sprite;
    }

    flipHorizontally(direction: string) {
        this.baseSprite.setScale(direction === 'l' ? 1 : -1, 1);
    }

    /**
     * Should be called when the entity moves.
     * Move can be a normal move (like a running), or from a manual reposition (teleport/map
     * change).
     * @param playMoveAnim Whether the move animation should be played. Don't play on
     *      reposition as it looks weird when they teleport but still do a move animation.
     */
    onMove(playMoveAnim?: boolean, moveAnimDuration = 4000) {
        // console.log('character.onMove:', moveAnimDuration);

        if (this.actionTimeout) this.endAction();

        //     // TODO: flip the base sprite if moving the other way since the last move
        //     // dont bother for up/down

        // // Don't bother if this is a looping animation. An animation should already been running.
        //     if (this.animationRepeats) return;

        //     if (playMoveAnim === true) {
        //         if (EntityType.animationSetName) {
        //             if (!this.baseSprite.anims.isPlaying) {
        //                 if(moveAnimDuration) {
        //                     moveAnimDuration = moveAnimDuration * 1.9;
        //                 }
        //                 this.baseSprite.play({
        //                     key: `${EntityType.animationSetName}`,
        //               // An animation should play in full over 2 move steps, and also in full
        //               // over just 1 (so it looks like a winddown).
        //               // If the animation were to run in full for every move step, it would look
        //               // very fast, so slow it down artificially so it appears more natural when
        //               // played over a longer distance (i.e. over 2 tiles, instead of just 1).
        //               // x2 the move duration (i.e. half the frame rate), and don't start a new
        //               // animation for any incoming move events while this animation is still
        //               // playing, so for the first step it plays the first half of the animation,
        //               // but it will keep running, so when a second move event happens, the
        //               // previous animation should still be running, on it's second half, thus
        //               // completing the full move animation over 2 move steps.
        //               // x2 might be too precice, so use 1.9 to give some margin for timing
        //               // weirdness like lag, low FPS, etc.
        //                     duration: moveAnimDuration,
        //                     // TODO: test this has been fixed in recent phaser version
        //                     // Need to provide this or the duration won't take effect.
        //                     // Phaser 3.55.2 bug.
        //                     // frameRate: null,
        //                 });
        //             }
        //         }
        //     }
    }

    onHitPointsModified(amount: string) {
        this.hitPoints += parseInt(amount, 10);

        if (GUIState.selectedEntity === this) {
            PubSub.publish(SELECTED_ENTITY_HITPOINTS, { new: this.hitPoints });
        }

        super.onHitPointsModified(amount);
    }

    moveAnimCompleted() {

    }

    startAction(actionName: string, duration: number, target?: string) {
        if (this.actionTimeout) this.endAction();

        this.actionProgress.visible = true;
        this.actionProgress.scaleY = 0;

        this.actionTween = Global.gameScene.tweens.add({
            targets: this.actionProgress,
            scaleY: 0.5,
            duration,
            ease: 'Linear',
        });

        this.actionBorder.visible = true;

        this.actionIcon.visible = true;
        this.actionIcon.setFrame(`action-${actionName}`);

        this.actionTimeout = setTimeout(this.endAction.bind(this, target), duration || 1000);

        // Play an optional starting animation here.
    }

    endAction(targetId?: string) {
        clearTimeout(this.actionTimeout);
        this.actionTimeout = undefined;

        if (this.actionTween) this.actionTween.stop();

        this.actionProgress.visible = false;
        this.actionBorder.visible = false;
        this.actionIcon.visible = false;

        if (targetId) {
            const targetEntity = Global.gameScene.dynamics[targetId];
            if (!targetEntity) return;

            const { spriteContainer } = targetEntity;

            const emitterSprite = Global.gameScene.add.image(this.x, this.y, 'game-atlas', '');

            const emitter = Global.gameScene.attackParticles.createEmitter({
                frame: 'action-path',
                lifespan: 150,
                scale: Config.GAME_SCALE,
                alpha: { start: 1, end: 0 },
                frequency: 5,
                on: true,
            });

            emitter.startFollow(emitterSprite);

            const dist = Phaser.Math.Distance.BetweenPoints(this, spriteContainer);

            const duration = dist * 3;

            Global.gameScene.tweens.add({
                targets: emitterSprite,
                x: spriteContainer.x,
                y: spriteContainer.y,
                duration,
                onComplete: () => {
                    emitter.manager.emitters.remove(emitter);
                    emitterSprite.destroy();
                },
            });
        }
    }

    setActiveState(state: boolean) { }

    static loadConfig(config) {
        // Load anything else that hasn't already been set by the loadConfig method of a subclass.
        Object.entries(config).forEach(([key, value]) => {
            // Load whatever properties that have the same key in the config as on this class.
            if (key in this) {
                // Check if the property has already been loaded by a
                // subclass, or set on the class prototype for class files.
                if (
                    Object.getPrototypeOf(this)[key] === this[key]
                ) {
                    // eslint-disable-next-line
                    // @ts-ignore
                    this[key] = value;
                }
            }
        });

        // If no config is set for a specific icon name, use the first frame of the animation set.
        if (!this.iconName && this.animationSetName) {
            this.iconName = `${this.animationSetName}-1`;
        }

        this.displayName = getTextDef(`Entity name: ${config.displayNameId}`);
    }

    static setupAnimations() {
        function createTwoFrameAnim(key: string) {
            Global.gameScene.anims.create({
                key,
                defaultTextureKey: 'game-atlas',
                frames: [
                    { frame: `${key}-effect-1` },
                    { frame: `${key}-effect-2` },
                ],
                frameRate: 2,
                repeat: -1,
                showOnStart: true,
            });
        }

        createTwoFrameAnim('health-regen');
        createTwoFrameAnim('cured');
        createTwoFrameAnim('cold-resistance');
        createTwoFrameAnim('poison');
        createTwoFrameAnim('burn');
        createTwoFrameAnim('chill');
        createTwoFrameAnim('broken-bones');
        createTwoFrameAnim('curse');
        createTwoFrameAnim('enchantment');
    }

    /**
     * Adds a set of animations to the animation manager for this entity.
     * i.e. for a set name of "knight", an animation called "knight" would be created.
     * Uses the 1-2-1-2... pattern for frame sequence.
     */
    static addAnimationSet() {
        const setName = this.animationSetName;
        const frameSequence = this.animationFrameSequence;
        const repeats = this.animationRepeats;
        const duration = this.animationDuration;
        const defaultTextureKey = 'game-atlas';

        if (!setName) {
            // Skip the Entity class itself. It has no animation set of it's own to add.
            if (setName !== null) {
                warning(`No animation set defined for entity type with type name '${this.typeName}'. Skipping.`);
            }
            return;
        }

        Global.gameScene.anims.create({
            key: `${setName}`,
            defaultTextureKey,
            frames: frameSequence!.map((frameNumber) => ({ frame: `${setName}-${frameNumber}` })),
            duration,
            repeat: repeats ? -1 : undefined,
        });

        message('Added animation set for:', this.typeName, ', set name:', setName);
    }
}

export default Entity;
