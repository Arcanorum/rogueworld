
import PanelTemplate from "./PanelTemplate";

class RespawnPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('respawn_panel'), 440, 220, dungeonz.getTextDef('You died'), 'gui/hud/respawns-icon', true);

        const innerContainer = document.createElement('div');
        innerContainer.id = 'respawn_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        const mainContainer = document.createElement('div');
        mainContainer.id = 'respawn_main_cont';
        innerContainer.appendChild(mainContainer);

        const respawnInfo = document.createElement('div');
        respawnInfo.id = 'respawn_info';
        respawnInfo.innerText = dungeonz.getTextDef('Respawns remaining');
        mainContainer.appendChild(respawnInfo);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'respawn_bottom_cont';
        innerContainer.appendChild(bottomContainer);

        const respawnButtonContainer = document.createElement('div');
        respawnButtonContainer.id = 'respawn_button_cont';
        respawnButtonContainer.className = 'centered';
        respawnButtonContainer.onclick = this.respawnPressed;
        bottomContainer.appendChild(respawnButtonContainer);

        const respawnButton = document.createElement('img');
        respawnButton.id = 'respawn_button';
        respawnButton.className = 'centered';
        respawnButton.src = 'assets/img/gui/panels/buy-button-border-valid.png';
        respawnButtonContainer.appendChild(respawnButton);

        const respawnText = document.createElement('div');
        respawnText.id = 'respawn_text';
        respawnText.className = 'centered';
        respawnText.innerText = dungeonz.getTextDef('Respawn');
        respawnButtonContainer.appendChild(respawnText);

    }

    show () {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
    }

    respawnPressed () {
        window.ws.sendEvent("respawn");
    }
}

export default RespawnPanel;