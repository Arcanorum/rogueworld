import PanelTemplate from "./PanelTemplate";

class ClanPanel extends PanelTemplate {

    constructor () {
        super(document.getElementById('clan_panel'), 500, 320, dungeonz.getTextDef('Clan'), 'gui/panels/charter');

        this.innerContainer = document.createElement('div');
        this.innerContainer.id = 'clan_inner_cont';
        this.contentsContainer.appendChild(this.innerContainer);

        const topContainer = document.createElement('div');
        topContainer.id = 'clan_top_cont';
        this.innerContainer.appendChild(topContainer);

        this.memberList = document.createElement('div');
        this.memberList.id = 'clan_member_list';
        topContainer.appendChild(this.memberList);

        const detailsContainer = document.createElement('div');
        detailsContainer.id = 'clan_details_cont';
        topContainer.appendChild(detailsContainer);

        const membersIcon = document.createElement('img');
        membersIcon.src = 'assets/img/gui/panels/clan-members-icon.png';
        membersIcon.className = 'clan_details_icon';
        membersIcon.draggable = false;
        detailsContainer.appendChild(membersIcon);

        this.membersText = document.createElement('div');
        this.membersText.className = 'clan_details_text';
        this.membersText.innerText = "50/50";
        detailsContainer.appendChild(this.membersText);

        const structuresIcon = document.createElement('img');
        structuresIcon.src = 'assets/img/gui/panels/clan-structures-icon.png';
        structuresIcon.className = 'clan_details_icon';
        structuresIcon.draggable = false;
        detailsContainer.appendChild(structuresIcon);

        this.structuresText = document.createElement('div');
        this.structuresText.className = 'clan_details_text';
        this.structuresText.innerText = "100/100";
        detailsContainer.appendChild(this.structuresText);

        const powerIcon = document.createElement('img');
        powerIcon.src = 'assets/img/gui/panels/clan-power-icon.png';
        powerIcon.className = 'clan_details_icon';
        powerIcon.draggable = false;
        detailsContainer.appendChild(powerIcon);

        this.powerText = document.createElement('div');
        this.powerText.className = 'clan_details_text';
        this.powerText.innerText = "1000";
        detailsContainer.appendChild(this.powerText);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'clan_bottom_cont';
        this.innerContainer.appendChild(bottomContainer);

        const kickButtonContainer = document.createElement('div');
        kickButtonContainer.className = 'clan_bottom_button_cont';
        kickButtonContainer.onclick = this.kickPressed;
        bottomContainer.appendChild(kickButtonContainer);
        this.kickButton = document.createElement('img');
        this.kickButton.className = 'centered clan_bottom_button';
        this.kickButton.src = 'assets/img/gui/panels/clan-button-border-invalid.png';
        kickButtonContainer.appendChild(this.kickButton);
        const kickText = document.createElement('div');
        kickText.className = 'centered clan_bottom_text';
        kickText.innerText = dungeonz.getTextDef('Kick clan member');
        kickButtonContainer.appendChild(kickText);

        const promoteButtonContainer = document.createElement('div');
        promoteButtonContainer.className = 'clan_bottom_button_cont';
        promoteButtonContainer.onclick = this.promotePressed;
        bottomContainer.appendChild(promoteButtonContainer);
        this.promoteButton = document.createElement('img');
        this.promoteButton.className = 'centered clan_bottom_button';
        this.promoteButton.src = 'assets/img/gui/panels/clan-button-border-invalid.png';
        promoteButtonContainer.appendChild(this.promoteButton);
        const promoteText = document.createElement('div');
        promoteText.className = 'centered clan_bottom_text';
        promoteText.innerText = dungeonz.getTextDef('Promote clan member');
        promoteButtonContainer.appendChild(promoteText);

        const emptySpace = document.createElement('div');
        bottomContainer.appendChild(emptySpace);

        const leaveButtonContainer = document.createElement('div');
        leaveButtonContainer.className = 'clan_bottom_button_cont';
        leaveButtonContainer.onclick = this.leavePressed;
        bottomContainer.appendChild(leaveButtonContainer);
        this.leaveButton = document.createElement('img');
        this.leaveButton.className = 'centered clan_bottom_button';
        this.leaveButton.src = 'assets/img/gui/panels/leave-button-border-valid.png';
        leaveButtonContainer.appendChild(this.leaveButton);
        const leaveText = document.createElement('div');
        leaveText.className = 'centered clan_bottom_text';
        leaveText.innerText = dungeonz.getTextDef('Leave clan');
        leaveButtonContainer.appendChild(leaveText);

        this.selectedMemberNameElement = null;
        // An array of references to the member name elements for easy access.
        this.memberListArray = [];

        const clanPanel = this;
        function nameOnClick () {
            // Ignore empty slots.
            if(this.innerText === '-') return;

            clanPanel.kickButton.src = 'assets/img/gui/panels/clan-button-border-invalid.png';
            clanPanel.promoteButton.src = 'assets/img/gui/panels/clan-button-border-invalid.png';

            // If an element is already selected, deselect it.
            if(clanPanel.selectedMemberNameElement !== null){
                clanPanel.selectedMemberNameElement.className = 'clan_member_text';
            }

            // If the already selected element was clicked on, deselect it.
            if(this === clanPanel.selectedMemberNameElement){
                clanPanel.selectedMemberNameElement = null;
            }
            // Another element was clicked on.
            else {
                this.className = 'clan_member_text_selected';
                clanPanel.selectedMemberNameElement = this;
                // Show the buttons as valid if the rank is higher.
                if(_this.clanManager.ownRankIndex < clanPanel.selectedMemberNameElement.rankIndex){
                    clanPanel.kickButton.src = 'assets/img/gui/panels/kick-button-border-valid.png';
                }
                if(_this.clanManager.ownRankIndex < _this.GUI.clanPanel.selectedMemberNameElement.rankIndex-1){
                    clanPanel.promoteButton.src = 'assets/img/gui/panels/promote-button-border-valid.png';
                }
            }
        }

        let nameElement;
        // Add some elements for the individual names.
        for(let i=0; i<_this.clanManager.maxMembers; i+=1){
            nameElement = document.createElement('p');
            //nameElement.innerText = "Some dude name that is really long";
            nameElement.className = 'clan_member_text';
            // Add the click event listener for selecting names on the list.
            nameElement.onclick = nameOnClick;
            // Attach the rank index that anyone in this slot should have.
            nameElement.rankIndex = i;
            this.memberListArray.push(nameElement);
            this.memberList.appendChild(nameElement);
        }

        // A loop that starts to check the values of the details, such as power.
        this.getValuesLoop = null;

    }

