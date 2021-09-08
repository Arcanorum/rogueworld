import Phaser from "phaser";
import PubSub from "pubsub-js";
import { DUNGEON_PORTAL_PRESSED } from "../shared/EventTypes";
import gameConfig from "../shared/GameConfig";
import dungeonz from "../shared/Global";
import {
    ApplicationState, GUIState, InventoryState, PlayerState,
} from "../shared/state/States";
import anvilIcon from "../assets/images/gui/panels/crafting/anvil.png";
import furnaceIcon from "../assets/images/gui/panels/crafting/furnace.png";
import workbenchIcon from "../assets/images/gui/panels/crafting/workbench.png";
import laboratoryIcon from "../assets/images/gui/panels/crafting/laboratory.png";
import gloryAltarIcon from "../assets/images/gui/panels/crafting/glory-altar.png";
import Utils from "../shared/Utils";
import Panels from "../components/game/gui/panels/PanelsEnum";
import {
    setAttackCursor,
    setDefaultCursor,
    setHandCursor,
    setHatchetCursor,
    setPickaxeCursor,
    setSickleCursor,
} from "../shared/Cursors";
import ItemTypes from "../catalogues/ItemTypes.json";

/**
 * The frame to show when a static is broken. Pile of rubble.
 * @type {Number}
 */
// const brokenFrame = 144; TODO: maybe not relevant anymore? still doing breakable world statics?

/**
 * The frames to use for each interactable type when it is inactive.
 * @type {Object}
 */
const TileIDInactiveFrames = {
    0: 5, // The empty frame.
    11: 40,

    147: 148, // Dungeon portal
    211: 212, // Overworld portal

    1235: 1236, // Pine tree (light)
    1299: 1300, // Pine tree (dark)
    1363: 1364, // Pine tree (snow)
    1427: 1428, // Willow tree (light)
    1491: 1492, // Willow tree (dark)
    1555: 1556, // Palm tree
    1619: 1620, // Oak tree (light)
    1683: 1684, // Oak tree (dark)
    1747: 1748, // Oak tree (snow)

    1237: 1238, // Cotton
    1301: 1302, // Cactus
    1365: 1366, // Red mushroom
    1429: 1430, // Green mushroom
    1493: 1494, // Blue mushroom
    1557: 1558, // Frost mushroom
    1241: 1242, // Clay ore
    1305: 1242, // Iron ore
    1369: 1242, // Dungium ore
    1433: 1242, // Noctis ore
    1497: 1242, // Agonite ore

    2324: 2325, // Counter flap

    2767: 2766, // Wood door
    2768: 2766, // Wood door padlocked
    2769: 2766, // Wood door locked red
    2770: 2766, // Wood door locked green
    2771: 2766, // Wood door locked blue
    2772: 2766, // Wood door locked yellow
    2773: 2766, // Wood door locked brown
    2831: 2830, // Metal door
    2832: 2830, // Metal door padlocked
    2833: 2830, // Metal door locked red
    2834: 2830, // Metal door locked green
    2835: 2830, // Metal door locked blue
    2836: 2830, // Metal door locked yellow
    2837: 2830, // Metal door locked brown
    2894: 2766, // Door locked fighter
    2895: 2766, // Door locked pit
};

