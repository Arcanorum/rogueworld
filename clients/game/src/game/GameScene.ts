import Phaser from 'phaser';
import PubSub from 'pubsub-js';
import EntitiesList from './EntitiesList'; // TODO: what am I doing with this?
import Tilemap from './Tilemap';
import UseItem from '../shared/UseItem';
import SoundManager from './SoundManager';
import Config from '../shared/Config';
import {
    ApplicationState,
    BankState,
    GUIState,
    InventoryState,
    PlayerState,
    resetStates,
} from '../shared/state';
import { addGameEventResponses } from '../network/websocket_events/WebSocketEvents';
import {
    GLORY_VALUE,
    HITPOINTS_VALUE,
    POSITION_VALUE,
    FOCUS_CHAT,
    USED_ITEM,
} from '../shared/EventTypes';
import Panels from '../components/game/gui/panels/Panels';
import Global from '../shared/Global';
import eventResponses from '../network/websocket_events/EventResponses';
import { message, pixelDistanceBetween, warning } from '../../../../shared/utils/src';
import { DynamicEntity, DynamicEntityData } from '../shared/types';
import { DayPhases } from '../../../../shared/types/src/DayPhases';
import Player from './entities/characters/Player';

class GameScene extends Phaser.Scene {
    /**
     * The name of the board the player is on. This has nothing to do with a dungeon instance that
     * this board might be for.
     */
    currentBoardName!: string;

    boardAlwaysNight!: boolean;

    /** The Z depth of the various display containers, as set by .setDepth. */
    renderOrder = {
        ground: 1,
        statics: 2,
        dynamics: 3,
        particles: 4,
        darkness: 5,
        borders: 6,
        fpsText: 7,
    };

    dynamicsData: Array<DynamicEntityData> = [];

    dayPhase!: DayPhases;

    fpsText!: Phaser.GameObjects.Text;

    tilemap!: Tilemap;

    /**
     * How often to send each move event.
     */
    moveRate = 250;

    /**
     * The time after which the next move can be performed.
     */
    nextMoveTime = 0;

    playerTween: Phaser.Tweens.Tween | null = null;

    /**
     * A list of all dynamic entities. Dynamics are display entities that can be added
     * at any time, and cannot be loaded into the map data.
     */
    dynamics: {[key: string]: DynamicEntity} = {};

    /**
     * A list of any dynamics that do anything when interacted
     * with (moved into/pressed), such as opening a panel.
     */
    interactables: {[key: string]: DynamicEntity} = {};

    /**
     * A list of all light sources, used to update the darkness grid. Light sources can be static or dynamic.
     */
    lightSources: {[key: string]: DynamicEntity} = {};

    dynamicSpritesContainer!: Phaser.GameObjects.Container;

    soundManager!: SoundManager;

    // Flags for if a move key is held down, to allow continuous movement.
    moveUpIsDown = false;
    moveDownIsDown = false;
    moveLeftIsDown = false;
    moveRightIsDown = false;

    damageParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    skillUpParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    /**
     * A list of PubSub subscription IDs, to be removed on shutdown.
     * @TODO Move to a separate file
     */
    subs: Array<string> = [];

    keyboardKeys: {[key: string]: any} = {};

    boundPointerDownHandler!: (event: any) => void;

    boundKeyDownHandler!: (event: any) => void;

    constructor() {
        super('Game');
    }