    show () {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
        this.requestValues();
        // Start a loop to keep updating the values every few seconds.
        this.getValuesLoop = setInterval(this.requestValues, 5000);
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
        // Stop the loop of requesting values.
        clearInterval(this.getValuesLoop);
    }

    /**
     * Get the current values for the structure count and power from the server.
     */
    requestValues () {
        ws.sendEvent("get_clan_values");
    }

    kickPressed () {
        if(_this.GUI.clanPanel.selectedMemberNameElement === null) return;
        // Don't allow kick self, or higher ranks.
        if(_this.clanManager.ownRankIndex < _this.GUI.clanPanel.selectedMemberNameElement.rankIndex){
            ws.sendEvent("clan_kick", _this.GUI.clanPanel.selectedMemberNameElement.rankIndex);
        }
    }

    promotePressed () {
        if(_this.GUI.clanPanel.selectedMemberNameElement === null) return;
        // Don't allow promote self, or higher ranks, or the rank directly below.
        if(_this.clanManager.ownRankIndex < _this.GUI.clanPanel.selectedMemberNameElement.rankIndex-1){
            ws.sendEvent("clan_promote", _this.GUI.clanPanel.selectedMemberNameElement.rankIndex);
        }
    }

    leavePressed () {
        //console.log("leave clan pressed");
        _this.clanManager.leave();
    }

    updateMemberList () {
        const members = _this.clanManager.members;
        //console.log("update member list, members:", members);
        const maxMembers = _this.clanManager.maxMembers;
        let i=0,
            memberCount=0;
        for(; i<maxMembers; i+=1){
            // Clear empty slots.
            if(members[i] === null){
                this.memberListArray[i].innerText = "-";
            }
            else {
                memberCount+=1;
                this.memberListArray[i].innerText = members[i].displayName;
                //console.log("updating member list, member name:", members[i].displayName, ", at rank:", i);
            }
        }

        // Update the counter too.
        this.membersText.innerText = memberCount + "/" + _this.clanManager.maxMembers;
    }

    updateValues (data) {
        _this.GUI.clanPanel.structuresText.innerText = data.structuresCount + "/" + _this.clanManager.maxStructures;
        _this.GUI.clanPanel.powerText.innerText = data.power;
    }

}

export default ClanPanel;