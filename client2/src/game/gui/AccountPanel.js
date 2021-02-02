import PanelTemplate from "./PanelTemplate";
import Utils from "../../shared/Utils";

const { digestMessage } = Utils;

class AccountPanel extends PanelTemplate {
    constructor() {
        super(document.getElementById("account_panel"), 440, 340,
            window.dungeonz.getTextDef("Account panel: name"), "gui/hud/exit-icon");

        const innerContainer = document.createElement("div");
        innerContainer.id = "account_inner_cont";
        this.contentsContainer.appendChild(innerContainer);

        const topInfoContainer = document.createElement("div");
        topInfoContainer.id = "account_top_info_cont";
        topInfoContainer.innerText = window.dungeonz.getTextDef("Account panel: info");
        innerContainer.appendChild(topInfoContainer);

        this.currentPasswordInput = document.createElement("input");
        this.currentPasswordInput.type = "password";
        this.currentPasswordInput.maxLength = 20;
        this.currentPasswordInput.id = "account_username_input";
        this.currentPasswordInput.className = "account_input";
        this.currentPasswordInput.placeholder = window.dungeonz.getTextDef("Current password");
        innerContainer.appendChild(this.currentPasswordInput);

        this.newPasswordInput = document.createElement("input");
        this.newPasswordInput.type = "password";
        this.newPasswordInput.maxLength = 20;
        this.newPasswordInput.id = "account_password_input";
        this.newPasswordInput.className = "account_input";
        this.newPasswordInput.placeholder = window.dungeonz.getTextDef("New password");
        innerContainer.appendChild(this.newPasswordInput);

        const acceptButtonContainer = document.createElement("div");
        acceptButtonContainer.className = "account_accept_button_cont";
        acceptButtonContainer.onclick = this.acceptPressed.bind(this);
        innerContainer.appendChild(acceptButtonContainer);

        this.acceptButton = document.createElement("img");
        this.acceptButton.className = "account_accept_button";
        this.acceptButton.src = "assets/img/gui/panels/save-code-button-border-inactive.png";
        acceptButtonContainer.appendChild(this.acceptButton);

        this.acceptText = document.createElement("div");
        this.acceptText.className = "account_accept_button_text";
        this.acceptText.innerText = window.dungeonz.getTextDef("Accept");
        acceptButtonContainer.appendChild(this.acceptText);

        this.warningText = document.createElement("div");
        this.warningText.id = "account_warning_text";
        this.warningText.innerText = "Password changed";
        this.warningText.style.visibility = "hidden";
        innerContainer.appendChild(this.warningText);
    }

    show() {
        super.show();
        window.gameScene.GUI.isAnyPanelOpen = true;
    }

    hide() {
        super.hide();
        window.gameScene.GUI.isAnyPanelOpen = false;
        this.currentPasswordInput.value = "";
        this.newPasswordInput.value = "";
        this.warningText.innerHTML = "";
        this.warningText.style.visibility = "hidden";
    }

    async acceptPressed() {
        console.log("* Reset password pressed.");

        // Check the current and new passwords are valid.
        const currentPassword = this.currentPasswordInput.value;
        const newPassword = this.newPasswordInput.value;
        if (currentPassword === "") return;
        if (newPassword === "") return;

        // Encrypt the passwords before sending.
        const currentHash = await digestMessage(currentPassword);
        const newHash = await digestMessage(newPassword);

        window.window.ws.sendEvent("change_password", {
            currentPassword: currentHash,
            newPassword: newHash,
        });
    }
}

export default AccountPanel;
