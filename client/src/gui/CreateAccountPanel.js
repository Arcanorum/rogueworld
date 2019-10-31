
import PanelTemplate from "./PanelTemplate";

class CreateAccountPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('create_account_panel'), 440, 420, 'Create account' /*dungeonz.getTextDef('Create account panel: name')*/, 'gui/hud/exit-icon');

        const innerContainer = document.createElement('div');
        innerContainer.id = 'create_account_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        const topInfoContainer = document.createElement('div');
        topInfoContainer.id = 'create_account_top_info_cont';
        topInfoContainer.innerText = "Choose a username and password to save this character so you can log in later."; //dungeonz.getTextDef('Create_account game panel: info 1');
        innerContainer.appendChild(topInfoContainer);

        this.usernameInput = document.createElement('input');
        this.usernameInput.type = 'text';
        this.usernameInput.maxLength = 20;
        this.usernameInput.id = 'create_account_username_input';
        this.usernameInput.className = 'create_account_input';
        this.usernameInput.placeholder = 'Enter a username';// dungeonz.getTextDef('Username');
        innerContainer.appendChild(this.usernameInput);

        this.passwordInput = document.createElement('input');
        this.passwordInput.type = 'password';
        this.passwordInput.maxLength = 20;
        this.passwordInput.id = 'create_account_password_input';
        this.passwordInput.className = 'create_account_input';
        this.passwordInput.placeholder = 'Enter a password';// dungeonz.getTextDef('Password');
        innerContainer.appendChild(this.passwordInput);

        const createAccountButtonContainer = document.createElement('div');
        createAccountButtonContainer.className = 'create_account_button_cont';
        createAccountButtonContainer.onclick = this.createAccountPressed.bind(this);
        innerContainer.appendChild(createAccountButtonContainer);

        this.warningText = document.createElement('div');
        this.warningText.className = 'create_account_button_cont';
        this.warningText.innerText = "This is some warning next, username taken";
        innerContainer.appendChild(createAccountButtonContainer);

        this.createAccountButton = document.createElement('img');
        this.createAccountButton.className = 'create_account_button';
        this.createAccountButton.src = 'assets/img/gui/panels/save-code-button-border-inactive.png';
        createAccountButtonContainer.appendChild(this.createAccountButton);

        this.createAccountText = document.createElement('div');
        this.createAccountText.className = 'create_account_button_text';
        this.createAccountText.innerText = 'Create account';// dungeonz.getTextDef('Create_account game panel: create account');
        createAccountButtonContainer.appendChild(this.createAccountText);

        this.warningText = document.createElement('div');
        this.warningText.id = "create_account_warning_text";
        this.warningText.innerText = 'Username taken';
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

    async createAccountPressed () {
        console.log("create account pressed");

        // Check username and password are valid.
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;
        if(username === "") return;
        if(password === "") return;

        const hash = await digestMessage(password); // Encrypt the password before sending.
        window.ws.sendEvent("create_account", {
            username: this.usernameInput.value,
            password: hash
        });
    }

}

export default CreateAccountPanel;