class Static extends Phaser.GameObjects.Container {
    constructor(config) {
        super(
            dungeonz.gameScene,
            config.col * gameConfig.SCALED_TILE_SIZE,
            config.row * gameConfig.SCALED_TILE_SIZE,
        );

        // Add them to the scene here as this doesn't happen automatically when extending a gameobject class.
        dungeonz.gameScene.add.existing(this);

        // The world position of this tile. NOT where it is in any display grids; it doesn't need updating.
        this.row = config.row;
        this.col = config.col;

        // The unique ID of this tile. Used to get and update a static tile from the statics
        // list, such as when a door opens/closes and thus the frame needs to change.
        this.id = `${this.row}-${this.col}`;

        this.addTileSprite(config.tileID);

        if (config.pressableRange) {
            this.pressableRange = config.pressableRange;

            this.showHighlightRange = config.showHighlightRange || 3;

            this.addHighlightSprite();

            this.tileSprite.setInteractive();

            this.tileSprite.on("pointerdown", this.onPressed, this);

            this.tileSprite.on("pointerover", this.onPointerOver, this);

            this.tileSprite.on("pointerout", this.onPointerOut, this);

            dungeonz.gameScene.interactables[this.id] = this;
        }

        this.setScale(gameConfig.GAME_SCALE);

        // Holder for the light distance property. Tilemap.updateDarknessGrid passes it in as a property of a sprite...
        this.spriteContainer = {};
        /** @type {Number} Does this static emit light. 0 = disabled */
        this.spriteContainer.lightDistance = 0;

        /** @type {Number} The frame on the statics tileset to use when this static is active. */
        this.tileID = config.tileID;
        /** @type {Number} The frame on the statics tileset to use when this static is inactive. */
        this.inactiveFrame = 0;

        if (TileIDInactiveFrames[this.tileID] === undefined) {
            this.inactiveFrame = TileIDInactiveFrames["0"];
        }
        else {
            this.inactiveFrame = TileIDInactiveFrames[this.tileID];
        }

        // Add this static to the statics list.
        if (dungeonz.gameScene.statics[this.id] === undefined) {
            dungeonz.gameScene.statics[this.id] = this;
        }

        this.on("destroy", () => {
            delete dungeonz.gameScene.statics[this.id];

            // If this was a light source, need to update the darkness grid.
            if (dungeonz.gameScene.lightSources[this.id]) {
                delete dungeonz.gameScene.lightSources[this.id];
                dungeonz.gameScene.tilemap.updateDarknessGrid();
            }

            // If this was a light source, need to update the darkness grid.
            if (dungeonz.gameScene.interactables[this.id]) {
                delete dungeonz.gameScene.interactables[this.id];
            }
        });
    }

    addTileSprite(frame) {
        this.tileSprite = dungeonz.gameScene.add.sprite(0, 0, "statics-tileset", frame);
        this.tileSprite.setOrigin(0.5);
        this.add(this.tileSprite);
    }

    addHighlightSprite() {
        this.highlightSprite = dungeonz.gameScene.add.sprite(0, 0, "highlight");
        this.highlightSprite.setOrigin(0.5);
        this.highlightSprite.setVisible(false);
        this.add(this.highlightSprite);
    }

    // eslint-disable-next-line
    onMovedInto() { }

    // eslint-disable-next-line
    onPressed() { }

    onPointerOver() {
        if (this.isWithinPressableRange()) {
            // Check if a specific cursor should be shown. i.e. hatchet cursor for trees.
            if (this.setCursorFunction) {
                this.setCursorFunction();
            }
            else {
                setHandCursor();
            }
        }
    }

    onPointerOut() {
        if (InventoryState.holding) {
            setAttackCursor();
        }
        else {
            setDefaultCursor();
        }
    }

    /**
     * Flips a tile between it's active or inactive frame.
     * @param {Boolean} active
     */
    swapFrame(active) {
        if (active === true) {
            this.tileSprite.setFrame(this.tileID);
        }
        else {
            this.tileSprite.setFrame(this.inactiveFrame);
        }
    }

    shouldShowHighlight() {
        const playerDynamic = dungeonz.gameScene.dynamics[PlayerState.entityID];

        const distFromPlayer = Utils.tileDistanceBetween(this, playerDynamic);

        if (distFromPlayer <= this.showHighlightRange) {
            if (!this.highlightSprite.visible) {
                this.highlightSprite.setVisible(true);
            }

            if (this.isWithinPressableRange()) {
                this.highlightSprite.setAlpha(1);
                this.highlightSprite.setScale(1.2);
            }
            else {
                this.highlightSprite.setAlpha(0.6);
                this.highlightSprite.setScale(1);
            }
        }
        else if (this.highlightSprite.visible) {
            this.highlightSprite.setVisible(false);
        }
    }

    isWithinPressableRange() {
        const player = dungeonz.gameScene.dynamics[PlayerState.entityID];
        return Utils.tileDistanceBetween(this, player) <= this.pressableRange;
    }

    // eslint-disable-next-line
    activate() { }

    // eslint-disable-next-line
    deactivate() { }
}

/**
 * A list of the GUI triggers by trigger name. Multiple GUI trigger entities can have the same name, to group them.
 * i.e. "crafting-tutorial" has many GUI trigger
 * @type {{}}
 */
// const GUITriggers = {};

// TODO: make this a purely logical entity.
// class GUITrigger extends Static {
//     constructor(row, col, tileID, data) {
//         super(row, col, tileID, data);

//         this.triggerName = data.name;
//         this.panelNameTextDefID = data.panelNameTextDefID;
//         this.contentTextDefID = data.contentTextDefID;
//         this.contentFileName = data.contentFileName;
//         this.panel = dungeonz.gameScene.GUI[data.panelName];
//         // Don't show the yellow square.
//         this.tileID = 0;

