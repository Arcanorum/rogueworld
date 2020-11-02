
class Clan {

    constructor (charter) {
        /**
         * How many members this clan can have at once.
         * @type {Number}
         */
        this.maxMembers = 10;

        /**
         * The player entities of players in this clan.
         * Sorted by their rank. Higher ranked clan members are closer to start of array.
         * Rank [0] is the leader.
         * Don't resize the array. Just null all empty slots.
         * @type {Array}
         */
        this.members = [];

        for(let i=0; i<this.maxMembers; i+=1){
            this.members[i] = null;
        }

        /**
         * The charter of this clan. The main structure.
         * If this is destroyed, the clan and all it's structures are destroyed.
         * @type {Charter}
         */
        this.charter = charter;

        /** @type {Object} */
        this.structures = {};

        /**
         * How many structures this clan currently has.
         * @type {Number}
         */
        this.structuresCount = 0;

        /**
         * How many structures this clan can have at once.
         * @type {Number}
         */
        this.maxStructures = 100;

        /**
         * How far away from their charter this clan can place structures.
         * @type {Number}
         */
        this.buildRange = 15;

        /** @type {Number} */
        this.power = 0;

        /**
         * Whether this clan has it's power enabled. Can be toggled by members, and is disabled if generatorCount reaches 0.
         * @type {Boolean}
         */
        this.powerActive = false;

        /**
         * How many generator strucutres this clan has. If less than 1, then no stored power can be used.
         * Need at least 1 generator for powered structures to function.
         * @type {Number}
         */
        this.generatorCount = 0;

        // Add this clan to the list of clans so it can be saved when the server stops.
        clanManager.addClan(this);

    }

    destroy () {
        //console.log("clan destroy");
        let i;
        const members = this.members;
        const maxMembers = this.maxMembers;
        // Tell all members the clan is destroyed.
        for(i=0; i<maxMembers; i+=1){
            // Check the end of the member list is reached. Might have less members than the max.
            // The first null slot found should be the end of the list.
            if(members[i] === null) break;
            members[i].socket.sendEvent(this.charter.EventsList.clan_destroyed);
            // Remove all references to this clan on the members.
            members[i].clan = null;
        }

        // Clear all members, so they aren't spammed with the structure destroyed message.
        this.members = [];

        // Destroy all structures.
        for(let entityID in this.structures){
            if(this.structures.hasOwnProperty(entityID) === false) continue;

            this.structures[entityID].destroy();
        }
        // Remove this clan from the list of clans so it won't be saved when the server stops.
        clanManager.removeClan(this);

    }

    /**
     * Emit an event, and optional data, to all clan members.
     * @param {String} event
     * @param {*} data
     */
    emitToAllMembers (event, data) {
        let i,
            members = this.members,
            maxMembers = this.maxMembers;
        for(i=0; i<maxMembers; i+=1){
            // Check the end of the member list is reached. Might have less members than the max.
            // The first null slot found should be the end of the list.
            if(members[i] === null) break;
            members[i].socket.sendEvent(event, data);
        }
    }

    /**
     * Gets the rank index number of the given player.
     * @param {Player} player
     * @returns {Number}
     */
    getMemberRankIndex (player) {
        if(player.clan !== this) Utils.error("Getting member rank index for a player that isn't member of this clan:", player);
        let i;
        const members = this.members;
        const maxMembers = this.maxMembers;
        // Find the member.
        for(i=0; i<maxMembers; i+=1){
            if(members[i] === player){
                return i;
            }
        }
    }

    printMembers () {
        //console.log("printing members:");
        let i,
            members = this.members,
            maxMembers = this.maxMembers;
        for(i=0; i<maxMembers; i+=1){
            if(members[i] === null) console.log("- null");
            else console.log("- " + members[i].displayName);
        }
    }

