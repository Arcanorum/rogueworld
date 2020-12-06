import EntityTypes from "../src/catalogues/EntityTypes"
import EntitiesList from "./EntitiesList";
import Tilemap from "./Tilemap"
import GUI from "./gui/GUI"
import Stats from "./Stats"
import Inventory from "./Inventory"
import CraftingManager from "./CraftingManager";
import Utils from "./Utils";
import BankManager from "./BankManager";
import ClanManager from "./ClanManager";
// import TextMetrics from "./TextMetrics";

dungeonz.EntityTypes = EntityTypes;
dungeonz.EntitiesList = EntitiesList;

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    init() {
        Utils.message("Game init");

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

        this.player = {
            /** @type {Boolean}
             * Whether the user is logged into an account. */
            isLoggedIn: data.isLoggedIn || false,
            entityId: data.player.id,
            row: data.player.row,
            col: data.player.col,
            displayName: data.player.displayName,
            maxHitPoints: data.player.maxHitPoints,
            maxEnergy: data.player.maxEnergy,
            defence: data.player.defence,
            hitPoints: data.player.maxHitPoints,
            energy: data.player.maxEnergy,
            glory: data.player.glory,
            inventory: new Inventory(data.inventory),
            bankManager: new BankManager(data.bankItems),
            stats: new Stats(data.player.stats),
            tasks: data.player.tasks,
            holdingItem: false
        };

        this.dynamicsData = data.dynamicsData;

        this.DayPhases = {
            Dawn: 1,
            Day: 2,
            Dusk: 3,
            Night: 4
        };

        // The Z depth of the various display containers, as set by .setDepth.
        this.renderOrder = {
            ground: 1,
            statics: 2,
            dynamics: 3,
            particles: 4,
            darkness: 5,
            borders: 6,
            fpsText: 7
        }

        this.dayPhase = data.dayPhase || this.DayPhases.Day;
        // this.dayPhase = this.DayPhases.Night;

        //console.log("nearby dynamics: data", this.dynamicsData);
    }

    create() {
        Utils.message("Game create");

        // Make this state globally accessible.
        window._this = this;

        // Setup animations for entity types that have them configured.
        Object.values(EntitiesList).forEach((EntityType) => {
            if (EntityType.setupAnimations) EntityType.setupAnimations();
            if (EntityType.addAnimationSet) EntityType.addAnimationSet();
        });

        // TextMetrics.init();

        // Hide the distracting background gif while the game is running.
        document.getElementById("background_img").style.visibility = "hidden";

        // Show the game itself.
        document.getElementById("game_cont").style.visibility = "visible";

        // Set the game container to be the thing that is fullscreened when fullscreen mode
        // is entered, instead of just the game canvas, or the GUI will be invisible.
        this.scale.fullScreenTarget = document.getElementById("game_cont");

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

        // A containert to put all dynamics into, so they stay on the same layer relative to other things in the display order.
        this.dynamicSpritesContainer = this.add.container();
        this.dynamicSpritesContainer.setDepth(this.renderOrder.dynamics);

        /**
         * A list of all light sources, used to update the darkness grid. Light sources can be static or dynamic.
         * @type {Object}
         */
        this.lightSources = {};

        this.clanManager = new ClanManager();
        this.GUI = new GUI(this);
        this.craftingManager = new CraftingManager();
        this.tilemap = new Tilemap(this);
        this.tilemap.loadMap(this.currentBoardName);

        // Make sure the inventory slots are showing the right items.
        for (let slotKey in _this.player.inventory) {
            if (_this.player.inventory.hasOwnProperty(slotKey) === false) continue;
            _this.player.inventory.swapInventorySlots(slotKey, slotKey);
        }

        // Load the bank items.
        const items = _this.player.bankManager.items;
        // Make sure the bank slots are showing the right items.
        for (let slotIndex = 0, len = items.length; slotIndex < len; slotIndex += 1) {
            // Skip empty items slots.
            if (items[slotIndex].catalogueEntry === null) continue;
            _this.player.bankManager.addItemToContents(slotIndex, items[slotIndex].catalogueEntry, items[slotIndex].durability, items[slotIndex].maxDurability);
        }
        // Hide the panel, as if any of the slots were filled with existing items, they will be shown.
        _this.GUI.bankPanel.hide();

        // Hide the shop panel, all of the slots are reset and empty ones won't be visible when first opened.
        _this.GUI.shopPanel.hide();

        // Load the tasks.
        const tasks = _this.player.tasks;
        for (let taskID in tasks) {
            if (tasks.hasOwnProperty(taskID) === false) continue;
            _this.GUI.tasksPanel.addTask(tasks[taskID]);
        }
        // Make sure the item icons are hidden. They aren't after being added at first.
        _this.GUI.tasksPanel.hide();

        // Update the starting value for the next level exp requirement, for the default shown stat info.
        _this.GUI.statsPanel.changeStatInfo(_this.player.stats.list.Melee);

        // Add the entities that are visible on start.
        for (let i = 0; i < this.dynamicsData.length; i += 1) {
            this.addEntity(this.dynamicsData[i]);
        }

        _this.GUI.accountPanel.hide();
        _this.GUI.createAccountPanel.hide();

        this.tilemap.updateDarknessGrid();

        // Flags for if a move key is held down, to allow continuous movement.
        this.moveUpIsDown = false;
        this.moveDownIsDown = false;
        this.moveLeftIsDown = false;
        this.moveRightIsDown = false;

        this.setupKeyboardControls();

        // Lock the camera to the player sprite.
        this.cameras.main.startFollow(this.dynamics[this.player.entityId].spriteContainer);

        window.addEventListener("mousedown", this.pointerDownHandler);

        // Add the websocket event responses after the game state is started.
        window.addGameStateEventResponses();

        this.fpsText = this.add.text(10, window.innerHeight - 30, "FPS:", {
            fontFamily: '"Courier"',
            fontSize: "24px",
            color: "#00ff00"
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
            scale: { min: GAME_SCALE * 0.8, max: GAME_SCALE * 1.2 },
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 },
            gravityY: 1000,
            on: false
        });

        damageParticles.setDepth(this.renderOrder.particles);

        this.sounds = {
            playerDeathLoop: this.sound.add("player-death-loop"),
            footsteps: [
                this.sound.add("footstep-1"),
                this.sound.add("footstep-2"),
                this.sound.add("footstep-3"),
                this.sound.add("footstep-4"),
            ],
            location: {
                generic: this.sound.add("generic-theme"),
            },
            item: {
                dropped: this.sound.add("item-dropped"),
            },
            dungeonKeyGained: this.sound.add("dungeon-key-gained"),
        };

        this.currentBackgroundMusic = this.sounds.item.dropped;
        this.changeBackgroundMusic(this.sounds.location.generic);
    }

    update() {
        if (this.nextMoveTime < Date.now()) {
            this.nextMoveTime = Date.now() + this.moveDelay;

            // Allow continuous movement if a move key is held down.
            if (this.moveUpIsDown === true) {
                this.checkCollidables("u");
                ws.sendEvent("mv_u");
            }
            if (this.moveDownIsDown === true) {
                this.checkCollidables("d");
                ws.sendEvent("mv_d");
            }
            if (this.moveLeftIsDown === true) {
                this.checkCollidables("l");
                ws.sendEvent("mv_l");
            }
            if (this.moveRightIsDown === true) {
                this.checkCollidables("r");
                ws.sendEvent("mv_r");
            }
        }

        // Show an FPS counter.
        if (window.devMode) {
            this.fpsText.setText("FPS:" + Math.floor(this.game.loop.actualFps));
        }
    }

    shutdown() {
        // Show the background GIF.
        document.getElementById("background_img").style.visibility = "visible";

        // Hide the game, or it still shows a blank canvas over the login screen.
        document.getElementById("game_cont").style.visibility = "hidden";

        // Remove the handler for keyboard events, so it doesn't try to do gameplay stuff while on the landing screen.
        document.removeEventListener("keydown", this.keyDownHandler);

        window.removeEventListener("mousedown", this.pointerDownHandler);

        // Remove some of the DOM GUI elements so they aren't stacked when the game state starts again.
        this.GUI.removeExistingDOMElements(this.GUI.hitPointCounters);
        this.GUI.removeExistingDOMElements(this.GUI.energyCounters);

        for (let elemKey in this.GUI.inventoryBar.slots) {
            this.GUI.inventoryBar.slots[elemKey].container.remove();
        }

        let contents = this.GUI.bankPanel.contents;
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
        ws.sendEvent("mv_" + direction);

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
        let
            key,
            interactable,
            playerNextRow = this.player.row,
            playerNextCol = this.player.col;

        if (direction === "u") playerNextRow -= 1;
        else if (direction === "d") playerNextRow += 1;
        else if (direction === "l") playerNextCol -= 1;
        else playerNextCol += 1;

        for (key in this.interactables) {
            if (this.interactables.hasOwnProperty(key) === false) continue;
            interactable = this.interactables[key];
            if (
                interactable.row === playerNextRow &&
                interactable.col === playerNextCol
            ) {
                // If it is a static, which is just a sprite.
                if (interactable.onMovedInto) {
                    interactable.onMovedInto();
                    return;
                }
                // If it is a dynamic, it has a sprite container.
                if (interactable.spriteContainer && interactable.spriteContainer.onMovedInto) {
                    interactable.spriteContainer.onMovedInto();
                    return;
                }
            }
        }
    }

    pointerDownHandler(event) {
        // Stop double clicking from highlighting text elements, and zooming in on mobile.
        //event.preventDefault();
        // Only use the selected item if the input wasn't over any other GUI element.
        if (event.target === _this.GUI.gameCanvas) {
            // If the user pressed on their character sprite, pick up item.
            if (Utils.pixelDistanceBetween(_this.dynamics[_this.player.entityId].spriteContainer.baseSprite, event) < 32) {
                ws.sendEvent("pick_up_item");
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
            else {
                if (targetY > 0) direction = "d";
                else direction = "u";
            }

            // Try to use the held item if one is selected.
            if (_this.player.holdingItem) {
                _this.player.inventory.useHeldItem(direction);
            }
            // Do a melee attack.
            else {
                ws.sendEvent("melee_attack", direction);
            }
        }
    }

    checkKeyFilters() {
        if (_this.GUI) {
            // Don't move while the chat input is open.
            if (_this.GUI.chatInput.isActive === true) return true;
            // Or the create account panel.
            if (_this.GUI.createAccountPanel.isOpen === true) return true;
            // Or the account panel.
            if (_this.GUI.accountPanel.isOpen === true) return true;
        }
        return false;
    }

    moveUpPressed() {
        if (_this.checkKeyFilters()) return;
        _this.move("u");
        _this.moveUpIsDown = true;
    }

    moveDownPressed() {
        if (_this.checkKeyFilters()) return;
        _this.move("d");
        _this.moveDownIsDown = true;
    }

    moveLeftPressed() {
        if (_this.checkKeyFilters()) return;
        _this.move("l");
        _this.moveLeftIsDown = true;
    }

    moveRightPressed() {
        if (_this.checkKeyFilters()) return;
        _this.move("r");
        _this.moveRightIsDown = true;
    }

    moveUpReleased() {
        _this.moveUpIsDown = false;
    }

    moveDownReleased() {
        _this.moveDownIsDown = false;
    }

    moveLeftReleased() {
        _this.moveLeftIsDown = false;
    }

    moveRightReleased() {
        _this.moveRightIsDown = false;
    }

    keyDownHandler(event) {
        if (_this.checkKeyFilters()) return;

        const key = event.key;

        // Get the 0 - 9 keys.
        if (key > -1
            && key < 10) {
            //console.log("num key pressed:", codeNumber);
            // Add the "slot" part of the key to the inventory slot number.
            _this.player.inventory.useItem("slot" + key);
        }

        if (event.code === "KeyE") {
            ws.sendEvent("pick_up_item");
        }
    }

    setupKeyboardControls() {
        // Add the handler for keyboard events.
        document.addEventListener("keydown", this.keyDownHandler);

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

                enterChat: Phaser.Input.Keyboard.KeyCodes.ENTER
            }
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
            Phaser.Input.Keyboard.KeyCodes.D
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
            if (this.player.hitPoints <= 0) {
                // Close the box. Can't chat while dead.
                this.GUI.chatInput.isActive = false;
                this.GUI.chatInput.style.visibility = "hidden";
                this.GUI.chatInput.value = "";
                return;
            }
            // Check if the chat input box is open.
            if (this.GUI.chatInput.isActive === true) {
                // Close the box, and submit the message.
                this.GUI.chatInput.isActive = false;
                this.GUI.chatInput.style.visibility = "hidden";

                // Don't bother sending empty messages.
                if (this.GUI.chatInput.value !== "") {
                    // Send the message to the server.
                    ws.sendEvent("chat", this.GUI.chatInput.value);

                    // Empty the contents ready for the next chat.
                    this.GUI.chatInput.value = "";
                }
            }
            // Not open, so open it.
            else {
                this.GUI.chatInput.isActive = true;
                this.GUI.chatInput.style.visibility = "visible";
                this.GUI.chatInput.focus();
            }
        });
    }

    changeBackgroundMusic(sound) {
        this.currentBackgroundMusic.stop();

        sound.play({
            loop: true,
        });

        this.currentBackgroundMusic = sound;

        // Fade playing the audio in.
        _this.tweens.add({
            targets: this.currentBackgroundMusic,
            volume: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 1;
                }
            },
            duration: 2000,
            ease: "Linear",
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
        if (_this.statics[data.row + "-" + data.col] === undefined) {
            // The static is not yet added to the grid. Wait a bit for the current player tween to
            // finish and the edge is loaded, by which point the static tile should have been added.
            setTimeout(this.tilemap.updateStaticTile.bind(this.tilemap), 500, data.row + "-" + data.col, false);
        }
        else {
            // Tile already exists/is in view. Make it look inactive.
            this.tilemap.updateStaticTile(data.row + "-" + data.col, false);
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
        const id = data.id;
        const typeNumber = data.typeNumber;
        const row = data.row;
        const col = data.col;

        //console.log("adding dynamic entity type:", typeNumber, "at row:", row, ", col:", col, ", config:", data);

        // Don't add another entity if the one with this ID already exists.
        if (this.dynamics[id] !== undefined) {
            //console.log("* * * * * skipping add entity, already exists:", id);
            return;
        }

        // Check that an entity type exists with the type name that corresponds to the given type number.
        if (EntitiesList[EntityTypes[typeNumber]] === undefined) {
            Utils.warning(`Invalid entity type number: "${typeNumber}". Entity types:`, EntityTypes);
            return;
        }

        // Add an object that represents this entity to the dynamics list.
        this.dynamics[id] = {
            id: id,
            row: row,
            col: col,
            spriteContainer: new EntitiesList[EntityTypes[typeNumber]](
                col * dungeonz.TILE_SIZE * GAME_SCALE,
                row * dungeonz.TILE_SIZE * GAME_SCALE,
                data)
        };

        const dynamicSpriteContainer = this.dynamics[id].spriteContainer;

        // Add the sprite to the world group, as it extends sprite but
        // overwrites the constructor so doesn't get added automatically.
        // _this.add.existing(dynamicSpriteContainer);

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
        this.dynamicSpritesContainer.list.forEach((dynamicSpriteContainer) => {
            dynamicSpriteContainer.z = dynamicSpriteContainer.y;
        });
    }

    /**
     * Remove the dynamic with the given ID from the game.
     * @param {Number|String} id
     */
    removeDynamic(id) {
        // Don't try to remove an entity that doesn't exist.
        if (this.dynamics[id] === undefined) {
            //console.log("skipping remove entity, doesn't exist:", id);
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
        const dynamics = this.dynamics,
            playerEntityID = this.player.entityId;
        let dynamic;
        let dynamicSpriteContainer;
        let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
        let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
        let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
        let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

        for (let key in dynamics) {

            if (dynamics.hasOwnProperty(key) === false) continue;

            dynamic = dynamics[key];
            dynamicSpriteContainer = dynamic.spriteContainer;

            // Skip the player entity's sprite.
            if (dynamic.id === playerEntityID) continue;

            // Check if it is within the player view range.
            if (dynamic.row < playerRowTopViewRange ||
                dynamic.row > playerRowBotViewRange ||
                dynamic.col < playerColLeftViewRange ||
                dynamic.col > playerColRightViewRange) {
                // Out of view range. Remove it.
                dynamicSpriteContainer.destroy();
                delete this.dynamics[key];
                if (dynamicSpriteContainer.lightDistance) {
                    delete this.lightSources[key];
                    this.tilemap.updateDarknessGrid();
                }
                continue;
            }

            if (dynamicSpriteContainer.onMove) dynamicSpriteContainer.onMove();
        }
    }

    /**
     * Create a text chat message above the target entity.
     * @param {Number} [entityID] - The entity to make this chat appear from. If not given, uses this player.
     * @param {String} message
     * @param {String} [fillColour="#f5f5f5"]
     */
    chat(entityID, message, fillColour) {
        //console.log("chat");
        // Check an entity ID was given. If not, use this player.
        entityID = entityID || _this.player.entityId;

        // Make sure the message is a string.
        message = message + "";

        let dynamic = _this.dynamics[entityID];
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
                if (entityID === _this.player.entityId) {
                    message = dungeonz.getTextDef("Invalid command warning");
                }
                // Someone else's message, so don't show it.
                else {
                    return;
                }
            }
        }

        const chatText = _this.add.text(0, -12, message, style);
        // Add it to the dynamics group so that it will be affected by scales/transforms correctly.
        dynamic.spriteContainer.add(chatText);
        chatText.setOrigin(0.5);
        chatText.setScale(0.3);
        // Make the chat message scroll up.
        _this.tweens.add({
            targets: chatText,
            duration: dungeonz.CHAT_BASE_LIFESPAN + (60 * message.length),
            y: "-=30"
        });
        // How long the message should stay for.
        const duration = dungeonz.CHAT_BASE_LIFESPAN + (80 * message.length);
        // Destroy and remove from the list of chat messages when the lifespan is over.
        setTimeout(() => {
            chatText.destroy();
        }, duration);
    }
}

dungeonz.Game = Game;