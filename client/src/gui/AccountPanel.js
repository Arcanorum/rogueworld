
import PanelTemplate from "./PanelTemplate";

class AccountPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('account_panel'), 440, 320, 'Account' /*dungeonz.getTextDef('Account panel: name')*/, 'gui/hud/exit-icon');

        const innerContainer = document.createElement('div');
        innerContainer.id = 'account_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        const topInfoContainer = document.createElement('div');
        topInfoContainer.id = 'account_top_info_cont';
        topInfoContainer.innerText = 'Change password:';// dungeonz.getTextDef('Account game panel: info 1');
        innerContainer.appendChild(topInfoContainer);

        const currentPasswordInput = document.createElement('input');
        currentPasswordInput.type = 'password';
        currentPasswordInput.maxLength = 20;
        currentPasswordInput.id = 'account_username_input';
        currentPasswordInput.className = 'account_input';
        currentPasswordInput.placeholder = 'Current password';// dungeonz.getTextDef('Username');
        innerContainer.appendChild(currentPasswordInput);

        const newPasswordInput = document.createElement('input');
        newPasswordInput.type = 'password';
        newPasswordInput.maxLength = 20;
        newPasswordInput.id = 'account_password_input';
        newPasswordInput.className = 'account_input';
        newPasswordInput.placeholder = 'New password';// dungeonz.getTextDef('Password');
        innerContainer.appendChild(newPasswordInput);

        const acceptButtonContainer = document.createElement('div');
        acceptButtonContainer.className = 'account_accept_button_cont';
        acceptButtonContainer.onclick = this.acceptPressed;
        innerContainer.appendChild(acceptButtonContainer);

        this.acceptButton = document.createElement('img');
        this.acceptButton.className = 'account_accept_button';
        this.acceptButton.src = 'assets/img/gui/panels/save-code-button-border-inactive.png';
        acceptButtonContainer.appendChild(this.acceptButton);

        this.acceptText = document.createElement('div');
        this.acceptText.className = 'account_accept_button_text';
        this.acceptText.innerText = 'Accept';// dungeonz.getTextDef('Account game panel: create account');
        acceptButtonContainer.appendChild(this.acceptText);

        this.warningText = document.createElement('div');
        this.warningText.id = "account_warning_text";
        this.warningText.innerText = 'Password changed';
        innerContainer.appendChild(this.warningText);

    }

    show () {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
    }

    acceptPressed () {
        console.log("accept pressed");
    }
}

export default AccountPanel;