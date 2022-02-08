import { Inventory } from '../../inventory';
import Ammunition from '../../items/classes/ammunition/Ammunition';
import Clothes from '../../items/classes/clothes/Clothes';
import Holdable from '../../items/classes/holdable/Holdable';
import PlayerWebSocket from '../../websocket_events/PlayerWebSocket';
import Character from './Character';
import { EntityConfig } from './Entity';

interface PlayerConfig extends EntityConfig {
    socket: PlayerWebSocket;
    displayName: string;
}

class Player extends Character {
    /**
     * How far can a player entity see, and therefore how much data to send to their client.
     */
    static viewRange = 9;

    inventory = {};

    socket: PlayerWebSocket;

    displayName = '';

    glory = 0;

    /**
     * What this player is wearing. Such as armour, robes, cloak, disguise, apron.
     * A reference to an item in their inventory.
     */
    clothing: Clothes|null = null;

    /**
     * What this player is holding. Mostly weapons.
     * A reference to an item in their inventory.
     */
    holding: Holdable|null = null;

    /**
     * What this player is using as ammunition. Mostly arrows.
     * A reference to an item in their inventory.
     */
    ammunition: Ammunition|null = null;

    constructor(config: PlayerConfig) {
        super(config);

        config.socket.entity = this;
        this.socket = config.socket;

        config.board.addPlayer(this);

        this.inventory = new Inventory(this);

        this.displayName = config.displayName;
    }

    modDefence(amount: number) {
        super.modDefence(amount);
        // Tell the player their new defence amount.
        this.socket.sendEvent('defence_value', this.defence);
    }

    /**
     * Swap to a different clothing item, or unequip the currently worn clothing.
     */
    modClothing(clothing: Clothes|null) {
        if (clothing === null) {
            // Tell the player to hide the equip icon on the inventory slot of the item that was removed.
            this.socket.sendEvent('deactivate_clothing');

            // Object.entries(this.clothing.statBonuses).forEach(([statKey, statBonus]) => {
            //     this.stats[statKey].levelModifier -= statBonus;
            // });
        }
        else {
            // Tell the player to show the equip icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent('activate_clothing', clothing.slotIndex);

            // Object.entries(clothing.statBonuses).forEach(([statKey, statBonus]) => {
            //     this.stats[statKey].levelModifier += statBonus;
            // });
        }
        // Do this after, or this.clothing would have already been nulled, so won't have a slot key to send to the client.
        this.clothing = clothing;
    }

    modHolding(holding: Holdable|null) {
        if (holding === null) {
            // Tell the player to hide the equip icon on the inventory slot of the item that was removed.
            this.socket.sendEvent('deactivate_holding');
        }
        else {
            // Tell the player to show the equip icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent('activate_holding', holding.slotIndex);
        }
        // Do this after, or this.holding would have already been nulled, so won't have a slot key to send to the client.
        this.holding = holding;
    }

    modAmmunition(ammunition: Ammunition|null) {
        if (ammunition === null) {
            // Tell the player to hide the ammunition icon on the inventory slot of the item that was removed.
            this.socket.sendEvent('deactivate_ammunition');
        }
        else {
            // Tell the player to show the ammunition icon on the inventory slot of the item that was equipped.
            this.socket.sendEvent('activate_ammunition', ammunition.slotIndex);
        }
        // Do this after, or this.ammunition would have already been nulled, so won't have a slot key to send to the client.
        this.ammunition = ammunition;
    }
}

export default Player;
