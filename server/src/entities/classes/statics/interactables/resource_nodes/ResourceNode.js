const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const EntitiesList = require("../../../../EntitiesList");
const ItemsList = require("../../../../../items/ItemsList");
const Utils = require("../../../../../Utils");
const Interactable = require("../Interactable");
const TaskTypes = require("../../../../../tasks/TaskTypes");

class ResourceNode extends Interactable {
    /**
     *
     * @param {Player} interactedBy
     * @param {Item} toolUsed - The tool used by the player on this node, such as a hatchet or pickaxe.
     */
    startGathering(interactedBy, toolUsed) {
        // Don't do anything to this node if it has no resource available.
        if (this.activeState === false) return;

        // Check the player is actually next to this node.
        if (!interactedBy.isAdjacentToEntity(this)) return;

        // Don't do anything if this resource node doesn't give an item (for whatever reason).
        if (this.ItemType === null) return;

        // Don't do anything if the character doesn't have enough energy to interact with this node.
        if (interactedBy.energy < this.interactionEnergyCost) return;

        if (this.isToolRequired) {
            // Don't do anything if no tool was used.
            if (!toolUsed) return;

            // Don't do anything to this node if the tool used is of the wrong category.
            if (toolUsed.category !== this.toolCategory) return;

            // Pass the tool along so any gathering time reductions from the item can be applied.
            interactedBy.startGatheringFromResourceNode(this, toolUsed);

            // Reduce the durability of the tool used.
            toolUsed.onUsed();
        }
        // No tool required, but they may have used one anyway for a gathering time reduction.
        // Only send the tool along if it is of the correct category, otherwise the reduction might be applied from the wrong one.
        // i.e. sending a pickaxe to reduce the gather time for a tree.
        else if (toolUsed && (toolUsed.category === this.toolCategory)) {
            // Pass the tool along so any gathering time reductions from the item can be applied.
            interactedBy.startGatheringFromResourceNode(this, toolUsed);

            // Reduce the durability of the tool used.
            toolUsed.onUsed();
        }
        else {
            // Start gathering without a tool.
            interactedBy.startGatheringFromResourceNode(this);
        }

        // Reduce their energy by the interaction cost.
        interactedBy.modEnergy(-this.interactionEnergyCost);

        // Alert any mobs that guard this type of resource node.
        if (this.guardedByMobTypes) {
            const tiles = this.board.getTilesInEntityRange(this, this.guardedRange);

            tiles.forEach((tile) => {
                Object.values(tile.destroyables).forEach((destroyable) => {
                    this.guardedByMobTypes.forEach((MobType) => {
                        if (destroyable instanceof MobType) {
                            // Don't bother if they are already targetting something.
                            if (destroyable.target) return;

                            destroyable.target = interactedBy;
                        }
                    });
                });
            });
        }
    }

    static createClasses() {
        try {
            // Load all of the resource node configs.
            const configs = yaml.safeLoad(
                fs.readFileSync(
                    path.resolve("./src/configs/ResourceNodes.yml"), "utf8",
                ),
            );

            configs.forEach((config) => {
                // Only generate a class for this entity if one doesn't already
                // exist, as it might have it's own special logic file.
                if (!EntitiesList[config.name]) {
                    // Use the base ResourceNode class to extend from.
                    class GenericResourceNode extends ResourceNode { }

                    EntitiesList[config.name] = GenericResourceNode;
                }
            });
        }
        catch (error) {
            Utils.error(error);
        }
    }

    static loadConfigs() {
        try {
            const resNodeConfigs = yaml.safeLoad(
                fs.readFileSync(
                    path.resolve("./src/configs/ResourceNodes.yml"), "utf8",
                ),
            );

            resNodeConfigs.forEach((config) => {
                const EntityType = EntitiesList[config.name];
                // Check the resource node entity type is valid.
                if (!EntityType) {
                    Utils.error("Invalid resource node config. Entity type of name not found:", config);
                }

                Object.entries(config).forEach(([key, value]) => {
                    // Needs to be converted from just the ids into actual task type references.
                    if (key === "gatheringTask") {
                        const taskId = `Gather${value}`;
                        // Check the task type is valid.
                        if (!TaskTypes[taskId]) {
                            Utils.error("Invalid gather task name. Check it is in the task types list:", config);
                        }

                        // Set own property for this item type, to prevent pushing into the parent (Item class) one.
                        EntityType.prototype.gatherTaskId = taskId;

                        return;
                    }

                    if (key === "itemName") {
                        if (!ItemsList.BY_NAME[value]) {
                            Utils.error("Invalid resource item name. Check it is in the item types list:", config);
                        }

                        EntityType.prototype.ItemType = ItemsList.BY_NAME[value];

                        return;
                    }

                    if (key === "guardedByMobTypes") {
                        value = value.map((mobTypeName) => {
                            if (!EntitiesList[mobTypeName]) {
                                Utils.error(`Invalid mob type name '${mobTypeName}' used in guardedByMobTypes list. Check it is in the entities list:`, config);
                            }
                            return EntitiesList[mobTypeName];
                        });

                        EntityType.prototype.guardedByMobTypes = value;

                        return;
                    }

                    // Load whatever properties that have the same key in the config as on this class.
                    if (EntityType.prototype[key] !== undefined) {
                        // Check if the property has already been loaded by a
                        // subclass, or set on the class prototype for class files.
                        if (Object.getPrototypeOf(EntityType).prototype[key]
                        === EntityType.prototype[key]) {
                            EntityType.prototype[key] = value;
                        }
                    }
                });
            });
        }
        catch (error) {
            Utils.error(error);
        }
    }
}
module.exports = ResourceNode;

ResourceNode.abstract = true;

/**
 * The type of item that will be given to the character that exploits this node.
 * It is a reference to the class itself, NOT an instance of it.
 * @type {Function}
 */
ResourceNode.prototype.ItemType = null;

/**
 * How much glory is given to the character that exploits this node.
 * @type {Number}
 */
ResourceNode.prototype.gloryGiven = 0;

/**
 * How much gathering stat exp is given to the character that exploits this node.
 * @type {Number}
 */
ResourceNode.prototype.expGiven = 0;

/**
 * The base amount of time (in ms) it takes for this node to be gathered from.
 * The actual amount of time it takes can be affected by the tools a player uses and their stat levels.
 * @type {Number}
 */
ResourceNode.prototype.gatherTime = 1000;

ResourceNode.prototype.guardedByMobTypes = null;

ResourceNode.prototype.guardedRange = 4;