    /**
     * Attempts to add a player to this clan.
     * @param {Player} player - The player to add to this clan.
     */
    addMember (player) {
        //console.log("clan add member:", player.displayName);

        // Check they aren't already in a clan.
        if(player.clan !== null){
            player.socket.sendEvent(player.EventsList.chat_warning, player.ChatWarnings["Already in clan warning"]);
            return;
        }

        let i;
        const members = this.members;
        const maxMembers = this.maxMembers;
        // Get the first empty slot. If no empty slots found, the clan is full.
        for(i=0; i<maxMembers; i+=1){
            if(members[i] === null){
                // Tell all existing members a player has joined.
                this.emitToAllMembers(player.EventsList.clan_joined, {
                    id: player.id,
                    displayName: player.displayName
                });

                // Empty slot found.
                members[i] = player;
                // Add the clan to the player.
                player.clan = this;

                // Get the details of all members (including the new member) to send to the new member.
                const membersData = [];
                for(i=0; i<maxMembers; i+=1){
                    if(members[i] === null) break;
                    membersData.push({id: members[i].id, displayName: members[i].displayName});
                }
                // Also send the info of structure count and power.
                player.socket.sendEvent(player.EventsList.clan_joined, {
                    membersData: membersData,
                    structuresCount: this.structuresCount,
                    power: this.power
                });

                //console.log("  new member added");

                return;
            }
        }
        // Tell the player the clan is full.

    }

    /**
     * A member is removed from this clan by another member.
     * @param {Number} toKickRankIndex - Rank index of the member to kick.
     * @param {Player} kickedByPlayer - The player entity of the member that kicked this member.
     */
    kickMember (toKickRankIndex, kickedByPlayer) {
        let i;
        const members = this.members;
        const maxMembers = this.maxMembers;
        //console.log("to kick rank index:", toKickRankIndex);

        // Only accept a number rank index.
        if(Number.isInteger(toKickRankIndex) === false) return;
        // Check the index is valid. A client might have sent something dodgy.
        if(this.members[toKickRankIndex] === undefined) return;
        // Check there is actually a member in that slot.
        if(this.members[toKickRankIndex] === null) return;
        // Check the promoter is actually a clan member.
        if(kickedByPlayer.clan !== this) return;

        // Check the person doing the kicking is a higher rank.
        for(i=0; i<maxMembers; i+=1){
            // If the player to be kicked is found before the kicker, they are a higher rank.
            if(i === toKickRankIndex){
                // Stop the kick.
                return;
            }
            if(members[i] === kickedByPlayer){
                // Kicker found first, proceed with the kick.
                break;
            }
        }

        // Tell all clan members this member has been kicked.
        this.emitToAllMembers(kickedByPlayer.EventsList.clan_kicked, toKickRankIndex);

        //const playerToKick = this.members[toKickRankIndex];

        this.removeMember(this.members[toKickRankIndex]);

        // Tell the player they have been kicked.
        //playerToKick.socket.sendEvent(playerToKick.EventsList.clan_kicked, toKickRankIndex);

    }

    /**
     * The given member chose to leave this clan, such as when they close the game, or the leave button.
     * @param {Player} player
     */
    memberLeft (player) {
        //console.log("member left clan");

        // Tell all clan members this member has left.
        this.emitToAllMembers(player.EventsList.clan_left, this.getMemberRankIndex(player));

        this.removeMember(player);
    }

    /**
     * Removes the given member from the clan.
     * @param {Player} player
     * @returns {Number} The rank index they had in the clan, before removal. TODO: <-- why?
     */
    removeMember (player) {
        // Check a valid value is given. Might have been an empty clan member slot.
        if(player === null) return;

        let i;
        const members = this.members;
        const maxMembers = this.maxMembers;
        // Remove the member.
        for(i=0; i<maxMembers; i+=1){
            if(members[i] === player){
                members[i] = null;
                //console.log("member to remove found, rank:", i);
                break;
            }
        }

        // Remove this clan from the player, so they don't still have a reference to this clan.
        player.clan = null;

        const rankIndex = i;

        // Move everyone else below them in the clan up a rank.
        // i should still be the index of the removed member. Get the next member.
        i += 1;
        for(; i<maxMembers; i+=1){
            // Check the end of the member list is reached. Might have less members than the max.
            // The first null slot found should be the end of the list.
            if(members[i] === null) break;
            this.promoteMember(i);
        }

        //console.log("member removed");
        //this.printMembers();

        return rankIndex;
    }

