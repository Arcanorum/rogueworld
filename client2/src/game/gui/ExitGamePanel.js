import PanelTemplate from "./PanelTemplate";

class ExitGamePanel extends PanelTemplate {
    constructor() {
        super(document.getElementById("exit_game_panel"), 440, 420,
            window.dungeonz.getTextDef("Exit game panel: name"), "gui/hud/exit-icon");

        const innerContainer = document.createElement("div");
        innerContainer.id = "exit_inner_cont";
        this.contentsContainer.appendChild(innerContainer);

        const topInfoContainer = document.createElement("div");
        topInfoContainer.id = "exit_top_info_cont";
        topInfoContainer.innerText = window.dungeonz.getTextDef("Exit game panel: info 1");
        innerContainer.appendChild(topInfoContainer);

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.maxLength = 20;
        usernameInput.id = "exit_username_input";
        usernameInput.className = "exit_input";
        usernameInput.placeholder = "Enter a username";// window.dungeonz.getTextDef('Username');
        innerContainer.appendChild(usernameInput);

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.maxLength = 20;
        passwordInput.id = "exit_password_input";
        passwordInput.className = "exit_input";
        passwordInput.placeholder = "Enter a password";// window.dungeonz.getTextDef('Password');
        innerContainer.appendChild(passwordInput);

        const createAccountButtonContainer = document.createElement("div");
        createAccountButtonContainer.className = "exit_button_cont";
        createAccountButtonContainer.onclick = this.createAccountPressed;
        innerContainer.appendChild(createAccountButtonContainer);

        this.createAccountButton = document.createElement("img");
        this.createAccountButton.className = "exit_button";
        this.createAccountButton.src = "assets/img/gui/panels/save-code-button-border-inactive.png";
        createAccountButtonContainer.appendChild(this.createAccountButton);

        this.createAccountText = document.createElement("div");
        this.createAccountText.className = "exit_button_text";
        this.createAccountText.innerText = "Create account";// window.dungeonz.getTextDef('Exit game panel: create account');
        createAccountButtonContainer.appendChild(this.createAccountText);

        const bottomInfoContainer = document.createElement("div");
        bottomInfoContainer.id = "exit_bottom_info_cont";
        innerContainer.appendChild(bottomInfoContainer);

        const exitWarningHeading = document.createElement("div");
        exitWarningHeading.id = "exit_warning_heading";
        exitWarningHeading.innerText = window.dungeonz.getTextDef("Enter dungeon warning heading");
        bottomInfoContainer.appendChild(exitWarningHeading);

        const exitWarning = document.createElement("div");
        exitWarning.id = "exit_warning_text";
        exitWarning.innerText = window.dungeonz.getTextDef("Exit game panel: info 2");
        bottomInfoContainer.appendChild(exitWarning);

        const exitButtonContainer = document.createElement("div");
        exitButtonContainer.className = "exit_button_cont";
        exitButtonContainer.onclick = this.exitPressed;
        innerContainer.appendChild(exitButtonContainer);

        const exitButton = document.createElement("img");
        exitButton.className = "exit_button";
        exitButton.src = "assets/img/gui/panels/exit-game-button-border.png";
        exitButtonContainer.appendChild(exitButton);

        const exitGameText = document.createElement("div");
        exitGameText.className = "exit_button_text";
        exitGameText.innerText = window.dungeonz.getTextDef("Exit game panel: exit");
        exitButtonContainer.appendChild(exitGameText);
    }

    show() {
        super.show();
        window.gameScene.GUI.isAnyPanelOpen = true;
    }

    hide() {
        super.hide();
        window.gameScene.GUI.isAnyPanelOpen = false;
    }

    createAccountPressed() {

    }

    /* saveCodePressed () {
        // Save the code to the client local storage.
        localStorage.setItem('continue_code', window.gameScene.GUI.exitGamePanel.codeContainer.innerText);

        // Make the button look pressed.
        window.gameScene.GUI.exitGamePanel.saveCodeText.innerText = window.dungeonz.getTextDef('Exit game panel: saved');
        window.gameScene.GUI.exitGamePanel.saveCodeButton.src = "assets/img/gui/panels/save-code-button-border-active.png";
    } */

    exitPressed() {
        // Reload the page.
        location.reload();
    }
}

export default ExitGamePanel;
