const Breakable = require('./Breakable');

class MetalDoor extends Breakable {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Clan} config.clan
     */
    constructor (config) {
        super(config);

        // If it belongs to a clan, add the specific properties for clan structures.
        //if(config.clan !== undefined){
        //    this.clan = config.clan;
        //    this.clan.addStructure(this); // TODO clean this stuff out of NPC structures, add it only to ClanStructure types.
        //    this.hitPoints = 20;
        //    this.maxHitPoints = 20;
        //}
    }

    interaction (interactedBy) {
        // Don't do anything to this door if it is not active.
        if(this.activeState === false) return;

        // Don't do anything if the character doesn't have enough energy to interact with this object.
        if(interactedBy.energy < this.interactionEnergyCost) return;

        // Don't do anything if this is owned by a clan, and the character isn't a member of that clan.
        //if(this.clan !== null){
        //    // The character might not have a clan property, so will be
        //    // undefined, but they both can't be null due to the above check. TODO clean
        //    if(this.clan !== interactedBy.clan) return;
        //}

        // Reduce their energy by the interaction cost.
        interactedBy.modEnergy(-this.interactionEnergyCost);

        // The door is now open, so stop it from blocking players.
        this.deactivate();

        this.blocking = false;
    }

    activate () {
        super.activate();
        // If the door was successfully activated (nothing standing on the open door), make it block things.
        if(this.activeState === true) this.blocking = true;
    }
}
module.exports = MetalDoor;

MetalDoor.prototype.interactionEnergyCost = 1;
MetalDoor.prototype.reactivationRate = 5000;