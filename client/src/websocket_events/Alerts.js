import ChatWarnings from "../catalogues/ChatWarnings";
import Utils from "../Utils";

export default (eventResponses) => {

    eventResponses.create_account_success = () => {
        Utils.message("create_account_success");
        // Account created. Switch to the account panel.
        _this.GUI.createAccountPanel.hide();

        _this.player.isLoggedIn = true;

        _this.GUI.accountPanel.show();
    };

    eventResponses.create_account_failure = (data) => {
        Utils.message("create_account_failure:", data);
        if (data) {
            const message = dungeonz.getTextDef(data.messageID);
            _this.GUI.createAccountPanel.warningText.innerText = message;
            _this.GUI.createAccountPanel.warningText.style.visibility = "visible";
        }
    };

    eventResponses.change_password_success = () => {
        Utils.message("change_password_success");
        const message = dungeonz.getTextDef("Password changed");
        _this.GUI.accountPanel.warningText.innerText = message;
        _this.GUI.accountPanel.warningText.style.backgroundColor = "lime";
        _this.GUI.accountPanel.warningText.style.visibility = "visible";
    };

    eventResponses.change_password_failure = (data) => {
        Utils.message("change_password_failure:", data);
        if (data) {
            const message = dungeonz.getTextDef(data.messageID);
            _this.GUI.accountPanel.warningText.innerText = message;
            _this.GUI.accountPanel.warningText.style.backgroundColor = "orange";
            _this.GUI.accountPanel.warningText.style.visibility = "visible";
        }
    };

    eventResponses.chat_warning = (data) => {
        _this.chat(undefined, dungeonz.getTextDef(ChatWarnings[data]), "#ffa54f");
    };

    eventResponses.cannot_drop_here = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Drop item blocked warning"));
    };

    eventResponses.hatchet_needed = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Hatchet needed warning"));
    };

    eventResponses.pickaxe_needed = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Pickaxe needed warning"));
    };

};