    /**
     * Promotes the member at the given rank index
     * @param {Number|String} toPromoteRankIndex - The rank index of the member to promote.
     * @param {Player} [promotedByPlayer] - Another member that is giving this promotion.
     * @param {Boolean} [shouldEmit] - Whether the clan_promoted event should be sent to clan members.
     */
    promoteMember (toPromoteRankIndex, promotedByPlayer, shouldEmit) {
        //console.log("promote member:", toPromoteRankIndex);

        // Only accept a number rank index.
        if(Number.isInteger(toPromoteRankIndex) === false) return;
        // Check the index is valid. A client might have sent something dodgy.
        if(this.members[toPromoteRankIndex] === undefined) return;
        // Check there is actually a member in that slot.
        if(this.members[toPromoteRankIndex] === null) return;

        // If promoted by null, they are just being moved up to fill a gap, so don't send the messages.
        // If NOT, then they are being promoted by another member so check the ranks.
        if(promotedByPlayer){
            // Check the promoter is actually a clan member.
            if(promotedByPlayer.clan !== this) return;

            let i;
            const members = this.members;
            const maxMembers = this.maxMembers;
            // Check the person doing the kicking is a higher rank.
            for(i=0; i<maxMembers; i+=1){
                // If the player to be promoted is found before the promoter, they are a higher rank.
                // Since this check is first, it handles the case that the rank index is for the promoter, i.e. trying to promote themself.
                if(i === toPromoteRankIndex){
                    // Stop the promotion.
                    return;
                }
                if(members[i] === promotedByPlayer){
                    // Promoter found first, proceed with the promotion.
                    break;
                }
            }
        }

        const member = this.members[toPromoteRankIndex];
        // Move the member above into the slot below.
        this.members[toPromoteRankIndex] = this.members[toPromoteRankIndex-1];
        // Move the promoted member to the slot above.
        this.members[toPromoteRankIndex-1] = member;

        if(shouldEmit === true){
            // Tell all clan members this member has been promoted.
            this.emitToAllMembers(this.members[toPromoteRankIndex-1].EventsList.clan_promoted, toPromoteRankIndex);
        }

        //console.log("member promoted:", member.id, ", to rank:", toPromoteRankIndex-1);
        //this.printMembers();
    }

    /**
     * Is there space for more structures, within charter range, on the overworld, and on a valid tile.
     * @param {Number} row
     * @param {Number} col
     * @param {Board} board
     * @returns {Boolean}
     */
    canBuild (row, col, board) {
        // Check there is space for more structures.
        if(this.structuresCount >= this.maxStructures) return false;
        // Check the target build location is within the build range of the charter.
        if(Math.abs(row - this.charter.row) > this.buildRange) return false;
        if(Math.abs(col - this.charter.col) > this.buildRange) return false;

        // Check there is nothing in the way. Can only build on the overworld.
        if(board.isTileBuildable(row, col) === false) return false;

        //console.log("clan can build");
        return true;
    }

    /**
     * Add the given structure to this clan.
     * @param {Buildable} structure
     */
    addStructure (structure) {
        //console.log("clan structure added");
        this.structuresCount += 1;
        this.structures[structure.id] = structure;
    }

    /**
     * Remove the given structure from this clan.
     * @param {Buildable} structure
     */
    removeStructure (structure) {
        //console.log("clan structure removed");
        this.structuresCount -= 1;
        delete this.structures[structure.id];
    }

    /**
     * Change the amount of generators this clan is recorded as having.
     * Used to determine if power should be available.
     * @param {Number} amount
     */
    modGeneratorCount (amount) {
        this.generatorCount += amount;

        if(this.generatorCount <= 0){
            this.powerActive = false;
        }
        else {
            this.powerActive = true;
        }
    }

    getValues () {
        return {
            structuresCount: this.structuresCount,
            power: this.power
        }
    }

}

module.exports = Clan;

const Utils = require('../Utils');
const clanManager = require('./ClanManager');