//         if (this.panel === undefined) {
//             console.log("WARNING: Trigger cannot open invalid GUI panel:", data.panelName);
//         }

//         if (GUITriggers[this.triggerName] === undefined) {
//             GUITriggers[this.triggerName] = {};
//         }

//         GUITriggers[this.triggerName][this.id] = this;
//     }

//     static removeTriggerGroup(triggerName) {
//         const triggerGroup = GUITriggers[triggerName];
//         // Remove all of the other triggers in this group.
//         for (let triggerKey in triggerGroup) {
//             if (triggerGroup.hasOwnProperty(triggerKey) === false) continue;
//             triggerGroup[triggerKey].destroy();
//         }
//         // Remove the group.
//         delete GUITriggers[triggerName];
//     }

//     destroy() {
//         delete GUITriggers[this.triggerName][this.id];

//         super.destroy();
//     }

//     onMovedInto() {
//         // Check the panel is valid. Might have been given the wrong panel name.
//         if (this.panel !== undefined) {
//             // Show the GUI panel this trigger opens.
//             this.panel.show(this.panelNameTextDefID, this.contentTextDefID, this.contentFileName);
//         }

//         // Remove this trigger and the group it is in.
//         GUITrigger.removeTriggerGroup(this.triggerName);
//     }
// }

class Portal extends Static {
    constructor(config) {
        super(config);
        this.spriteContainer.lightDistance = 5;
    }
}

class DungeonPortal extends Portal {
    constructor(config) {
        config.pressableRange = 1;
        super(config);
        /**
         * The ID number of the dungeon manager that this portal is linked to.
         * Each dungeon manager has a unique id, as well as a separate unique name.
         * @type {Number}
         */
        this.dungeonManagerID = config.data;
    }

    onPressed() {
        if (!this.isWithinPressableRange()) return;
        // Prevent opening the crafting panel when a station is clicked on behind and already open panel.
        if (GUIState.activePanel !== Panels.NONE) {
            // Except chat panel.
            if (GUIState.activePanel !== Panels.Chat) return;
        }

        PubSub.publish(DUNGEON_PORTAL_PRESSED, this);
    }
}

class Torch extends Static {
    constructor(config) {
        super(config);
        this.spriteContainer.lightDistance = 4;
    }
}

class CraftingStation extends Static {
    constructor(config) {
        config.pressableRange = 1;
        super(config);

        this.stationTypeNumber = config.data;
    }

    onPressed() {
        if (!this.isWithinPressableRange()) return;
        // Prevent opening the crafting panel when a station is clicked on behind and already open panel.
        if (GUIState.activePanel !== Panels.NONE) {
            // Except chat panel.
            if (GUIState.activePanel !== Panels.Chat) return;
        }

        GUIState.setCraftingStation(
            this.stationTypeNumber,
            this.name,
            this.icon,
        );
        GUIState.setActivePanel(Panels.Crafting);
    }
}

class Anvil extends CraftingStation {
    constructor(config) {
        super(config);
        this.name = Utils.getTextDef("Anvil");
        this.icon = anvilIcon;
    }
}

class Furnace extends CraftingStation {
    constructor(config) {
        super(config);
        this.spriteContainer.lightDistance = 4;
        this.name = Utils.getTextDef("Furnace");
        this.icon = furnaceIcon;
    }
}

class Laboratory extends CraftingStation {
    constructor(config) {
        super(config);
        this.name = Utils.getTextDef("Laboratory");
        this.icon = laboratoryIcon;
    }
}

class Workbench extends CraftingStation {
    constructor(config) {
        super(config);
        this.name = Utils.getTextDef("Workbench");
        this.icon = workbenchIcon;
    }
}

class GloryAltar extends CraftingStation {
    constructor(config) {
        super(config);
        this.name = Utils.getTextDef("Glory altar");
        this.icon = gloryAltarIcon;
    }
}

class ResourceNode extends Static {
    constructor(config) {
        config.pressableRange = 1;
        config.showHighlightRange = 2;
        super(config);

        // Add a timer bar.
        this.timerBar = dungeonz.gameScene.add.sprite(-6, 0, "action-progress-bar");
        this.timerBar.setOrigin(0, 0.5);
        this.timerBar.setVisible(false);
        this.add(this.timerBar);

        this.timerBarTween = null;

        this.timerBorder = dungeonz.gameScene.add.sprite(0, 0, "action-progress-border");
        this.timerBorder.setOrigin(0.5);
        this.timerBorder.setVisible(false);
        this.add(this.timerBorder);
    }

