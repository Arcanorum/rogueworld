
import PanelTemplate from "./PanelTemplate";

class DungeonPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('dungeon_panel'), 440, 420, dungeonz.getTextDef('Dungeon'), 'gui/panels/dungeon-portal');

        const innerContainer = document.createElement('div');
        innerContainer.id = 'dungeon_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        this.dungeonName = document.createElement('div');
        this.dungeonName.id = 'dungeon_name';
        this.dungeonName.innerText = "";
        innerContainer.appendChild(this.dungeonName);

        let spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        innerContainer.appendChild(spacer);

        const detailsContainer = document.createElement('div');
        detailsContainer.id = 'dungeon_details_cont';
        innerContainer.appendChild(detailsContainer);

        // Difficulty.
        const difficultyContainer = document.createElement('div');
        difficultyContainer.className = "dungeon_details_cont_item";
        detailsContainer.appendChild(difficultyContainer);

        const difficultyHeading = document.createElement('div');
        difficultyHeading.className = 'dungeon_details_heading';
        difficultyHeading.innerText = dungeonz.getTextDef('Difficulty') + ":";
        difficultyContainer.appendChild(difficultyHeading);

        this.difficultyText = document.createElement('div');
        this.difficultyText.className = 'dungeon_details_text';
        this.difficultyText.innerText = 'Hardcore';
        difficultyContainer.appendChild(this.difficultyText);

        spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        detailsContainer.appendChild(spacer);

        // Glory cost.
        const costContainer = document.createElement('div');
        costContainer.className = "dungeon_details_cont_item";
        detailsContainer.appendChild(costContainer);

        const costHeading = document.createElement('div');
        costHeading.className = 'dungeon_details_heading';
        costHeading.innerText = dungeonz.getTextDef('Entry cost') + ":";
        costContainer.appendChild(costHeading);

        const costInnerContainer = document.createElement('div');
        costInnerContainer.id = 'dungeon_cost_cont';
        costContainer.appendChild(costInnerContainer);

        const costGloryIcon = document.createElement('img');
        costGloryIcon.id = 'dungeon_cost_icon';
        costGloryIcon.src = 'assets/img/gui/hud/glory-icon.png';
        costInnerContainer.appendChild(costGloryIcon);

        this.costText = document.createElement('div');
        this.costText.className = 'dungeon_details_text';
        this.costText.innerText = "1234";
        costInnerContainer.appendChild(this.costText);

        spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        detailsContainer.appendChild(spacer);

        // Max players.
        const maxPlayersContainer = document.createElement('div');
        maxPlayersContainer.className = "dungeon_details_cont_item";
        detailsContainer.appendChild(maxPlayersContainer);

        const maxPlayersHeading = document.createElement('div');
        maxPlayersHeading.className = 'dungeon_details_heading';
        maxPlayersHeading.innerText = "Max players:"; //dungeonz.getTextDef('Max players') + ":";
        maxPlayersContainer.appendChild(maxPlayersHeading);
        
        this.maxPlayersText = document.createElement('div');
        this.maxPlayersText.className = 'dungeon_details_text';
        this.maxPlayersText.innerText = "6";
        maxPlayersContainer.appendChild(this.maxPlayersText);

        spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        innerContainer.appendChild(spacer);
        
        // The contextual lists of parties or members.
        this.listsContainer = document.createElement('div');
        this.listsContainer.classList = 'dungeon_lists_cont';
        innerContainer.appendChild(this.listsContainer);

        this.addPartySelectionContainer(this.listsContainer);

        this.addPartyContainer(this.listsContainer);

    }

    addPartySelectionContainer (container) {
        // The list of available parties to join.
        this.partySelectionContainer = document.createElement('div');
        this.partySelectionContainer.id = 'dungeon_party_selection_cont';
        container.appendChild(this.partySelectionContainer);

        const partiesHeading = document.createElement('div');
        partiesHeading.innerText = "Parties:"
        this.partySelectionContainer.appendChild(partiesHeading);

        this.partiesContainer = document.createElement('div');
        this.partiesContainer.id = 'dungeon_parties_cont';
        this.partySelectionContainer.appendChild(this.partiesContainer)

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'dungeon_bottom_cont';
        this.partySelectionContainer.appendChild(bottomContainer);

        const createButtonContainer = document.createElement('div');
        createButtonContainer.id = 'dungeon_create_button_cont';
        createButtonContainer.className = 'centered';
        createButtonContainer.onclick = this.createPressed;
        bottomContainer.appendChild(createButtonContainer);

        this.createButton = document.createElement('img');
        this.createButton.id = 'dungeon_create_button';
        this.createButton.className = 'centered';
        this.createButton.src = 'assets/img/gui/panels/buy-button-border-invalid.png';
        createButtonContainer.appendChild(this.createButton);

        const createText = document.createElement('div');
        createText.className = 'centered dungeon_button_text';
        createText.innerText = 'Create'; // dungeonz.getTextDef('Create');
        createButtonContainer.appendChild(createText);
    }

    addPartyContainer (container) {
        // The party the player is currently in.
        this.partyContainer = document.createElement('div');
        container.appendChild(this.partyContainer);

        this.partyPlayerCountText = document.createElement('div');
        this.partyPlayerCountText.className = "dungeon_party_player_count_text";
        this.partyPlayerCountText.innerText = "Party: 2/6";
        this.partyContainer.appendChild(this.partyPlayerCountText);
        
        this.partyMembersContainer = document.createElement('div');
        this.partyContainer.appendChild(this.partyMembersContainer);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'dungeon_bottom_cont';
        this.partyContainer.appendChild(bottomContainer);

        const enterButtonContainer = document.createElement('div');
        enterButtonContainer.id = 'dungeon_enter_button_cont';
        enterButtonContainer.className = 'centered';
        enterButtonContainer.onclick = this.enterPressed;
        bottomContainer.appendChild(enterButtonContainer);

        this.enterButton = document.createElement('img');
        this.enterButton.id = 'dungeon_enter_button';
        this.enterButton.className = 'centered';
        this.enterButton.src = 'assets/img/gui/panels/buy-button-border-invalid.png';
        enterButtonContainer.appendChild(this.enterButton);

        const enterText = document.createElement('div');
        enterText.id = 'dungeon_enter_text';
        enterText.className = 'centered';
        enterText.innerText = dungeonz.getTextDef('Enter');
        enterButtonContainer.appendChild(enterText);
    }

    /**
     * @param {DungeonPortal} dungeonPortal - The static tile entity of the dungeon portal that was interacted with.
     */
    show (dungeonPortal) {
        console.log("dung port:", dungeonPortal);
        super.show();
        _this.GUI.isAnyPanelOpen = true;
        const prompt = dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID];
        this.dungeonName.innerText = dungeonz.getTextDef(prompt.nameDefinitionID);
        this.difficultyText.innerText = dungeonz.getTextDef(prompt.difficulty);
        this.costText.innerText = prompt.gloryCost;
        this.maxPlayersText.innerText = prompt.maxPlayers;

        this.partySelectionContainer.style.visibility = "visible";
        this.partyContainer.style.visibility = "hidden";

        // Request the current list of available parties for this dungeon.
        ws.sendEvent('get_parties', dungeonPortal.dungeonManagerID);

        this.getPartiesLoop = setInterval(function () {
            ws.sendEvent('get_parties', dungeonPortal.dungeonManagerID);
        }, 5000);

        // If they have the entry cost, show the button as valid.
        if(_this.player.glory >= dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID].gloryCost){
            this.enterButton.src = 'assets/img/gui/panels/buy-button-border-valid.png';
        }
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;

        clearInterval(this.getPartiesLoop);
    }

    updateParties (parties) {
        console.log("update dung panel parties:", parties);
    }

    createPressed () {
        // Check if the player has enough glory.
        if(_this.player.glory >= dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID].gloryCost){
            // Attempt to start the dungeon. Send the server the ID of the dungeon manager, and position of the portal to enter through.
            window.ws.sendEvent('start_dungeon', {
                dungeonID: dungeonPortal.dungeonManagerID,
                row: dungeonPortal.row,
                col: dungeonPortal.col
            });
        }
    }

    enterPressed (dungeonPortal) {
        // Check if the player has enough glory.
        if(_this.player.glory >= dungeonz.DungeonPrompts[dungeonPortal.dungeonManagerID].gloryCost){
            // Attempt to start the dungeon. Send the server the ID of the dungeon manager, and position of the portal to enter through.
            window.ws.sendEvent('start_dungeon', {
                dungeonID: dungeonPortal.dungeonManagerID,
                row: dungeonPortal.row,
                col: dungeonPortal.col
            });
        }

        // Hide the panel.
        _this.GUI.dungeonPanel.hide();
    }

    
}

export default DungeonPanel;