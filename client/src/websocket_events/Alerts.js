import ChatWarnings from "../catalogues/ChatWarnings";

export default (eventResponses) => {

    eventResponses.create_account_success = () => {
        Utils.message("create_account_success");
        // Hide the create account panel.
        _this.GUI.createAccountPanel.hide();

        _this.player.isLoggedIn = true;

        _this.GUI.accountPanel.show();
    };

    eventResponses.chat_warning = (data) => {
        _this.chat(undefined, dungeonz.getTextDef(ChatWarnings[data]), "#ffa54f");
    };

    eventResponses.cannot_drop_here = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Drop item blocked warning"));
    };

    eventResponses.item_broken = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Item broken warning"));
    };

    eventResponses.inventory_full = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Inventory full warning"));
    };

    eventResponses.hatchet_needed = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Hatchet needed warning"));
    };

    eventResponses.pickaxe_needed = () => {
        _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Pickaxe needed warning"));
    };

};