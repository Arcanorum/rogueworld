import Phaser from "phaser";
import PubSub from "pubsub-js";
import EntityTypes from "../catalogues/EntityTypes.json";
import EntitiesList from "./EntitiesList";
import Tilemap from "./Tilemap";
import GUI from "./gui/GUI";
// import Stats from "../../../client/src/Stats";
// import Inventory from "./Inventory";
// import CraftingManager from "../../../client/src/CraftingManager";
import Utils from "../shared/Utils";
// import BankManager from "../../../client/src/BankManager";
// import ClanManager from "../../../client/src/ClanManager";
import SoundManager from "./SoundManager";
import gameConfig from "../shared/GameConfig";
import { ApplicationState, PlayerState } from "../shared/state/States";
// import TextMetrics from "./TextMetrics";
import { addGameEventResponses } from "../network/websocket_events/WebSocketEvents";
import { CHAT_CLOSE, CHAT_OPEN, ENTER_KEY } from "../shared/EventTypes";

gameConfig.EntityTypes = EntityTypes;
gameConfig.EntitiesList = EntitiesList;

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    init() {
        Utils.message("Game init");

        // Make this state globally accessible.
        window.gameScene = this;

        const data = window.joinWorldData;
        // Game has loaded ok. Clear the backup timeouts.
        clearTimeout(window.joinWorldStartTimeout);
        clearTimeout(window.joinWorldReloadTimeout);

        /**
         * The name of the board the player is on. This has nothing to do with a dungeon instance that this board might be for.
         * @type {String}
         */
        this.currentBoardName = data.boardName;

        this.boardAlwaysNight = data.boardAlwaysNight;

        // TODO: the rest of this needs moving to the player state manager, most of it has already been moved.
        this.player = {
            entityId: data.player.id,
            row: data.player.row,
            col: data.player.col,
            displayName: data.player.displayName,
            // inventory: new Inventory(data.inventory),
            // bankManager: new BankManager(data.bankItems),
            holdingItem: false,
        };

        ApplicationState.setLoggedIn(data.isLoggedIn);

        const playerData = data.player;
        PlayerState.setHitPoints(playerData.hitPoints);
        PlayerState.setMaxHitPoints(playerData.maxHitPoints);
        PlayerState.setEnergy(playerData.energy);
        PlayerState.setMaxEnergy(playerData.maxEnergy);
        PlayerState.setGlory(playerData.glory);
        PlayerState.setDefence(playerData.defence);
        PlayerState.setStats(playerData.stats);
        PlayerState.setTasks(playerData.tasks);

        this.dynamicsData = data.dynamicsData;

        this.DayPhases = {
            Dawn: 1,
            Day: 2,
            Dusk: 3,
            Night: 4,
        };

        // The Z depth of the various display containers, as set by .setDepth.
        this.renderOrder = {
            ground: 1,
            statics: 2,
            dynamics: 3,
            particles: 4,
            darkness: 5,
            borders: 6,
            fpsText: 7,
        };

        this.dayPhase = data.dayPhase || this.DayPhases.Day;
        // this.dayPhase = this.DayPhases.Night;

        // Setup animations for entity types that have them configured.
        Object.values(EntitiesList).forEach((EntityType) => {
            // The file might be commented out to disable it for the time being.
            // Check it has something added for this entity type.
            if (EntityType) {
                if (EntityType.setupAnimations) EntityType.setupAnimations();
                if (EntityType.addAnimationSet) EntityType.addAnimationSet();
            }
        });

        // Set the game container to be the thing that is fullscreened when fullscreen mode
        // is entered, instead of just the game canvas, or the GUI will be invisible.
        this.scale.fullScreenTarget = document.getElementById("game-cont");

        // Listen for the resize event so anything that needs to be updated can be.
        this.scale.on("resize", () => {
            this.fpsText.y = window.innerHeight - 30;
            this.tilemap.updateBorders();
        });

        /**
         * How often to send each move event.
         * @type {Number}
         */
        this.moveDelay = 250;

        /**
         * The time after which the next move can be performed.
         * @type {number}
         */
        this.nextMoveTime = 0;

        this.playerTween = null;

        /**
         * A list of all static entities. Statics are display entities, whose data is already
         * in the map data, just waiting to be added when they come into view of the player.
         * @type {Object}
         */
        this.statics = {};

        /**
         * A list of any dynamics and statics that do anything when interacted
         * with (moved into/pressed), such as opening a panel.
         * @type {Object}
         */
        this.interactables = {};

        /**
         * A list of all dynamic entities. Dynamics are display entities that can be added
         * at any time, and cannot be loaded into the map data.
         * @type {Object}
         */
        this.dynamics = {};

        /**
         * A list of all light sources, used to update the darkness grid. Light sources can be static or dynamic.
         * @type {Object}
         */
        this.lightSources = {};

        /**
         * ChatInput status, determines whether chatInput is closed or opened.
         * @type {Boolean}
         */
        this.chatInputStatus = false;

        /**
         * A list of PubSub subscription
         * @TODO Move to a separate file
         * @type {Array.<PubSub>}
         */
        this.subs = [
            PubSub.subscribe(CHAT_OPEN, (msg, d) => { // can't use word data due to shadowing
                this.chatInputStatus = true;
            }),
            PubSub.subscribe(CHAT_CLOSE, (msg, d) => { // can't use word data due to shadowing
                this.chatInputStatus = false;
            }),
        ];
    }

    create() {
        Utils.message("Game create");

        // A containert to put all dynamics into, so they stay on the same layer relative to other things in the display order.
        this.dynamicSpritesContainer = this.add.container();
        this.dynamicSpritesContainer.setDepth(this.renderOrder.dynamics);

        this.soundManager = new SoundManager(this);
        // this.clanManager = new ClanManager();
        this.GUI = new GUI(this);
        // this.craftingManager = new CraftingManager();
        this.tilemap = new Tilemap(this);
        this.tilemap.loadMap(this.currentBoardName);

        // Make sure the inventory slots are showing the right items.
        // Object.keys(this.player.inventory).forEach((slotKey) => {
        //     window.gameScene.player.inventory.swapInventorySlots(slotKey, slotKey);
        // });

        // Load the bank items.
        // Make sure the bank slots are showing the right items.
        // this.player.bankManager.items.forEach((item, slotIndex) => {
        //     // Skip empty items slots.
        //     if (item.catalogueEntry === null) return;

        //     this.player.bankManager.addItemToContents(
        //         slotIndex,
        //         item.catalogueEntry,
        //         item.durability,
        //         item.maxDurability,
        //     );
        // });

        // Hide the panel, as if any of the slots were filled with existing items, they will be shown.
        // window.gameScene.GUI.bankPanel.hide();

        // Hide the shop panel, all of the slots are reset and empty ones won't be visible when first opened.
        // window.gameScene.GUI.shopPanel.hide();

        // Load the tasks.
        // Object.values(this.player.tasks).forEach((task) => {
        //     window.gameScene.GUI.tasksPanel.addTask(task);
        // });

        // Make sure the item icons are hidden. They aren't after being added at first.
        // window.gameScene.GUI.tasksPanel.hide();

        // Update the starting value for the next level exp requirement, for the default shown stat info.
        // window.gameScene.GUI.statsPanel.changeStatInfo(window.gameScene.player.stats.list.Melee);

        // Add the entities that are visible on start.
        for (let i = 0; i < this.dynamicsData.length; i += 1) {
            this.addEntity(this.dynamicsData[i]);
        }

        // window.gameScene.GUI.accountPanel.hide();
        // window.gameScene.GUI.createAccountPanel.hide();

        this.tilemap.updateDarknessGrid();

        // Flags for if a move key is held down, to allow continuous movement.
        this.moveUpIsDown = false;
        this.moveDownIsDown = false;
        this.moveLeftIsDown = false;
        this.moveRightIsDown = false;

        this.setupKeyboardControls();

        // Lock the camera to the player sprite.
        this.cameras.main.startFollow(this.dynamics[this.player.entityId].spriteContainer);

        // window.addEventListener("mousedown", this.pointerDownHandler);

        this.fpsText = this.add.text(10, window.innerHeight - 30, "FPS:", {
            fontFamily: "\"Courier\"",
            fontSize: "24px",
            color: "#00ff00",
        });
        this.fpsText.fontSize = "64px";
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(this.renderOrder.fpsText);

        const damageParticles = this.add.particles("game-atlas");

        this.damageParticleEmitter = damageParticles.createEmitter({
            frame: ["damage-particle-1", "damage-particle-2", "damage-particle-3"],
            x: { min: -200, max: 200 },
            speed: { min: 200, max: 300 },
            angle: { min: 220, max: 320 },
            quantity: { min: 1, max: 7 },
            lifespan: { min: 400, max: 600 },
            scale: { min: gameConfig.GAME_SCALE * 0.8, max: gameConfig.GAME_SCALE * 1.2 },
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 },
            gravityY: 1000,
            on: false,
        });

        damageParticles.setDepth(this.renderOrder.particles);

        // Start an initial background music playing.
        this.soundManager.music.changeBackgroundMusic(
            this.soundManager.music.sounds.location.generic1,
        );

        // Add the websocket event responses after the game state is started.
        addGameEventResponses();

        // Game finished loading. Let the loading/hint screen be closed.
        ApplicationState.setLoading(false);
    }

    update() {
        if (this.nextMoveTime < Date.now()) {
            this.nextMoveTime = Date.now() + this.moveDelay;

            // Allow continuous movement if a move key is held down.
            if (this.moveUpIsDown === true) {
                this.checkCollidables("u");
                window.ws.sendEvent("mv_u");
            }
            if (this.moveDownIsDown === true) {
                this.checkCollidables("d");
                window.ws.sendEvent("mv_d");
            }
            if (this.moveLeftIsDown === true) {
                this.checkCollidables("l");
                window.ws.sendEvent("mv_l");
            }
            if (this.moveRightIsDown === true) {
                this.checkCollidables("r");
                window.ws.sendEvent("mv_r");
            }
        }

        // Show an FPS counter.
        if (window.devMode) {
            this.fpsText.setText(`FPS:${Math.floor(this.game.loop.actualFps)}`);
        }
    }

    shutdown() {
        // Show the background GIF.
        // document.getElementById("background_img").style.visibility = "visible";

        // Hide the game, or it still shows a blank canvas over the login screen.
        // document.getElementById("game_cont").style.visibility = "hidden";

        // Remove the handler for keyboard events, so it doesn't try to do gameplay stuff while on the landing screen.
        document.removeEventListener("keydown", this.keyDownHandler);

        window.removeEventListener("mousedown", this.pointerDownHandler);

        // Remove some of the DOM GUI elements so they aren't stacked when the game state starts again.
        // this.GUI.removeExistingDOMElements(this.GUI.hitPointCounters);
        // this.GUI.removeExistingDOMElements(this.GUI.energyCounters);

        // for (const elemKey in this.GUI.inventoryBar.slots) {
        //     this.GUI.inventoryBar.slots[elemKey].container.remove();
        // }

        let { contents } = this.GUI.bankPanel;
        while (contents.firstChild) {
            contents.removeChild(contents.firstChild);
        }

        contents = this.GUI.shopPanel.contents;
        while (contents.firstChild) {
            contents.removeChild(contents.firstChild);
        }

        this.GUI.gui.style.visibility = "hidden";
        this.GUI.settingsBar.hide();

        // Hide all the panels.
        for (let i = 0; i < this.GUI.panels.length; i += 1) {
            this.GUI.panels[i].hide();
        }

        // Cleanup PubSub
        this.subs.forEach((sub) => {
            PubSub.unsubscribe(sub);
        });
    }

    /**
     * Attempt to move the player in a direction.
     * @param {String} direction
     */
    move(direction) {
        // Hide all panels, in case they are just moving away from the item for it.
        if (this.GUI && this.GUI.isAnyPanelOpen === true) {
            // Hide all the panels.
            this.GUI.hideAllPanels();
        }

        this.checkCollidables(direction);

        if (this.player.hitPoints <= 0) return;
        window.ws.sendEvent(`mv_${direction}`);

        this.nextMoveTime = Date.now() + this.moveDelay;
    }

    /**
     * Check any dynamics and statics that do anything when the player tries to
     * move/bump into them with, such as opening a panel.
     * @param {String} direction
     */
    checkCollidables(direction) {
        // Check if any interactables that cause this client
        // to do something are about to be walked into.
        let playerNextRow = this.player.row;
        let playerNextCol = this.player.col;

        if (direction === "u") playerNextRow -= 1;
        else if (direction === "d") playerNextRow += 1;
        else if (direction === "l") playerNextCol -= 1;
        else playerNextCol += 1;

        Object.values(this.interactables).some((interactable) => {
            if (
                interactable.row === playerNextRow
                && interactable.col === playerNextCol
            ) {
                // If it is a static, which is just a sprite.
                if (interactable.onMovedInto) {
                    interactable.onMovedInto();
                    return true;
                }
                // If it is a dynamic, it has a sprite container.
                if (interactable.spriteContainer && interactable.spriteContainer.onMovedInto) {
                    interactable.spriteContainer.onMovedInto();
                    return true;
                }
            }

            return false;
        });
    }

    pointerDownHandler(event) {
        // Stop double clicking from highlighting text elements, and zooming in on mobile.
        // event.preventDefault();
        // Only use the selected item if the input wasn't over any other GUI element.
        if (event.target === this.GUI.gameCanvas) {
            // If the user pressed on their character sprite, pick up item.
            if (Utils.pixelDistanceBetween(
                this.dynamics[this.player.entityId].spriteContainer.baseSprite,
                event,
            ) < 32) {
                window.ws.sendEvent("pick_up_item");
                return;
            }

            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const targetX = event.clientX - midX;
            const targetY = event.clientY - midY;
            let direction = "u";
            if (Math.abs(targetX) > Math.abs(targetY)) {
                if (targetX > 0) direction = "r";
                else direction = "l";
            }
            else if (targetY > 0) direction = "d";
            else direction = "u";

            // Try to use the held item if one is selected.
            if (this.player.holdingItem) {
                this.player.inventory.useHeldItem(direction);
            }
            else { // Do a melee attack.
                window.ws.sendEvent("melee_attack", direction);
            }
        }
    }

    checkKeyFilters() {
        if (this.GUI) {
            // Don't move while the chat input is open.
            if (this.chatInputStatus) return true;
            // Or the create account panel.
            // if (this.GUI.createAccountPanel.isOpen === true) return true;
            // Or the account panel.
            // if (this.GUI.accountPanel.isOpen === true) return true;
        }
        return false;
    }

    moveUpPressed() {
        if (this.checkKeyFilters()) return;
        this.move("u");
        this.moveUpIsDown = true;
    }

    moveDownPressed() {
        if (this.checkKeyFilters()) return;
        this.move("d");
        this.moveDownIsDown = true;
    }

    moveLeftPressed() {
        if (this.checkKeyFilters()) return;
        this.move("l");
        this.moveLeftIsDown = true;
    }

    moveRightPressed() {
        if (this.checkKeyFilters()) return;
        this.move("r");
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

    keyDownHandler(event) {
        if (this.checkKeyFilters()) return;

        const { key } = event;

        // Get the 0 - 9 keys.
        if (key > -1
            && key < 10) {
            // console.log("num key pressed:", codeNumber);
            // Add the "slot" part of the key to the inventory slot number.
            this.player.inventory.useItem(`slot${key}`);
        }

        if (event.code === "KeyE") {
            window.ws.sendEvent("pick_up_item");
        }
    }

    setupKeyboardControls() {
        // Add the handler for keyboard events.
        document.addEventListener("keydown", this.keyDownHandler.bind(this));

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
        ]);

        this.keyboardKeys.arrowUp.on("down", this.moveUpPressed, this);
        this.keyboardKeys.arrowDown.on("down", this.moveDownPressed, this);
        this.keyboardKeys.arrowLeft.on("down", this.moveLeftPressed, this);
        this.keyboardKeys.arrowRight.on("down", this.moveRightPressed, this);

        this.keyboardKeys.arrowUp.on("up", this.moveUpReleased, this);
        this.keyboardKeys.arrowDown.on("up", this.moveDownReleased, this);
        this.keyboardKeys.arrowLeft.on("up", this.moveLeftReleased, this);
        this.keyboardKeys.arrowRight.on("up", this.moveRightReleased, this);

        this.keyboardKeys.w.on("down", this.moveUpPressed, this);
        this.keyboardKeys.s.on("down", this.moveDownPressed, this);
        this.keyboardKeys.a.on("down", this.moveLeftPressed, this);
        this.keyboardKeys.d.on("down", this.moveRightPressed, this);

        this.keyboardKeys.w.on("up", this.moveUpReleased, this);
        this.keyboardKeys.s.on("up", this.moveDownReleased, this);
        this.keyboardKeys.a.on("up", this.moveLeftReleased, this);
        this.keyboardKeys.d.on("up", this.moveRightReleased, this);

        this.keyboardKeys.enterChat.on("down", () => {
            // Send player hitPoints and websocket to be used by chatInput
            // player is undefined 'cause it's not defined,
            PubSub.publish(ENTER_KEY, {
                hitPoints: this.player.hitPoints,
                webSocket: window.ws,
            });
        });
    }

    /**
     * Used to add any kind of entity to the game world, such as dynamics, or updating the state of any newly added statics.
     * @param {*} data
     */
    addEntity(data) {
        // Sort the statics from the dynamics. Statics don't have an ID.
        if (data.id === undefined) {
            // this.updateStatic(data);
        }
        else {
            this.addDynamic(data);
        }
    }

    /**
     * Update a newly added static on the game world, as a static might not be in its default state.
     * When a player comes into view of a static on the server that is not in its default state, its current state will be sent.
     * The actual Static object is added when the statics grid is updated in Tilemap.
     * @param {Number} data.row
     * @param {Number} data.col
     */
    updateStatic(data) {
        if (window.gameScene.statics[`${data.row}-${data.col}`] === undefined) {
            // The static is not yet added to the grid. Wait a bit for the current player tween to
            // finish and the edge is loaded, by which point the static tile should have been added.
            setTimeout(this.tilemap.updateStaticTile.bind(this.tilemap), 500, `${data.row}-${data.col}`, false);
        }
        else {
            // Tile already exists/is in view. Make it look inactive.
            this.tilemap.updateStaticTile(`${data.row}-${data.col}`, false);
        }
        // TODO might need to add the above here also, in some weird case. wait and see...
    }

    /**
     * Add a new dynamic to the game world.
     * @param {Number|String} data.id
     * @param {Number} data.typeNumber
     * @param {Number} data.row
     * @param {Number} data.col
     */
    addDynamic(data) {
        const { id } = data;
        const { typeNumber } = data;
        const { row } = data;
        const { col } = data;

        // console.log("adding dynamic entity type:", typeNumber, "at row:", row, ", col:", col, ", config:", data);

        // Don't add another entity if the one with this ID already exists.
        if (this.dynamics[id] !== undefined) {
            // console.log("* * * * * skipping add entity, already exists:", id);
            return;
        }

        // Check that an entity type exists with the type name that corresponds to the given type number.
        if (EntitiesList[EntityTypes[typeNumber]] === undefined) {
            Utils.warning(`Invalid entity type number: "${typeNumber}". Entity types:`, EntityTypes);
            return;
        }

        // Add an object that represents this entity to the dynamics list.
        this.dynamics[id] = {
            id,
            row,
            col,
            spriteContainer: new EntitiesList[EntityTypes[typeNumber]](
                col * gameConfig.TILE_SIZE * gameConfig.GAME_SCALE,
                row * gameConfig.TILE_SIZE * gameConfig.GAME_SCALE,
                data,
            ),
        };

        const dynamicSpriteContainer = this.dynamics[id].spriteContainer;

        // Add the sprite to the world group, as it extends sprite but
        // overwrites the constructor so doesn't get added automatically.
        // window.gameScene.add.existing(dynamicSpriteContainer);

        if (dynamicSpriteContainer.centered === true) {
            dynamicSpriteContainer.setOrigin(0.5);
        }

        // If the entity has a light distance, add it to the light sources list.
        // Even if it is 0, still add it if it is defined as it could be something like a
        // extinguished torch that could be relit later, would still need to be in the list.
        if (dynamicSpriteContainer.lightDistance !== undefined) {
            this.lightSources[id] = this.dynamics[id];
            this.tilemap.updateDarknessGrid();
        }

        // If this entity does anything on the client when interacted with, add it to the interactables list.
        if (dynamicSpriteContainer.interactable === true) {
            this.interactables[id] = this.dynamics[id];
        }

        this.dynamicSpritesContainer.add(dynamicSpriteContainer);

        // Move sprites further down the screen above ones further up.
        this.dynamicSpritesContainer.list.forEach((each) => {
            const otherDynamicSpriteContainer = each;
            otherDynamicSpriteContainer.z = otherDynamicSpriteContainer.y;
        });
    }

    /**
     * Remove the dynamic with the given ID from the game.
     * @param {Number|String} id
     */
    removeDynamic(id) {
        // Don't try to remove an entity that doesn't exist.
        if (this.dynamics[id] === undefined) {
            // console.log("skipping remove entity, doesn't exist:", id);
            return;
        }

        if (this.lightSources[id]) {
            delete this.lightSources[id];
            this.tilemap.updateDarknessGrid();
        }

        if (this.interactables[id]) {
            delete this.interactables[id];
        }

        this.dynamics[id].spriteContainer.destroy();

        delete this.dynamics[id];
    }

    /**
     * Check for and remove any dynamics that are outside of the player's view range.
     */
    checkDynamicsInViewRange() {
        const { dynamics } = this;
        const playerEntityID = this.player.entityId;
        let dynamicSpriteContainer;
        const playerRowTopViewRange = this.player.row - gameConfig.VIEW_RANGE;
        const playerColLeftViewRange = this.player.col - gameConfig.VIEW_RANGE;
        const playerRowBotViewRange = this.player.row + gameConfig.VIEW_RANGE;
        const playerColRightViewRange = this.player.col + gameConfig.VIEW_RANGE;

        Object.entries(dynamics).forEach(([key, dynamic]) => {
            dynamicSpriteContainer = dynamic.spriteContainer;

            // Skip the player entity's sprite.
            if (dynamic.id === playerEntityID) return;

            // Check if it is within the player view range.
            if (dynamic.row < playerRowTopViewRange
                || dynamic.row > playerRowBotViewRange
                || dynamic.col < playerColLeftViewRange
                || dynamic.col > playerColRightViewRange) {
                // Out of view range. Remove it.
                dynamicSpriteContainer.destroy();
                delete this.dynamics[key];
                if (dynamicSpriteContainer.lightDistance) {
                    delete this.lightSources[key];
                    this.tilemap.updateDarknessGrid();
                }
                return;
            }

            if (dynamicSpriteContainer.onMove) dynamicSpriteContainer.onMove();
        });
    }

    /**
     * Create a text chat message above the target entity.
     * @param {Number} [entityID] - The entity to make this chat appear from. If not given, uses this player.
     * @param {String} message
     * @param {String} [fillColour="#f5f5f5"]
     */
    chat(entityID, message, fillColour) {
        // console.log("chat");
        // Check an entity ID was given. If not, use this player.
        entityID = entityID || this.player.entityId;

        // Make sure the message is a string.
        message += "";

        const dynamic = this.dynamics[entityID];
        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const style = {
            fontFamily: "'Press Start 2P'",
            fontSize: 20,
            align: "center",
            fill: fillColour || "#f5f5f5",
            stroke: "#000000",
            strokeThickness: 4,
            wordWrap: {
                width: 400,
            },
        };

        // Check if the message was a command.
        if (message[0] === "/") {
            const command = message[1];
            // Remove the command part of the message.
            message = message.slice(2);
            // Check which command it is.
            if (command === "r") style.fill = "#ff7066";
            else if (command === "g") style.fill = "#73ff66";
            else if (command === "b") style.fill = "#66b3ff";
            else if (command === "y") style.fill = "#ffde66";
            // Invalid command.
            else {
                style.fill = "#ffa54f";
                // If the message was from this client, tell them a warning message.
                if (entityID === window.gameScene.player.entityId) {
                    message = Utils.getTextDef("Invalid command warning");
                }
                else { // Someone else's message, so don't show it.
                    return;
                }
            }
        }

        const chatText = window.gameScene.add.text(0, -12, message, style);
        // Add it to the dynamics group so that it will be affected by scales/transforms correctly.
        dynamic.spriteContainer.add(chatText);
        chatText.setOrigin(0.5);
        chatText.setScale(0.3);
        // Make the chat message scroll up.
        window.gameScene.tweens.add({
            targets: chatText,
            duration: gameConfig.CHAT_BASE_LIFESPAN + (60 * message.length),
            y: "-=30",
        });
        // How long the message should stay for.
        const duration = gameConfig.CHAT_BASE_LIFESPAN + (80 * message.length);
        // Destroy and remove from the list of chat messages when the lifespan is over.
        setTimeout(() => {
            chatText.destroy();
        }, duration);
    }
}

export default Game;
