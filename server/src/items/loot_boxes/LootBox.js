const ItemConfig = require("../../inventory/ItemConfig");
const RewardsList = require("../../tasks/RewardsList");
const Utils = require("../../Utils");
const Item = require("../Item");

class LootBox extends Item {
    onUsed() {
        // Add items for each.
        for (let i = 0; i < this.amountGiven; i += 1) {
            const RewardItemType = Utils.getRandomElement(RewardsList);

            const itemConfig = new ItemConfig({ ItemType: RewardItemType });

            if (itemConfig.quantity) {
                // If they have enough inventory space to claim at least some of this reward, add
                // to the inventory.
                if (this.owner.inventory.canItemBeAdded(itemConfig)) {
                    this.owner.inventory.addItem(itemConfig);
                }

                // Check there is any of the item left. Not all
                // of it might have been added to the inventory.
                // Add anything remaining to the ground.
                if (itemConfig.quantity > 0) {
                    new RewardItemType.prototype.PickupType(
                        {
                            row: this.owner.row,
                            col: this.owner.col,
                            board: this.owner.board,
                            itemConfig,
                        },
                    ).emitToNearbyPlayers();
                }
            }
            else if (itemConfig.durability) {
                // If they have enough inventory space to claim this reward, add to the inventory.
                if (this.owner.inventory.canItemBeAdded(itemConfig)) {
                    this.owner.inventory.addItem(itemConfig);
                }
                else {
                    new RewardItemType.prototype.PickupType(
                        {
                            row: this.owner.row,
                            col: this.owner.col,
                            board: this.owner.board,
                            itemConfig,
                        },
                    ).emitToNearbyPlayers();
                }
            }
        }

        super.onUsed();
    }
}

LootBox.abstract = true;

LootBox.amountGiven = 0;

module.exports = LootBox;