    init() {
        message('Game init');

        // Make this state globally accessible.
        Global.gameScene = this;

        const data = ApplicationState.joinWorldData!;

        this.currentBoardName = data.boardName;

        this.boardAlwaysNight = data.boardAlwaysNight;

        // Initialise player state values.
        const playerData = data.player;
        PlayerState.entityId = playerData.id;
        PlayerState.setRow(playerData.row);
        PlayerState.setCol(playerData.col);
        PlayerState.setDisplayName(playerData.displayName);
        PlayerState.setHitPoints(playerData.hitPoints);
        PlayerState.setMaxHitPoints(playerData.maxHitPoints);
        PlayerState.setFood(playerData.food);
        PlayerState.setMaxFood(playerData.maxFood);
        PlayerState.setGlory(playerData.glory);
        PlayerState.setDefence(playerData.defence);
        InventoryState.setItems(data.inventory.items);
        InventoryState.loadHotbar(data.accountId);
        InventoryState.setWeight(data.inventory.weight);
        InventoryState.setMaxWeight(data.inventory.maxWeight);
        BankState.items = data.bank.items;
        BankState.setWeight(data.bank.weight);
        BankState.setMaxWeight(data.bank.maxWeight);
        BankState.setMaxWeightUpgradeCost(data.bank.maxWeightUpgradeCost);
        BankState.additionalMaxBankWeightPerUpgrade = data.bank.additionalMaxBankWeightPerUpgrade;

        this.dynamicsData = data.dynamicsData;

        // this.dayPhase = data.dayPhase || DayPhases.Day;

        // Setup animations for entity types that have them configured.
        Object.values(EntitiesList).forEach((EntityType) => {
            // The file might be commented out to disable it for the time being.
            // Check it has something added for this entity type.
            if (EntityType) {
                // if (EntityType.setupAnimations) EntityType.setupAnimations();
                // if (EntityType.addAnimationSet) EntityType.addAnimationSet();
            }
        });

        // Set the game container to be the thing that is fullscreened when fullscreen mode
        // is entered, instead of just the game canvas, or the GUI will be invisible.
        this.scale.fullscreenTarget = document.getElementById('game-cont');

        // Listen for the resize event so anything that needs to be updated can be.
        this.scale.on('resize', () => {
            this.fpsText.y = window.innerHeight - 30;
            this.tilemap.updateBorders();
        });

        if(playerData.moveRate) {
            this.moveRate = playerData.moveRate;
        }
    }

