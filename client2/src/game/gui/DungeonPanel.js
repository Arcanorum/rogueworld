import PanelTemplate from "./PanelTemplate";

class PartySlot {
    constructor(panel, partyID, leaderDisplayName, dungeonID) {
        this.container = document.createElement("div");
        this.container.className = "dungeon_party_member_slot_cont dungeon_party_slot_cont";
        this.container.onclick = () => {
            window.ws.sendEvent("join_dungeon_party", {
                dungeonID,
                partyID,
            });
        };

        this.leaderName = document.createElement("div");
        this.leaderName.className = "task_slot_cell task_slot_task_name";
        this.leaderName.innerText = leaderDisplayName;

        this.container.appendChild(this.leaderName);

        panel.partiesContainer.appendChild(this.container);
    }
}

class PartyMemberSlot {
    constructor(panel, index, member, isLeader) {
        this.container = document.createElement("div");
        this.container.className = "dungeon_party_member_slot_cont";

        this.memberName = document.createElement("div");
        this.memberName.className = "task_slot_cell task_slot_task_name";
        this.memberName.innerText = member.displayName;
        this.container.appendChild(this.memberName);

        // Only show the kick buttons to the party leader,
        // and don't show them a kick button for themself.
        if (isLeader) {
            if (index !== 0) {
                this.kickButtonCont = document.createElement("div");
                this.kickButtonCont.className = "dungeon_party_kick_member_button_cont";
                this.kickButton = document.createElement("img");
                this.kickButton.className = "dungeon_party_kick_member_button";
                this.kickButton.src = "assets/img/gui/panels/panel-close-button.png";
                this.kickButtonCont.onclick = () => {
                    window.ws.sendEvent("kick_dungeon_party_member", {
                        dungeonID: panel.dungeonPortal.dungeonManagerID,
                        memberID: member.id,
                    });
                };
                this.kickButtonCont.appendChild(this.kickButton);
                this.container.appendChild(this.kickButtonCont);
            }
        }

        panel.partyMembersContainer.appendChild(this.container);
    }
}

class DungeonPanel extends PanelTemplate {
    constructor() {
        super(document.getElementById("dungeon_panel"), 440, 420, window.dungeonz.getTextDef("Dungeon"),
            "gui/panels/dungeon-portal");

        const innerContainer = document.createElement("div");
        innerContainer.id = "dungeon_inner_cont";
        this.contentsContainer.appendChild(innerContainer);

        this.dungeonName = document.createElement("div");
        this.dungeonName.id = "dungeon_name";
        innerContainer.appendChild(this.dungeonName);

        let spacer = document.createElement("div");
        spacer.className = "panel_template_spacer";
        innerContainer.appendChild(spacer);

        const detailsContainer = document.createElement("div");
        detailsContainer.id = "dungeon_details_cont";
        innerContainer.appendChild(detailsContainer);

        // Difficulty.
        const difficultyContainer = document.createElement("div");
        difficultyContainer.className = "dungeon_details_cont_item";
        detailsContainer.appendChild(difficultyContainer);

        const difficultyHeading = document.createElement("div");
        difficultyHeading.className = "dungeon_details_heading";
        difficultyHeading.innerText = `${window.dungeonz.getTextDef("Difficulty")}:`;
        difficultyContainer.appendChild(difficultyHeading);

        this.difficultyText = document.createElement("div");
        this.difficultyText.className = "dungeon_details_text";
        difficultyContainer.appendChild(this.difficultyText);

        spacer = document.createElement("div");
        spacer.className = "panel_template_spacer";
        detailsContainer.appendChild(spacer);

        // Glory cost.
        const costContainer = document.createElement("div");
        costContainer.className = "dungeon_details_cont_item";
        detailsContainer.appendChild(costContainer);

        const costHeading = document.createElement("div");
        costHeading.className = "dungeon_details_heading";
        costHeading.innerText = `${window.dungeonz.getTextDef("Entry cost")}:`;
        costContainer.appendChild(costHeading);

        const costInnerContainer = document.createElement("div");
        costInnerContainer.id = "dungeon_cost_cont";
        costContainer.appendChild(costInnerContainer);

        const costGloryIcon = document.createElement("img");
        costGloryIcon.id = "dungeon_cost_icon";
        costGloryIcon.src = "assets/img/gui/hud/glory-icon.png";
        costInnerContainer.appendChild(costGloryIcon);

        this.costText = document.createElement("div");
        this.costText.className = "dungeon_details_text";
        costInnerContainer.appendChild(this.costText);

        spacer = document.createElement("div");
        spacer.className = "panel_template_spacer";
        detailsContainer.appendChild(spacer);

        // Max players.
        const maxPlayersContainer = document.createElement("div");
        maxPlayersContainer.className = "dungeon_details_cont_item";
        detailsContainer.appendChild(maxPlayersContainer);

        const maxPlayersHeading = document.createElement("div");
        maxPlayersHeading.className = "dungeon_details_heading";
        maxPlayersHeading.innerText = "Max players:"; // window.dungeonz.getTextDef('Max players') + ":";
        maxPlayersContainer.appendChild(maxPlayersHeading);

        this.maxPlayersText = document.createElement("div");
        this.maxPlayersText.className = "dungeon_details_text";
        maxPlayersContainer.appendChild(this.maxPlayersText);

        spacer = document.createElement("div");
        spacer.className = "panel_template_spacer";
        innerContainer.appendChild(spacer);

        // The contextual lists of parties or members.
        this.listsContainer = document.createElement("div");
        this.listsContainer.classList = "dungeon_lists_cont";
        innerContainer.appendChild(this.listsContainer);

        this.addPartySelectionContainer(this.listsContainer);

        this.addPartyContainer(this.listsContainer);

        this.partySlots = {};
        this.partyMemberSlots = {};
    }

