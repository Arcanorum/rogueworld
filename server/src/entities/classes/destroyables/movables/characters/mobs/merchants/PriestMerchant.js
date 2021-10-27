const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../../shops/ShopTypesList");
const Heal = require("../../../../../../../gameplay/Heal");

class PriestMerchant extends Merchant {
    constructor(config) {
        super(config);
        // Heal nearby players every 2 seconds
        this.healInterval = setInterval(this.healNearbyPlayers.bind(this), 2000);
    }

    healNearbyPlayers() {
        // Scan tiles within 2 tile radius of Priest
        this.board.getTilesInEntityRange(this, 2).forEach((boardTile) => {
            // Only heal Players (not destroyables)
            Object.values(boardTile.players).forEach((player) => {
                // If player is in combat, do not heal
                if (player.isInCombat()) return;

                // Don't heal if player is already at max hitpoints
                if (player.hitPoints < player.maxHitPoints) {
                    // Heal 5 hitpoints
                    player.heal(new Heal(20));
                }
            });
        });
    }

    onDestroy() {
        clearInterval(this.healInterval);
        super.onDestroy();
    }
}

PriestMerchant.prototype.shop = ShopTypesList.Priest;

module.exports = PriestMerchant;
