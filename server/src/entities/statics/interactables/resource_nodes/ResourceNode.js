const ItemConfig = require("../../../../inventory/ItemConfig");
const Interactable = require("../Interactable");

class ResourceNode extends Interactable {
    /**
     *
     * @param {Player} interactedBy
     * @param {Item} toolUsed - The tool used by the player on this node, such as a hatchet or sickle.
     */
    interaction(interactedBy, toolUsed) {
        // Don't do anything to this node if it has no resource available.
        if (this.activeState === false) return;

        // Don't do anything if this resource node doesn't give an item (for whatever reason).
        if (this.ItemType === null) return;

        // Don't do anything if the character doesn't have enough energy to interact with this node.
        if (interactedBy.energy < this.interactionEnergyCost) return;

        const itemConfig = new ItemConfig({ ItemType: this.ItemType });

        // Check if a particular tool is needed to harvest this node.
        if (this.requiredToolCategory !== null) {
            // Don't do anything if no tool was used. Might have been walked into.
            if (toolUsed === undefined) return;

            // Don't do anything to this node if the wrong tool has been used on it.
            if (toolUsed.category !== this.requiredToolCategory) {
                // Tell the player if they are using the wrong tool.
                interactedBy.socket.sendEvent(this.warningEvent);
                return;
            }

            // Don't do anything if there isn't enough space in the inventory to receive the resource item.
            if (!interactedBy.inventory.canItemBeAdded(itemConfig)) return;

            // Reduce the durability of the tool used.
            // This needs to be before the inventory check below, as there is a special
            // case when a tool would be destroyed by being used on this node, thus freeing up
            // space for the item it gives.
            toolUsed.onUsed();
        }
        // No tool required. Check it is actually a player, as only players have an inventory.
        else if (interactedBy.socket === undefined) return;

        // Don't do anything if there isn't enough space in the inventory to receive the resource item.
        if (!interactedBy.inventory.canItemBeAdded(itemConfig)) return;

        // Create a new instance of the item type given by this node and add it to the character's inventory.
        interactedBy.inventory.addItem(itemConfig);

        // Reduce their energy by the interaction cost.
        interactedBy.modEnergy(-this.interactionEnergyCost);

        // Increase the glory of the character.
        interactedBy.modGlory(this.gloryGiven);

        // Check any task progress was made.
        interactedBy.tasks.progressTask(this.taskIdGathered);

        // Item was added to inventory, this node is now exploited.
        this.deactivate(interactedBy);
    }
}
module.exports = ResourceNode;

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
