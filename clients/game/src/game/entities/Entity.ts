import { tileDistanceBetween, warning } from '@dungeonz/utils';
import Panels from '../../components/game/gui/panels/Panels';
import Config from '../../shared/Config';
import { setDefaultCursor, setHandCursor } from '../../shared/Cursors';
import { SELECTED_ENTITY_HITPOINTS } from '../../shared/EventTypes';
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
    static displayName = '';

    /** The file name (without file type extension) of the image to use for this entity (i.e. when selected). */
    static iconName = '';

    /** The base name of this set of animations. */
    static animationSetName = '';

    /** The numbers of the frames to play, and the order to play them in. */
    static animationFrameSequence: Array<number> = [1, 2, 1, 2]; // TODO: why not just [1, 2] ?

    /** Whether the animation should loop. i.e. for things that always look moving, such as bats. */
    static animationRepeats = false;

    /** How long the animation should last, in ms. */
    static animationDuration = 1000;

    /** Whether this entity should allow opening the crafting panel, and for what station. */
    static craftingStationClass = '';

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
        if(frame) {
            this.baseSprite.setFrame(frame);
        }
        this.baseSprite.setOrigin(0.5);
        this.add(this.baseSprite);

        // Don't bother playing 1 frame animations.
        if(EntityType.animationFrameSequence.length > 1) {
            this.baseSprite.anims.play(EntityType.animationSetName);
        }

        // Use a specific display name if given, or the one for this entity type.
        const displayName = config.displayName || EntityType.displayName;

        if(displayName) {
            // Can be undefined or an object with an optional "fill" and "stroke"
            // property to be set as any color string value Phaser can take.
            // Used for differentiating clan members by name color.
            // this.displayNameColor = config.displayNameColor; TODO: remove this? might use for teammates/aggroed?

            this.addDisplayName(displayName);
        }

        // this.healthRegenEffect = this.addEffect('health-regen-effect-1');
        // this.curedEffect = this.addEffect('cured-effect-1');
        // this.coldResistanceEffect = this.addEffect('cold-resistance-effect-1');
        // this.poisonEffect = this.addEffect('poison-effect-1');
        // this.burnEffect = this.addEffect('burn-effect-1');
        // this.chillEffect = this.addEffect('chill-effect-1');
        // this.chillEffect.setAlpha(0.5);
        // this.brokenBonesEffect = this.addEffect('broken-bones-effect-1');

        // this.curseEffect = this.addEffect('curse-effect-1');
        // this.curseEffect.x = -6;
        // this.curseEffect.y = -10;
        // this.curseEffect.setScale(0.8);

        // this.enchantmentEffect = this.addEffect('enchantment-effect-1');
        // this.enchantmentEffect.x = 6;
        // this.enchantmentEffect.y = -10;
        // this.enchantmentEffect.setScale(0.8);

        this.baseSprite.on('animationcomplete', this.moveAnimCompleted, this);

        this.baseSprite.setInteractive();

        this.baseSprite.on('pointerdown', this.onPointerDown, this);
        this.baseSprite.on('pointerover', this.onPointerOver, this);
        this.baseSprite.on('pointerout', this.onPointerOut, this);

        this.baseSprite.on('destroy', this.onDestroy, this);
    }

    onDestroy() {
        if(this.particlesOnDestroy) {
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
        // If they are close enough to the player, play a death splat sound.
            if (tileDistanceBetween(
                dynamics[PlayerState.entityId], dynamics[this.entityId],
            ) <= 5) {
                Global.gameScene.sound.play('sword-cutting-flesh', { volume: GUIState.effectsVolume / 100 });
            }
        }

        if(this === GUIState.selectedEntity) {
            GUIState.setSelectedEntity(null);
        }
    }

    /**
     * Attempt to interact with the entity when pressed.
     */
    onPointerDown() {
        // Prevent interacting with things in the game while any panel is open.
        if(GUIState.activePanel !== Panels.NONE) return;

        const thisDynamic = Global.gameScene.dynamics[PlayerState.entityId];
        const playerDynamic = Global.gameScene.dynamics[this.entityId];

        GUIState.setSelectedEntity(this);

        const dist = tileDistanceBetween(thisDynamic, playerDynamic);

        const EntityType = this.constructor as typeof Entity;
        // If this is something that can be crafted at, open the crafting panel.
        if(EntityType.craftingStationClass) {
            // Check they are within range to interact with the entity.
            if(dist <= 1) {
                // Prevent opening the crafting panel when a station is clicked on behind and already open panel.
                if (GUIState.activePanel !== Panels.NONE) {
                    // Except chat panel.
                    if (GUIState.activePanel !== Panels.Chat) return;
                }

                GUIState.setCraftingStation(
                    EntityType.craftingStationClass,
                    this.displayName.text,
                    EntityType.iconName,
                );
                GUIState.setActivePanel(Panels.Crafting);

                return;
            }
        }

        ApplicationState.connection?.sendEvent(
            'interact',
            {
                id: playerDynamic.id,
                row: playerDynamic.row,
                col: playerDynamic.col,
            },
        );
    }

    /**
     * Show the display name of this entity when it is hovered over.
     */
    onPointerOver() {
        if(this.displayName) {
            this.displayName.visible = true;
        }
        setHandCursor();
    }

    /**
     * Hide the display name when it isn't being hovered over any more.
     */
    onPointerOut() {
        if(this.displayName) {
            this.displayName.visible = false;
        }
        setDefaultCursor();
    }

    addEffect(frameName: string) {
        const sprite = Global.gameScene.add.sprite(0, 0, 'game-atlas', frameName);
        sprite.setOrigin(0.5);
        sprite.visible = false;
        this.add(sprite);
        return sprite;
    }

    flipHorizontally(direction: string) {
        this.baseSprite.setScale(direction === 'l' ? 1 : -1, 1);
    }

    /**
     * Should be called when the entity moves.
     * Move can be a normal move (like a running), or from a manual reposition (teleport/map change).
     * @param playMoveAnim Whether the move animation should be played. Don't play on
     *      reposition as it looks weird when they teleport but still do a move animation.
     */
    onMove(playMoveAnim?: boolean, moveAnimDuration = 4000) {
        // console.log('character.onMove:', moveAnimDuration);
        //     // TODO: flip the base sprite if moving the other way since the last move
        //     // dont bother for up/down

        //     // Don't bother if this is a looping animation. An animation should already been running.
        //     if (this.animationRepeats) return;


        //     if (playMoveAnim === true) {
        //         if (EntityType.animationSetName) {
        //             if (!this.baseSprite.anims.isPlaying) {
        //                 if(moveAnimDuration) {
        //                     moveAnimDuration = moveAnimDuration * 1.9;
        //                 }
        //                 this.baseSprite.play({
        //                     key: `${EntityType.animationSetName}`,
        //                     // An animation should play in full over 2 move steps, and also in full
        //                     // over just 1 (so it looks like a winddown).
        //                     // If the animation were to run in full for every move step, it would look
        //                     // very fast, so slow it down artificially so it appears more natural when
        //                     // played over a longer distance (i.e. over 2 tiles, instead of just 1).
        //                     // x2 the move duration (i.e. half the frame rate), and don't start a new
        //                     // animation for any incoming move events while this animation is still
        //                     // playing, so for the first step it plays the first half of the animation,
        //                     // but it will keep running, so when a second move event happens, the
        //                     // previous animation should still be running, on it's second half, thus
        //                     // completing the full move animation over 2 move steps.
        //                     // x2 might be too precice, so use 1.9 to give some margin for timing
        //                     // weirdness like lag, low FPS, etc.
        //                     duration: moveAnimDuration,
        //                     // TODO: test this has been fixed in recent phaser version
        //                     // frameRate: null, // Need to provide this or the duration won't take effect. Phaser 3.55.2 bug.
        //                 });
        //             }
        //         }
        //     }
    }

    onHitPointsModified(amount: string) {
        this.hitPoints += parseInt(amount);

        if(GUIState.selectedEntity === this) {
            PubSub.publish(SELECTED_ENTITY_HITPOINTS, { new: this.hitPoints });
        }

        super.onHitPointsModified(amount);
    }

    moveAnimCompleted() {
        return;
    }

    static loadConfig(config) {
        // Load anything else that hasn't already been set by the loadConfig method of a subclass.
        Object.entries(config).forEach(([key, value]) => {
            // Load whatever properties that have the same key in the config as on this class.
            if(key in this) {
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
        if(!this.iconName && this.animationSetName) {
            this.iconName = `${this.animationSetName}-1`;
        }
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
                warning('Adding animation set. Missing set name on class prototype somewhere. Skipping.');
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
    }
}

export default Entity;