    /**
     * @param {DungeonPortal} dungeonPortal - The static tile entity of the dungeon portal that was interacted with.
     */
    show(dungeonPortal) {
        super.show();
        window.gameScene.GUI.isAnyPanelOpen = true;
        this.dungeonPortal = dungeonPortal;
        const prompt = window.dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID];
        this.dungeonName.innerText = window.dungeonz.getTextDef(prompt.nameDefinitionID);
        this.difficultyText.innerText = window.dungeonz.getTextDef(prompt.difficulty);
        this.costText.innerText = prompt.gloryCost;
        this.maxPlayersText.innerText = prompt.maxPlayers;

        this.partySelectionContainer.style.display = "grid";
        this.partyContainer.style.display = "none";

        // Tell the server this player is looking at the interface for this dungeon, so they can receive updates for it.
        window.ws.sendEvent("focus_dungeon", {
            dungeonID: dungeonPortal.dungeonManagerID,
            row: dungeonPortal.row,
            col: dungeonPortal.col,
        });

        // If they have the entry cost, show the button as valid.
        if (window.gameScene.player.glory
            >= window.dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID].gloryCost) {
            this.createButton.src = "assets/img/gui/panels/buy-button-border-valid.png";
        }
    }

    hide() {
        super.hide();
        window.gameScene.GUI.isAnyPanelOpen = false;

        this.leaveParty();

        this.dungeonPortal = null;

        this.startButtonContainer.style.visibility = "hidden";

        clearInterval(this.getPartiesLoop);
    }

    addPartySelectionContainer(container) {
        // The list of available parties to join.
        this.partySelectionContainer = document.createElement("div");
        this.partySelectionContainer.id = "dungeon_party_selection_cont";
        container.appendChild(this.partySelectionContainer);

        const partiesHeading = document.createElement("div");
        partiesHeading.innerText = "Parties:";
        this.partySelectionContainer.appendChild(partiesHeading);

        this.partiesContainer = document.createElement("div");
        this.partiesContainer.id = "dungeon_parties_cont";
        this.partySelectionContainer.appendChild(this.partiesContainer);

        const bottomContainer = document.createElement("div");
        bottomContainer.className = "dungeon_bottom_cont";
        this.partySelectionContainer.appendChild(bottomContainer);

        const createButtonContainer = document.createElement("div");
        createButtonContainer.className = "dungeon_create_button_cont centered";
        createButtonContainer.onclick = this.createPressed;
        bottomContainer.appendChild(createButtonContainer);

        this.createButton = document.createElement("img");
        this.createButton.id = "dungeon_create_button";
        this.createButton.className = "centered";
        this.createButton.src = "assets/img/gui/panels/buy-button-border-invalid.png";
        createButtonContainer.appendChild(this.createButton);

        const createText = document.createElement("div");
        createText.className = "centered dungeon_button_text";
        createText.innerText = "Create"; // window.dungeonz.getTextDef('Create');
        createButtonContainer.appendChild(createText);
    }

    addPartyContainer(container) {
        // The party the player is currently in.
        this.partyContainer = document.createElement("div");
        this.partyContainer.id = "dungeon_party_cont";
        container.appendChild(this.partyContainer);

        this.partyPlayerCountText = document.createElement("div");
        this.partyPlayerCountText.className = "dungeon_party_player_count_text";
        this.partyPlayerCountText.innerText = "Party: 2/6";
        this.partyContainer.appendChild(this.partyPlayerCountText);

        this.partyMembersContainer = document.createElement("div");
        this.partyMembersContainer.id = "dungeon_party_members";
        this.partyContainer.appendChild(this.partyMembersContainer);

        const bottomContainer = document.createElement("div");
        bottomContainer.className = "dungeon_party_bottom_cont";
        this.partyContainer.appendChild(bottomContainer);

        const leaveButtonContainer = document.createElement("div");
        leaveButtonContainer.className = "dungeon_party_button_cont";
        leaveButtonContainer.onclick = this.leavePressed;
        bottomContainer.appendChild(leaveButtonContainer);

        const leaveButton = document.createElement("img");
        leaveButton.className = "dungeon_party_button";
        leaveButton.src = "assets/img/gui/panels/leave-party-button-border.png";
        leaveButtonContainer.appendChild(leaveButton);

        const leaveText = document.createElement("div");
        leaveText.className = "dungeon_party_button_text";
        leaveText.innerText = "Leave";// window.dungeonz.getTextDef('leave');
        leaveButtonContainer.appendChild(leaveText);

        this.startButtonContainer = document.createElement("div");
        this.startButtonContainer.className = "dungeon_party_button_cont";
        this.startButtonContainer.onclick = this.startPressed;
        bottomContainer.appendChild(this.startButtonContainer);

        const startButton = document.createElement("img");
        startButton.className = "dungeon_party_button";
        startButton.src = "assets/img/gui/panels/buy-button-border-valid.png";
        this.startButtonContainer.appendChild(startButton);

        const startText = document.createElement("div");
        startText.className = "dungeon_party_button_text";
        startText.innerText = "Start";// window.dungeonz.getTextDef('start');
        this.startButtonContainer.appendChild(startText);
    }

    addParty(party) {
        // Don't add the party if this player is in the kicked list.
        if (party.kickedList.some((kickedID) => kickedID === window.gameScene.player.entityId)) return;

        // Don't add the party if it is full (unless this player is in it).
        if (party.members.length
            === window.dungeonz.DungeonPrompts[this.dungeonPortal.dungeonManagerID].maxPlayers) {
            // Check the player is in the full party. If not, don't add it.
            if (party.members.includes((member) => member.id === window.gameScene.player.entityId)
                === false) {
                return;
            }
        }

        // TODO: add logic for clan membership, don't continue if not in same clan
        this.partySlots[party.id] = new PartySlot(
            this,
            party.id,
            party.members[0].displayName,
            this.dungeonPortal.dungeonManagerID,
        );
    }

    addPartyMember(index, member, isLeader) {
        this.partyMemberSlots[index] = new PartyMemberSlot(this, index, member, isLeader);
    }

    removeParties() {
        for (const key in this.partySlots) {
            if (this.partySlots.hasOwnProperty(key)) {
                this.partySlots[key].container.remove();
                delete this.partySlots[key];
            }
        }
    }

    removePartyMembers() {
        for (const key in this.partyMemberSlots) {
            if (this.partyMemberSlots.hasOwnProperty(key)) {
                this.partyMemberSlots[key].container.remove();
                delete this.partyMemberSlots[key];
            }
        }
    }

    updateParties(parties) {
        // console.log("parties?:", parties);
        // If this player is in any of the parties, show the party screen.
        const party = parties.find((p) => p.members.some((member) => member.id === window.gameScene.player.entityId));

        if (party) {
            // Show the party members list.
            this.partySelectionContainer.style.display = "none";
            this.partyContainer.style.display = "grid";

            // Update the member count.
            this.partyPlayerCountText.innerText = `Party: ${party.members.length}/${this.maxPlayersText.innerText}`;

            // If this player is the party leader, show the start button.
            if (party.members[0].id === window.gameScene.player.entityId) {
                this.startButtonContainer.style.visibility = "visible";
            }
            else {
                this.startButtonContainer.style.visibility = "hidden";
            }

            // Clear all of the existing member slots.
            this.removePartyMembers();

            const isLeader = party.members[0].id === window.gameScene.player.entityId;
            // Add a slot for each member.
            party.members.forEach((member, index) => {
                this.addPartyMember(index, member, isLeader);
            });
        }
        else {
            // Show the party selection list.
            this.partySelectionContainer.style.display = "grid";
            this.partyContainer.style.display = "none";

            // Clear all of the existing party slots.
            this.removeParties();

            // Add a slot for each party.
            parties.forEach((p) => {
                this.addParty(p);
            });
        }
    }

    createPressed() {
        const panel = window.gameScene.GUI.dungeonPanel;
        const { dungeonPortal } = panel;

        // Check if the player has enough glory.
        if (window.gameScene.player.glory
            >= window.dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID].gloryCost) {
            // Attempt to start the dungeon. Send the server the ID of the dungeon manager, and position of the portal to enter through.
            window.window.ws.sendEvent("create_dungeon_party", {
                dungeonID: dungeonPortal.dungeonManagerID,
                row: dungeonPortal.row,
                col: dungeonPortal.col,
            });
        }
    }

    startPressed() {
        const panel = window.gameScene.GUI.dungeonPanel;
        const { dungeonPortal } = panel;

        // Check if the player has enough glory.
        if (window.gameScene.player.glory
            >= window.dungeonz.DungeonPrompts[panel.dungeonPortal.dungeonManagerID].gloryCost) {
            // Attempt to start the dungeon. Send the server the ID of the dungeon manager, and position of the portal to enter through.
            window.window.ws.sendEvent("start_dungeon", {
                dungeonID: dungeonPortal.dungeonManagerID,
                row: dungeonPortal.row,
                col: dungeonPortal.col,
            });
        }
    }

    leavePressed() {
        const panel = window.gameScene.GUI.dungeonPanel;
        panel.leaveParty();
    }

    leaveParty() {
        // Don't bother if they aren't interacting with a dungeon portal.
        if (!window.gameScene.GUI.dungeonPanel.dungeonPortal) return;

        window.window.ws.sendEvent("leave_dungeon_party", {
            dungeonID: window.gameScene.GUI.dungeonPanel.dungeonPortal.dungeonManagerID,
        });
    }
}

export default DungeonPanel;