    create() {
        message('Game create');

        // A containert to put all dynamics into, so they stay on the same layer relative to other things in the display order.
        this.dynamicSpritesContainer = this.add.container();
        this.dynamicSpritesContainer.setDepth(this.renderOrder.dynamics);

        this.soundManager = new SoundManager(this);
        this.tilemap = new Tilemap(this);
        this.tilemap.loadMap(this.currentBoardName);

        // Add the entities that are visible on start.
        this.dynamicsData.forEach((dynamicData) => {
            this.addEntity(dynamicData);
        });

        this.setupKeyboardControls();

        // Lock the camera to the player sprite.
        this.cameras.main.startFollow(this.dynamics[PlayerState.entityId].spriteContainer);

        this.boundPointerDownHandler = this.pointerDownHandler.bind(this);
        document.addEventListener('mousedown', this.boundPointerDownHandler);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                if (GUIState.activePanel === Panels.Inventory) {
                    GUIState.setActivePanel(Panels.NONE);
                }
                else {
                    GUIState.setActivePanel(Panels.Inventory);
                }
            }
        });

        this.fpsText = this.add.text(10, window.innerHeight - 30, 'FPS:', {
            fontFamily: '"Courier"',
            fontSize: '24px',
            color: '#00ff00',
        });
        this.fpsText.setFontSize(64);
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(this.renderOrder.fpsText);
        this.fpsText.visible = GUIState.showFPS;

        const damageParticles = this.add.particles('game-atlas');

        this.damageParticleEmitter = damageParticles.createEmitter({
            frame: [ 'damage-particle-1', 'damage-particle-2', 'damage-particle-3' ],
            x: { min: -200, max: 200 },
            speed: { min: 200, max: 300 },
            angle: { min: 220, max: 320 },
            quantity: { min: 1, max: 7 },
            lifespan: { min: 400, max: 600 },
            scale: { min: Config.GAME_SCALE * 0.8, max: Config.GAME_SCALE * 1.2 },
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 },
            gravityY: 1000,
            on: false,
        });

        damageParticles.setDepth(this.renderOrder.particles);

        const skillUpParticles = this.add.particles('game-atlas');

        this.skillUpParticleEmitter = skillUpParticles.createEmitter({
            frame: [ 'star-particle-01', 'star-particle-02', 'star-particle-03', 'star-particle-04', 'star-particle-05' ],
            x: { min: -200, max: 200 },
            speed: { min: 200, max: 300 },
            angle: { min: 220, max: 320 },
            quantity: { min: 3, max: 7 },
            lifespan: { min: 1800, max: 2200 },
            scale: { min: Config.GAME_SCALE * 0.4, max: Config.GAME_SCALE * 0.4 },
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 },
            gravityY: 450,
            on: false,
        });

        skillUpParticles.setDepth(this.renderOrder.particles);

        // Add the websocket event responses after the game state is started.
        addGameEventResponses();

        // Re-run any missed events while the game state was loading.
        ApplicationState.missedWebsocketEvents.forEach((missedEvent) => {
            // Check the event name is still valid. The event handler might have been removed since
            // this event was added to the missed events list, such as if thre is a disconnect/error
            // during the loading phase.
            if (eventResponses[missedEvent.eventName]) {
                eventResponses[missedEvent.eventName](missedEvent.data);
            }
        });

        // Clear the missed events.
        ApplicationState.missedWebsocketEvents = [];

        // Game finished loading. Let the loading/hint screen be closed.
        ApplicationState.setLoading(false);

        this.subs = [
            PubSub.subscribe(HITPOINTS_VALUE, (msg, data) => {
                // If they were damaged, play a hit sound.
                if (data.old > data.new) {
                    Global.gameScene.sound.play('falling-hit-on-gravel', { volume: GUIState.effectsVolume / 100 });
                }
                // If the player is now dead, play the death music.
                if (data.new <= 0) {
                    this.soundManager.music.changeBackgroundMusic(
                        this.soundManager.music.sounds.deathLoop,
                    );
                }
            }),
            PubSub.subscribe(GLORY_VALUE, (msg, data) => {
                const onGloryModified = (
                    this.dynamics[PlayerState.entityId].spriteContainer as Player
                ).onGloryModified;

                if(onGloryModified) {
                    // Show how much glory was gained or lost.
                    onGloryModified(`${data.new - data.old}`);
                }
            }),
            PubSub.subscribe(POSITION_VALUE, (msg, data) => {
                // Check the music to play.
                // const positionMusicName = this.currentMapMusicZones[`${data.new.row}-${data.new.col}`];

                // // Nothing to play here, keep playing whatever is currently playing.
                // if (!positionMusicName) return;

                // const positionMusic = this.soundManager.music.sounds[positionMusicName];

                // // Check the music to play is in the sound manager.
                // if (!positionMusic) return;

                // // If it is the same song, don't bother changing it.
                // if (positionMusic === this.soundManager.music.currentBackgroundMusic) return;

                // // Start the new music playing.
                // this.soundManager.music.changeBackgroundMusic(positionMusic);
            }),
        ];

        this.events.on('destroy', this.shutdown, this);
    }

    update() {
        if (this.nextMoveTime < Date.now()) {
            this.nextMoveTime = Date.now() + this.moveRate;

            // Allow continuous movement if a move key is held down.
            if (this.moveUpIsDown === true) {
                this.checkCollidables('u');
                ApplicationState.connection?.sendEvent('mv_u');
            }
            if (this.moveDownIsDown === true) {
                this.checkCollidables('d');
                ApplicationState.connection?.sendEvent('mv_d');
            }
            if (this.moveLeftIsDown === true) {
                this.checkCollidables('l');
                ApplicationState.connection?.sendEvent('mv_l');
            }
            if (this.moveRightIsDown === true) {
                this.checkCollidables('r');
                ApplicationState.connection?.sendEvent('mv_r');
            }
        }

        if (GUIState.showFPS) {
            this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
        }
    }

    shutdown() {
        message('Game shutdown:', this);

        // Remove the handler for keyboard events, so it doesn't try to do gameplay stuff while on the landing screen.
        document.removeEventListener('keydown', this.boundKeyDownHandler);
        document.removeEventListener('mousedown', this.boundPointerDownHandler);

        // Clean up subscriptions before stopping the game.
        this.subs.forEach((sub) => {
            PubSub.unsubscribe(sub);
        });

        resetStates();
    }

    /**
     * Attempt to move the player in a direction.
     */
    move(direction: string) {
        this.checkCollidables(direction);

        if (PlayerState.hitPoints <= 0) return;
        ApplicationState.connection?.sendEvent(`mv_${direction}`);

        this.nextMoveTime = Date.now() + this.moveRate;
    }

    /**
     * Check any dynamics and statics that do anything when the player tries to
     * move/bump into them with, such as opening a panel.
     */
    checkCollidables(direction: string) {
        // Check if any interactables that cause this client
        // to do something are about to be walked into.
        let playerNextRow = PlayerState.row;
        let playerNextCol = PlayerState.col;

        if (direction === 'u') playerNextRow -= 1;
        else if (direction === 'd') playerNextRow += 1;
        else if (direction === 'l') playerNextCol -= 1;
        else playerNextCol += 1;

        const interactableInFront = this.interactables[`${playerNextRow}-${playerNextCol}`];

        if (interactableInFront) {
            // // If it is a static, which is just a sprite.
            // if (interactableInFront.onMovedInto) {
            //     interactableInFront.onMovedInto();
            // }
            // If it is a dynamic, it has a sprite container.
            // if (interactableInFront.spriteContainer
            //     && interactableInFront.spriteContainer.onMovedInto) {
            //     interactableInFront.spriteContainer.onMovedInto();
            // }
        }
    }

    pointerDownHandler(event: PointerEvent) {
        // Stop double clicking from highlighting text elements, and zooming in on mobile.
        // event.preventDefault();
        // Only use the selected item if the input wasn't over any other GUI element.
        if (((event.target as Element).parentNode as Element)!.id === 'game-canvas') {
            // If the user pressed on their character sprite, pick up item.
            if (pixelDistanceBetween(
                this.dynamics[PlayerState.entityId].spriteContainer,
                this.cameras.main,
                event,
            ) < 32) {
                ApplicationState.connection?.sendEvent('pick_up_item');
                return;
            }

            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const targetX = event.clientX - midX;
            const targetY = event.clientY - midY;
            let direction = 'u';
            if (Math.abs(targetX) > Math.abs(targetY)) {
                if (targetX > 0) direction = 'r';
                else direction = 'l';
            }
            else if (targetY > 0) direction = 'd';
            else direction = 'u';

            // Try to use the held item if one is selected.
            if (InventoryState.holding) {
                // Tell the game server this player wants to use this item.
                PubSub.publish(USED_ITEM, InventoryState.holding);
                ApplicationState.connection?.sendEvent('use_held_item', direction);
            }
            // Do a melee attack.
            else {
                ApplicationState.connection?.sendEvent('melee_attack', direction);
            }
        }
    }

    checkKeyFilters() {
        // Don't move while an input has focus
        if (document.activeElement?.tagName === 'INPUT') return true;
        // Or any panel is open.
        if (GUIState.activePanel !== Panels.NONE) {
            // Except chat panel.
            if (GUIState.activePanel !== Panels.Chat) return true;
        }

        return false;
    }

    moveUpPressed() {
        if (this.checkKeyFilters()) return;
        this.move('u');
        this.moveUpIsDown = true;
    }

    moveDownPressed() {
        if (this.checkKeyFilters()) return;
        this.move('d');
        this.moveDownIsDown = true;
    }

    moveLeftPressed() {
        if (this.checkKeyFilters()) return;
        this.move('l');
        this.moveLeftIsDown = true;
    }

    moveRightPressed() {
        if (this.checkKeyFilters()) return;
        this.move('r');
        this.moveRightIsDown = true;
    }

    moveUpReleased() {
        this.moveUpIsDown = false;
    }

    moveDownReleased() {
        this.moveDownIsDown = false;
    }

    moveLeftReleased() {
        this.moveLeftIsDown = false;
    }

    moveRightReleased() {
        this.moveRightIsDown = false;
    }

    keyDownHandler(event: KeyboardEvent) {
        if (this.checkKeyFilters()) return;

        const { key } = event;

        const number = parseInt(key);

        // Get the 0 - 9 keys.
        if (number > -1
            && number < 10) {
            const hotbarItem = InventoryState.hotbar[number - 1];

            if (hotbarItem) {
                UseItem(hotbarItem);
            }
        }

        if (event.code === 'KeyE') {
            ApplicationState.connection?.sendEvent('pick_up_item');
        }

        if (event.code === 'Space') {
            if (GUIState.activePanel === Panels.Inventory) {
                GUIState.setActivePanel(Panels.NONE);
            }
            else {
                GUIState.setActivePanel(Panels.Inventory);
            }
        }
    }

    setupKeyboardControls() {
        // Add the handler for keyboard events.
        this.boundKeyDownHandler = this.keyDownHandler.bind(this);
        document.addEventListener('keydown', this.boundKeyDownHandler);

        this.keyboardKeys = this.input.keyboard.addKeys(
            {
                arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
                arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
                arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
                arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,

                w: Phaser.Input.Keyboard.KeyCodes.W,
                s: Phaser.Input.Keyboard.KeyCodes.S,
                a: Phaser.Input.Keyboard.KeyCodes.A,
                d: Phaser.Input.Keyboard.KeyCodes.D,

                shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,

                enterChat: Phaser.Input.Keyboard.KeyCodes.ENTER,

                escape: Phaser.Input.Keyboard.KeyCodes.ESC,

                i: Phaser.Input.Keyboard.KeyCodes.I,
                v: Phaser.Input.Keyboard.KeyCodes.V,
                b: Phaser.Input.Keyboard.KeyCodes.B,
                m: Phaser.Input.Keyboard.KeyCodes.M,
            },
        );
        // Stop the key press events from being captured by Phaser, so they
        // can go up to the browser to be used in the chat input box.
        this.input.keyboard.removeCapture([
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,

            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.D,

            Phaser.Input.Keyboard.KeyCodes.I,
            Phaser.Input.Keyboard.KeyCodes.C,
            Phaser.Input.Keyboard.KeyCodes.V,
            Phaser.Input.Keyboard.KeyCodes.B,
            Phaser.Input.Keyboard.KeyCodes.M,
        ]);

        this.keyboardKeys.arrowUp.on('down', this.moveUpPressed, this);
        this.keyboardKeys.arrowDown.on('down', this.moveDownPressed, this);
        this.keyboardKeys.arrowLeft.on('down', this.moveLeftPressed, this);
        this.keyboardKeys.arrowRight.on('down', this.moveRightPressed, this);

        this.keyboardKeys.arrowUp.on('up', this.moveUpReleased, this);
        this.keyboardKeys.arrowDown.on('up', this.moveDownReleased, this);
        this.keyboardKeys.arrowLeft.on('up', this.moveLeftReleased, this);
        this.keyboardKeys.arrowRight.on('up', this.moveRightReleased, this);

        this.keyboardKeys.w.on('down', this.moveUpPressed, this);
        this.keyboardKeys.s.on('down', this.moveDownPressed, this);
        this.keyboardKeys.a.on('down', this.moveLeftPressed, this);
        this.keyboardKeys.d.on('down', this.moveRightPressed, this);

        this.keyboardKeys.w.on('up', this.moveUpReleased, this);
        this.keyboardKeys.s.on('up', this.moveDownReleased, this);
        this.keyboardKeys.a.on('up', this.moveLeftReleased, this);
        this.keyboardKeys.d.on('up', this.moveRightReleased, this);

        this.keyboardKeys.enterChat.on('down', () => {
            if (GUIState.quickChatEnabled) {
                GUIState.setShowChatBox(!GUIState.showChatBox);
            }
            else {
                // Focus on the chat box.
                PubSub.publish(FOCUS_CHAT);
            }
        });

        this.keyboardKeys.escape.on('down', () => {
            // Don't allow the respawn panel to be closed.
            if (GUIState.activePanel === Panels.Respawn) return;

            GUIState.setActivePanel(Panels.NONE);
            GUIState.setTooltipContent(null);
        });

        this.keyboardKeys.i.on('down', () => {
            if (this.checkKeyFilters()) return;

            if (GUIState.activePanel === Panels.Inventory) {
                GUIState.setActivePanel(Panels.NONE);
            }
            else {
                GUIState.setActivePanel(Panels.Inventory);
            }
        });

        // this.keyboardKeys.v.on('down', () => {
        //     if (this.checkKeyFilters()) return;

        //     if (GUIState.activePanel === Panels.Stats) {
        //         GUIState.setActivePanel(Panels.NONE);
        //     }
        //     else {
        //         GUIState.setActivePanel(Panels.Stats);
        //     }
        // });

        // this.keyboardKeys.b.on('down', () => {
        //     if (this.checkKeyFilters()) return;

        //     if (GUIState.activePanel === Panels.Tasks) {
        //         GUIState.setActivePanel(Panels.NONE);
        //     }
        //     else {
        //         GUIState.setActivePanel(Panels.Tasks);
        //     }
        // });

        this.keyboardKeys.m.on('down', () => {
            if (this.checkKeyFilters()) return;

            if (GUIState.activePanel === Panels.Map) {
                GUIState.setActivePanel(Panels.NONE);
            }
            else {
                GUIState.setActivePanel(Panels.Map);
            }
        });
    }

    /**
     * Used to add any kind of entity to the game world, such as dynamics.
     */
    addEntity(data: DynamicEntityData) {
        // Sort the statics from the dynamics. Statics don't have an ID.
        // if (data.id === undefined) {
        //     this.updateStatic(data);
        // }
        // else {
        this.addDynamic(data);
        // }
    }

    /**
     * Update a newly added static on the game world, as a static might not be in its default state.
     * When a player comes into view of a static on the server that is not in its default state, its current state will be sent.
     * The actual Static object is added when the statics grid is updated in Tilemap.
     * @param {Number} data.row
     * @param {Number} data.col
     */
    // updateStatic(data) {
    //     if (Global.gameScene.statics[`${data.row}-${data.col}`] === undefined) {
    //         // The static is not yet added to the grid. Wait a bit for the current player tween to
    //         // finish and the edge is loaded, by which point the static tile should have been added.
    //         setTimeout(this.tilemap.updateStaticTile.bind(this.tilemap), 500, `${data.row}-${data.col}`, false);
    //     }
    //     else {
    //         // Tile already exists/is in view. Make it look inactive.
    //         this.tilemap.updateStaticTile(`${data.row}-${data.col}`, false);
    //     }
    //     // TODO might need to add the above here also, in some weird case. wait and see...
    // }

    /**
     * Add a new dynamic to the game world.
     */
    addDynamic(data: DynamicEntityData) {
        const {
            id, typeNumber, row, col,
        } = data;

        // console.log("adding dynamic entity type:", typeNumber, "at row:", row, ", col:", col, ", config:", data);

        // Don't add another entity if the one with this ID already exists.
        if (this.dynamics[id] !== undefined) {
            // console.log("* * * * * skipping add entity, already exists:", id);
            return;
        }

        // Check that an entity type exists with the type name that corresponds to the given type number.
        if (!EntitiesList[Config.EntityTypes[typeNumber].typeName]) {
            warning(`Invalid entity type number: "${typeNumber}". Entity types:`, Config.EntityTypes);
            return;
        }

        // Add an object that represents this entity to the dynamics list.
        this.dynamics[id] = {
            id,
            row,
            col,
            spriteContainer: new EntitiesList[Config.EntityTypes[typeNumber].typeName](
                col * Config.TILE_SIZE * Config.GAME_SCALE,
                row * Config.TILE_SIZE * Config.GAME_SCALE,
                data,
            ),
        };

        const dynamicSpriteContainer = this.dynamics[id].spriteContainer;

        // Add the sprite to the world group, as it extends sprite but
        // overrides the constructor so doesn't get added automatically.
        // Global.gameScene.add.existing(dynamicSpriteContainer);

        // if (dynamicSpriteContainer.centered === true) {
        //     dynamicSpriteContainer.setOrigin(0.5);
        // }

        // If the entity has a light distance, add it to the light sources list.
        // Even if it is 0, still add it if it is defined as it could be something like a
        // extinguished torch that could be relit later, would still need to be in the list.
        // if (dynamicSpriteContainer.lightDistance !== undefined) {
        //     this.lightSources[id] = this.dynamics[id];
        //     this.tilemap.updateDarknessGrid();
        // }

        // If this entity does anything on the client when interacted with, add it to the interactables list.
        // if (dynamicSpriteContainer.interactable === true) {
        //     this.interactables[id] = this.dynamics[id];
        // }

        this.dynamicSpritesContainer.add(dynamicSpriteContainer);

        // Move sprites further down the screen above ones further up.
        this.dynamicSpritesContainer.sort('y');
    }

    /**
     * Remove the dynamic with the given ID from the game.
     */
    removeDynamic(id: string) {
        // Don't try to remove an entity that doesn't exist.
        if (this.dynamics[id] === undefined) {
            // console.log("skipping remove entity, doesn't exist:", id);
            return;
        }

        // if (this.lightSources[id]) {
        //     delete this.lightSources[id];
        //     this.tilemap.updateDarknessGrid();
        // }

        // if (this.interactables[id]) {
        //     delete this.interactables[id];
        // }

        this.dynamics[id].spriteContainer.destroy();

        delete this.dynamics[id];
    }

    /**
     * Check for and remove any dynamics that are outside of the player's view range.
     */
    checkDynamicsInViewRange() {
        const { dynamics } = this;
        const playerentityId = PlayerState.entityId;
        let dynamicSpriteContainer;
        const playerRowTopViewRange = PlayerState.row - Config.VIEW_RANGE;
        const playerColLeftViewRange = PlayerState.col - Config.VIEW_RANGE;
        const playerRowBotViewRange = PlayerState.row + Config.VIEW_RANGE;
        const playerColRightViewRange = PlayerState.col + Config.VIEW_RANGE;
        // let darknessGridDirty = false;

        Object.entries(dynamics).forEach(([ key, dynamic ]) => {
            dynamicSpriteContainer = dynamic.spriteContainer;

            // Skip the player entity's sprite.
            if (dynamic.id === playerentityId) return;

            // Check if it is within the player view range.
            if (dynamic.row < playerRowTopViewRange
                || dynamic.row > playerRowBotViewRange
                || dynamic.col < playerColLeftViewRange
                || dynamic.col > playerColRightViewRange) {
                // Out of view range. Remove it.
                dynamicSpriteContainer.destroy();
                delete this.dynamics[key];
                // if (dynamicSpriteContainer.lightDistance) {
                //     delete this.lightSources[key];
                //     // Don't need to update the darkness grid each time.
                //     // Just do it once at the end if needed.
                //     darknessGridDirty = true;
                // }
                return;
            }

            dynamicSpriteContainer.onMove();
        });

        // if (darknessGridDirty) {
        //     this.tilemap.updateDarknessGrid();
        // }
    }

    /**
     * Create a text chat message above the target entity.
     * @param entityId - The entity to make this chat appear from. If not given, uses this player.
     */
    chat(entityId: string, message: string, fillColour = '#f5f5f5') {
        // console.log("chat");
        // Check an entity ID was given. If not, use this player.
        entityId = entityId || PlayerState.entityId;

        // Make sure the message is a string.
        message += '';

        const dynamic = this.dynamics[entityId];
        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const style = {
            fontFamily: '\'Press Start 2P\'',
            fontSize: '20',
            align: 'center',
            fill: fillColour || '#f5f5f5',
            stroke: '#000000',
            strokeThickness: 4,
            wordWrap: {
                width: 400,
            },
        };

        const chatText = Global.gameScene.add.text(0, -16, message, style);
        // Add it to the dynamics group so that it will be affected by scales/transforms correctly.
        dynamic.spriteContainer.add(chatText);
        chatText.setOrigin(0.5);
        chatText.setScale(0.3);
        // Make the chat message scroll up.
        Global.gameScene.tweens.add({
            targets: chatText,
            duration: Config.CHAT_BASE_LIFESPAN + (60 * message.length),
            y: '-=30',
        });
        // How long the message should stay for.
        const duration = Config.CHAT_BASE_LIFESPAN + (80 * message.length);
        // Destroy and remove from the list of chat messages when the lifespan is over.
        setTimeout(() => {
            chatText.destroy();
        }, duration);
    }
}

export default GameScene;
