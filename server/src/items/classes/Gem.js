const EntitiesList = require("../../entities/EntitiesList");
const ItemConfig = require("../../inventory/ItemConfig");
const ILBN = require("../ItemsList").BY_NAME;
const Item = require("./Item");

const windGemCost = 50;
const fireGemCost = 80;
const bloodGemCost = 100;

const checkAltar = (player, boardTile, AltarType, gloryCost, GemType) => {
    if (boardTile.static instanceof AltarType) {
        // Check they have enough glory.
        if (player.glory >= gloryCost) {
            // Give them a gem of the type of altar.
            player.inventory.addItem(
                new ItemConfig({
                    ItemType: GemType,
                    quantity: 1,
                }),
                true,
            );

            player.modGlory(-gloryCost);

            // Give them some of the glory cost as magic exp.
            player.stats.Magic.gainExp(Math.floor(gloryCost * 0.1));

            return true;
        }
    }

    return false;
};

class Gem extends Item {
    use() {
        const { owner } = this;

        // Get the tile in front of the owner.
        const tile = owner.board.getTileInFront(
            owner.direction,
            owner.row,
            owner.col,
        );

        if (
            checkAltar(owner, tile, EntitiesList.WindAltar, windGemCost, ILBN.WindGem)
            || checkAltar(owner, tile, EntitiesList.FireAltar, fireGemCost, ILBN.FireGem)
            || checkAltar(owner, tile, EntitiesList.BloodAltar, bloodGemCost, ILBN.BloodGem)
        ) {
            super.onUsed();
        }
    }
}

module.exports = Gem;