    swapFrame(active) {
        this.timerBar.setVisible(false);
        this.timerBorder.setVisible(false);

        super.swapFrame(active);
    }

    onPressed() {
        // Check the player is within gather range of this node.
        const playerDynamic = dungeonz.gameScene.dynamics[PlayerState.entityID];
        if (Utils.tileDistanceBetween(this, playerDynamic) > 1) return;

        if (this.isToolRequired) {
            // Check they are holding the correct category of tool.
            if (!InventoryState.holding) return;

            if (ItemTypes[InventoryState.holding.typeCode].category !== this.toolCategory) return;
        }

        const eventData = {
            row: this.row,
            col: this.col,
        };

        // If they are holding a tool of the correct category, send it too.
        if (
            InventoryState.holding
            && (ItemTypes[InventoryState.holding.typeCode].category === this.toolCategory)
        ) {
            eventData.itemUsedIndex = InventoryState.holding.slotIndex;
        }

        // Tell the server this player wants to gather from this node.
        ApplicationState.connection.sendEvent("start_tile_action", eventData);
    }

    onPointerOver() {
        if (
            InventoryState.holding
            && ItemTypes[InventoryState.holding.typeCode].category === this.toolCategory
        ) {
            this.setCursorFunction = this.toolCursorFunction;
        }
        else if (this.isToolRequired) {
            this.setCursorFunction = setDefaultCursor;

            if (this.isWithinPressableRange()) {
                const playerDynamic = dungeonz.gameScene.dynamics[PlayerState.entityID];
                playerDynamic.spriteContainer.warningText.setText(Utils.getTextDef("Pickaxe needed"));
                playerDynamic.spriteContainer.warningText.setVisible(true);
            }
        }
        // The resource node can be gathered from without a tool (i.e. punch trees).
        else {
            this.setCursorFunction = setHandCursor;
        }

        super.onPointerOver();
    }

    onPointerOut() {
        const playerDynamic = dungeonz.gameScene.dynamics[PlayerState.entityID];
        playerDynamic.spriteContainer.warningText.setVisible(false);

        super.onPointerOut();
    }

    startTimer(gatherTime) {
        if (!this.timerBar.visible) {
            this.timerBar.setVisible(true);
            this.timerBorder.setVisible(true);
        }
        if (this.timerBarTween) this.timerBarTween.stop();

        this.timerBar.scaleX = 0;

        this.timerBarTween = dungeonz.gameScene.tweens.add({
            targets: this.timerBar,
            scaleX: 1,
            ease: "Linear",
            duration: gatherTime || 1000,
        });
    }

    hideTimer() {
        if (this.timerBar.visible) {
            this.timerBar.setVisible(false);
            this.timerBorder.setVisible(false);
        }
        if (this.timerBarTween) this.timerBarTween.stop();
    }
}
ResourceNode.prototype.toolCursorFunction = setHandCursor;
ResourceNode.prototype.toolCategory = null;
ResourceNode.prototype.isToolRequired = false;

class Tree extends ResourceNode {}
Tree.prototype.toolCursorFunction = setHatchetCursor;
Tree.prototype.toolCategory = "Hatchet";

class OreRock extends ResourceNode {}
OreRock.prototype.toolCursorFunction = setPickaxeCursor;
OreRock.prototype.toolCategory = "Pickaxe";
OreRock.prototype.isToolRequired = true;

class Mushroom extends ResourceNode {}
Mushroom.prototype.toolCursorFunction = setSickleCursor;
Mushroom.prototype.toolCategory = "Sickle";

class BankChest extends Static {
    constructor(config) {
        config.pressableRange = 1;
        super(config);
    }

    onPressed() {
        if (!this.isWithinPressableRange()) return;
        // Prevent opening the crafting panel when a station is clicked on behind and already open panel.
        if (GUIState.activePanel !== Panels.NONE) {
            // Except chat panel.
            if (GUIState.activePanel !== Panels.Chat) return;
        }

        GUIState.setActivePanel(Panels.Bank);
    }
}

class Register extends Static {
    constructor(config) {
        config.pressableRange = 1;
        super(config);
    }

    onPressed() {
        if (!this.isWithinPressableRange()) return;
        // Prevent opening the crafting panel when a station is clicked on behind and already open panel.
        if (GUIState.activePanel !== Panels.NONE) {
            // Except chat panel.
            if (GUIState.activePanel !== Panels.Chat) return;
        }

        GUIState.setActivePanel(Panels.ChangeName);
    }
}

