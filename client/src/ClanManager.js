
class ClanManager {

    constructor () {
        /** @type {Number} */
        this.charterID = null;
        /**
         * Useful for checking if this player is in a clan, and if they have high enough rank to kick/promote other members.
         * @type {Number} */
        this.ownRankIndex = null;
        /** @type {Number} */
        //this.structuresCount = 0;
        /** @type {Number} */
        this.maxStructures = 100;
        /** @type {Number} */
        //this.power = 0;
        /** @type {Number} */
        this.maxMembers = 10;

        /**
         * Details of all the players in this clan.
         * Sorted by their rank. Higher ranked clan members are closer to start of array.
         * Rank [0] is the leader.
         * Don't resize the array. Just null all empty slots.
         * @type {Array}
         */
        this.members = [];

        for(let i=0; i<this.maxMembers; i+=1){
            this.members[i] = null;
        }
    }

    close () {
        _this.GUI.clanIcon.style.visibility = "hidden";
        _this.GUI.clanPanel.hide();
        // Hide the crafting panel too, in case they had the charter crafting station open.
        _this.GUI.craftingPanel.hide();
        this.ownRankIndex = null;
        // Reset the members list, so previous entries don't affect anything if they join another clan.
        for(let i=0; i<this.maxMembers; i+=1){
            this.members[i] = null;
        }
    }

    findOwnRankIndex () {
        // Find this player's own rank.
        for(let i=0; i<this.maxMembers; i+=1){
            if(this.members[i] === null){
                this.promoteMember(i+1);
            }

            // The member with the matching entity ID is this player.
            if(this.members[i].id === _this.player.entityId){
                this.ownRankIndex = i;
                break;
            }
        }
    }

    addMember (id, displayName) {
        // Get the first empty slot.
        for(let i=0; i<this.maxMembers; i+=1){
            if(this.members[i] === null){
                this.members[i] = {
                    id: id,
                    displayName: displayName
                };
                break;
            }
        }
        // Update the member list.
        _this.GUI.clanPanel.updateMemberList();
    }

    promoteMember (toPromoteRankIndex) {
        const member = this.members[toPromoteRankIndex];
        // Move the member above into the slot below.
        this.members[toPromoteRankIndex] = this.members[toPromoteRankIndex-1];
        // Move the promoted member to the slot above.
        this.members[toPromoteRankIndex-1] = member;
        //console.log("member promoted:", member.displayName, ", to rank:", toPromoteRankIndex-1);
        // Update the member list, as the order has changed.
        _this.GUI.clanPanel.updateMemberList();

        this.findOwnRankIndex();
    }

    removeMember (rankIndex) {
        // Remove them from the members list.
        this.members[rankIndex] = null;
        // Move all members below up a rank.
        let i = rankIndex,
            members = this.members,
            len = members.length;
        // Move everyone else below them in the clan up a rank.
        // i should still be the index of the removed member. Get the next member.
        i += 1;
        for(; i<len; i+=1){
            // Check the end of the member list is reached. Might have less members than the max.
            // The first null slot found should be the end of the list.
            if(members[i] === null) break;

            this.promoteMember(i);
        }
        // Update the members list. This will only happen during the above
        // promotions if there is actually another member to promote.
        _this.GUI.clanPanel.updateMemberList();
    }

    /**
     * A new member joined the clan. Might be this player.
     */
    memberJoined (data) {
        // If there is an id property, then it is for a new member of the clan this player is already in.
        // NOT for when this player is the new member.
        if(data.id !== undefined){
            //console.log("  another player is new clan member");
            _this.chat(undefined, "New clan member: " + data.displayName, "#50ff7f");
            this.addMember(data.id, data.displayName);
        }
        // This player is the new member. Set up the clan stuff.
        else {
            //console.log("  this player is the new clan member");
            _this.chat(undefined, "Clan joined!", "#50ff7f");
            // For every slot in the data sent.
            for(let i=0; i<this.maxMembers; i+=1){
                // Might not be a full roster, so just do the ones that are there.
                if(data.membersData[i] === undefined) break;
                this.addMember(data.membersData[i].id, data.membersData[i].displayName);
            }

            // Find the player's own rank.
            this.findOwnRankIndex();

            _this.GUI.clanPanel.structuresText.innerText = data.structuresCount + "/" + this.maxStructures;
            _this.GUI.clanPanel.powerText.innerText = data.power;
            // Show the clan icon so they can open the clan panel.
            _this.GUI.clanIcon.style.visibility = "visible";
        }
    }

    memberKicked (rankIndex) {
        // If the kicked member is this player.
        if(rankIndex === this.ownRankIndex){
            this.close();
            _this.chat(undefined, "You were kicked from the clan", "#ffb04c");
        }
        // Another member was kicked.
        else {
            _this.chat(undefined, "Member kicked from clan: " + (this.members[rankIndex].displayName), "#ffb04c");
            this.removeMember(rankIndex);
        }
    }

    memberLeft (rankIndex) {
        _this.chat(undefined, "Member left clan: " + (this.members[rankIndex].displayName), "#ffb04c");
        // If the member at this rank index is valid, remove them.
        // The members list will be empty if this player pressed the leave button,
        // but they will still receive this member left event for themselves.
        if(this.members[rankIndex] !== null) this.removeMember(rankIndex);
    }

    /**
     * This player leaves the clan they are in.
     */
    leave () {
        ws.sendEvent("clan_leave");
        this.close();
        _this.chat(undefined, "Clan left", "#ffa54f");
    }

    /**
     * The clan was destroyed.
     */
    destroyed () {
        this.close();
        _this.chat(undefined, "Clan destroyed!", "#ffb04c");
    }

}

export default ClanManager;