import { setHandCursor, setPreviousCursor } from "./Cursors";

class Static extends Phaser.GameObjects.Container {
    constructor(config) {
        super(_this, config.col * dungeonz.SCALED_TILE_SIZE, config.row * dungeonz.SCALED_TILE_SIZE);

        // Add them to the scene here as this doesn't happen automatically when extending a gameobject class.
        _this.add.existing(this);

        // The world position of this tile. NOT where it is in any display grids; it doesn't need updating.
        this.row = config.row;
        this.col = config.col;

        // The unique ID of this tile. Used to get and update a static tile from the statics
        // list, such as when a door opens/closes and thus the frame needs to change.
        this.id = this.row + "-" + this.col;

        this.addTileSprite(config.tileID);

        if (config.pressableRange) {
            this.pressableRange = config.pressableRange;

            this.addHighlightSprite();

            this.tileSprite.setInteractive();

            this.tileSprite.on("pointerdown", this.onPressed, this);

            this.tileSprite.on("pointerover", () => {
                if (this.isWithinPressableRange()) {
                    setHandCursor();
                }
            });

            this.tileSprite.on("pointerout", () => {
                setPreviousCursor();
            });

            _this.interactables[this.id] = this;
        }

        this.setScale(GAME_SCALE);

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
        if (_this.statics[this.id] === undefined) {
            _this.statics[this.id] = this;
        }

        this.on("destroy", () => {
            delete _this.statics[this.id];

            // If this was a light source, need to update the darkness grid.
            if (_this.lightSources[this.id]) {
                delete _this.lightSources[this.id];
                _this.tilemap.updateDarknessGrid();
            }

            // If this was a light source, need to update the darkness grid.
            if (_this.interactables[this.id]) {
                delete _this.interactables[this.id];
            }
        });
    }

    addTileSprite(frame) {
        this.tileSprite = _this.add.sprite(0, 0, "statics-tileset", frame);
        this.tileSprite.setOrigin(0.5);
        this.add(this.tileSprite);
    }

    addHighlightSprite() {
        this.highlightSprite = _this.add.sprite(0, 0, "highlight");
        this.highlightSprite.setOrigin(0.5);
        this.highlightSprite.setVisible(false);
        this.add(this.highlightSprite);
    }

    onMovedInto() { }

    onPressed() { }

    isWithinPressableRange() {
        const player = _this.dynamics[_this.player.entityId];
        const distFromPlayer =
            Math.abs(this.row - player.row) + // Row dist.
            Math.abs(this.col - player.col); // Col dist.

        return distFromPlayer <= this.pressableRange;
    }

    activate() { }

    deactivate() { }
};

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
//         this.panel = _this.GUI[data.panelName];
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
        if (this.isWithinPressableRange()) {
            _this.GUI.dungeonPanel.show(this);
        }
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
}

class Anvil extends CraftingStation {
    onPressed() {
        if (this.isWithinPressableRange()) {
            _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
            _this.GUI.craftingPanel.show(dungeonz.getTextDef("Anvil"), "assets/img/gui/panels/anvil.png");
        }
    }
}

class Furnace extends CraftingStation {
    constructor(config) {
        super(config);
        this.spriteContainer.lightDistance = 4;
    }

    onPressed() {
        if (this.isWithinPressableRange()) {
            _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
            _this.GUI.craftingPanel.show(dungeonz.getTextDef("Furnace"), "assets/img/gui/panels/furnace.png");
        }
    }
}

class Laboratory extends CraftingStation {
    onPressed() {
        if (this.isWithinPressableRange()) {
            _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
            _this.GUI.craftingPanel.show(dungeonz.getTextDef("Laboratory"), "assets/img/gui/panels/laboratory.png");
        }
    }
}

class Workbench extends CraftingStation {
    onPressed() {
        if (this.isWithinPressableRange()) {
            _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
            _this.GUI.craftingPanel.show(dungeonz.getTextDef("Workbench"), "assets/img/gui/panels/workbench.png");
        }
    }
}

class BankChest extends Static {
    constructor(config) {
        config.pressableRange = 1;
        super(config);
    }

    onPressed() {
        if (this.isWithinPressableRange()) {
            _this.GUI.bankPanel.show();
        }
    }
}

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
    0: 5,       // The empty frame.
    11: 40,

    147: 148,   // Dungeon portal
    211: 212,   // Overworld portal

    1235: 1236, // Oak tree
    1299: 1300, // Spruce tree
    1363: 1364, // Fir tree
    1427: 1428, // Mangrove tree
    1491: 1492, // Egaso tree
    1555: 1556, // Palm tree
    1237: 1238, // Cotton
    1301: 1302, // Cactus
    1365: 1366, // Red mushroom
    1429: 1430, // Green mushroom
    1493: 1494, // Blue mushroom
    1241: 1242, // Clay ore
    1305: 1242, // Iron ore
    1369: 1242, // Dungium ore
    1433: 1242, // Noctis ore

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

/**
 * A list of valid statics and the classes to be used when creating each.
 * @type {Object}
 */
const StaticClasses = {
    // 86: GUITrigger,
    147: DungeonPortal, // Dungeon portal (active)
    211: Portal,    // Overworld portal (active)
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
    //3026: StorageBox,
    3027: BankChest,

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
            data: tileData[1]
        });
    }
    // Use the specific class.
    else {
        const staticTile = new StaticClasses[tileData[0]]({
            row,
            col,
            tileID: tileData[0],
            data: tileData[1]
        });
        // If this static type emits light, add it to the light sources list.
        if (staticTile.spriteContainer.lightDistance > 0) {
            _this.lightSources[staticTile.id] = staticTile;
            _this.tilemap.updateDarknessGrid();
        }

        return staticTile;
    }
}

export default addStaticTile;