/**
 * A list of valid statics and the classes to be used when creating each static.
 * @type {Object}
 */
const StaticClasses = {
    // 86: GUITrigger,
    147: DungeonPortal, // Dungeon portal (active)
    211: Portal, // Overworld portal (active)

    1235: Tree, // Pine tree (light)
    1299: Tree, // Pine tree (dark)
    1363: Tree, // Pine tree (snow)
    1427: Tree, // Willow tree (light)
    1491: Tree, // Willow tree (dark)
    1555: Tree, // Palm tree
    1619: Tree, // Oak tree (light)
    1683: Tree, // Oak tree (dark)
    1747: Tree, // Oak tree (snow)

    1305: OreRock, // Iron ore
    1369: OreRock, // Dungium ore
    1433: OreRock, // Noctis ore
    1497: OreRock, // Agonite ore

    1237: ResourceNode, // Cotton
    // 1301: ResourceNode, // Cactus
    1365: Mushroom, // Red mushroom
    1429: Mushroom, // Green mushroom
    1493: Mushroom, // Blue mushroom
    1557: Mushroom, // Frost mushroom

    // Light wall torches
    2183: Torch,
    2184: Torch,
    2185: Torch,
    2186: Torch,
    2187: Torch,
    2188: Torch,
    2247: Torch,
    2248: Torch,
    2250: Torch,
    2251: Torch,
    2252: Torch,
    2311: Torch,
    2313: Torch,
    2315: Torch,
    // Dark wall torches
    2375: Torch,
    2376: Torch,
    2377: Torch,
    2378: Torch,
    2379: Torch,
    2380: Torch,
    2439: Torch,
    2440: Torch,
    2442: Torch,
    2443: Torch,
    2444: Torch,
    2503: Torch,
    2505: Torch,
    2507: Torch,
    // Sand wall torches
    2567: Torch,
    2568: Torch,
    2569: Torch,
    2570: Torch,
    2571: Torch,
    2572: Torch,
    2631: Torch,
    2632: Torch,
    2634: Torch,
    2635: Torch,
    2636: Torch,
    2695: Torch,
    2697: Torch,
    2699: Torch,
    // Snow wall torches
    2759: Torch,
    2760: Torch,
    2761: Torch,
    2762: Torch,
    2763: Torch,
    2764: Torch,
    2823: Torch,
    2824: Torch,
    2826: Torch,
    2827: Torch,
    2828: Torch,
    2887: Torch,
    2889: Torch,
    2891: Torch,
    // Light wood torches
    2951: Torch,
    2952: Torch,
    2953: Torch,
    2954: Torch,
    2955: Torch,
    2956: Torch,
    3015: Torch,
    3016: Torch,
    3019: Torch,
    3079: Torch,
    3081: Torch,
    // Medium wood torches
    3143: Torch,
    3144: Torch,
    3145: Torch,
    3146: Torch,
    3147: Torch,
    3148: Torch,
    3207: Torch,
    3208: Torch,
    3211: Torch,
    3271: Torch,
    3273: Torch,
    // Dark wood torches
    3335: Torch,
    3336: Torch,
    3337: Torch,
    3338: Torch,
    3339: Torch,
    3340: Torch,
    3399: Torch,
    3400: Torch,
    3403: Torch,
    3463: Torch,
    3465: Torch,

    3022: Anvil,
    3023: Furnace,
    3024: Workbench,
    3025: Laboratory,
    // 3026: StorageBox,
    3027: BankChest,
    3028: Register,
    3086: GloryAltar,
};

/**
 * Add a static tile instance to the statics list and add a sprite for it.
 * @param {Number} row
 * @param {Number} col
 * @param {Array} tileData - The tile ID to use from the tilset, and any data for this static.
 */
function addStaticTile(row, col, tileData) {
    // If there is no specific class to use for this static tile, use the generic one.
    if (StaticClasses[tileData[0]] === undefined) {
        return new Static({
            row,
            col,
            tileID: tileData[0],
            data: tileData[1],
        });
    }
    // Use the specific class.

    const staticTile = new StaticClasses[tileData[0]]({
        row,
        col,
        tileID: tileData[0],
        data: tileData[1],
    });
        // If this static type emits light, add it to the light sources list.
    if (staticTile.spriteContainer.lightDistance > 0) {
        dungeonz.gameScene.lightSources[staticTile.id] = staticTile;
        dungeonz.gameScene.tilemap.updateDarknessGrid();
    }

    return staticTile;
}

export default addStaticTile;
