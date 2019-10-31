
import PanelTemplate from "./PanelTemplate";

class DungeonPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('dungeon_panel'), 440, 320, dungeonz.getTextDef('Dungeon'), 'gui/panels/dungeon-portal');

        const innerContainer = document.createElement('div');
        innerContainer.id = 'dungeon_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        this.dungeonName = document.createElement('div');
        this.dungeonName.id = 'dungeon_name';
        this.dungeonName.innerText = "West pyramid";
        innerContainer.appendChild(this.dungeonName);

        const infoContainer = document.createElement('div');
        infoContainer.id = 'dungeon_info_cont';
        innerContainer.appendChild(infoContainer);

        const detailsContainer = document.createElement('div');
        detailsContainer.id = 'dungeon_details_cont';
        infoContainer.appendChild(detailsContainer);

        const difficultyHeading = document.createElement('div');
        difficultyHeading.className = 'dungeon_details_heading';
        difficultyHeading.innerText = dungeonz.getTextDef('Difficulty') + ":";
        detailsContainer.appendChild(difficultyHeading);

        this.difficultyText = document.createElement('div');
        this.difficultyText.className = 'dungeon_details_text';
        this.difficultyText.innerText = 'Hardcore';
        detailsContainer.appendChild(this.difficultyText);

        const costHeading = document.createElement('div');
        costHeading.className = 'dungeon_details_heading';
        costHeading.innerText = dungeonz.getTextDef('Entry cost') + ":";
        detailsContainer.appendChild(costHeading);

        const costContainer = document.createElement('div');
        costContainer.id = 'dungeon_cost_cont';
        detailsContainer.appendChild(costContainer);

        const costGloryIcon = document.createElement('img');
        costGloryIcon.id = 'dungeon_cost_icon';
        costGloryIcon.src = 'assets/img/gui/hud/glory-icon.png';
        costContainer.appendChild(costGloryIcon);

        this.costText = document.createElement('div');
        this.costText.className = 'dungeon_details_text';
        this.costText.innerText = "1234";
        costContainer.appendChild(this.costText);

        const warningContainer = document.createElement('div');
        warningContainer.id = 'dungeon_warning_cont';
        infoContainer.appendChild(warningContainer);

        const warningHeading = document.createElement('div');
        warningHeading.id = 'dungeon_warning_heading';
        warningHeading.innerText = dungeonz.getTextDef('Enter dungeon warning heading');
        warningContainer.appendChild(warningHeading);

        const warningText = document.createElement('div');
        warningText.className = 'dungeon_details_text';
        warningText.innerText = dungeonz.getTextDef('Enter dungeon warning message');
        warningContainer.appendChild(warningText);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'dungeon_bottom_cont';
        innerContainer.appendChild(bottomContainer);

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

    show () {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
        const prompt = dungeonz.DungeonPrompts[_this.adjacentDungeonID];
        this.dungeonName.innerText = dungeonz.getTextDef(prompt.nameDefinitionID);
        this.difficultyText.innerText = dungeonz.getTextDef(prompt.difficulty);
        this.costText.innerText = prompt.gloryCost;
        // If they have the entry cost, show the button as valid.
        if(_this.player.glory >= dungeonz.DungeonPrompts[_this.adjacentDungeonID].gloryCost){
            this.enterButton.src = 'assets/img/gui/panels/buy-button-border-valid.png';
        }
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
    }

    enterPressed () {
        // Check if the player has enough glory.
        if(_this.player.glory >= dungeonz.DungeonPrompts[_this.adjacentDungeonID].gloryCost){
            // Attempt to enter the dungeon. Send the server the ID of the dungeon instance.
            window.ws.sendEvent("enter_dungeon", _this.adjacentDungeonID);
        }

        // Hide the panel.
        _this.GUI.dungeonPanel.hide();
    }
}

export default DungeonPanel;