
import PanelTemplate from "./PanelTemplate";

class Tab {
    /**
     *
     * @param {BankPanel} bankPanel - The bank panel to add this tab to.
     * @param {Number} number - The index of this tab in the list of tabs.
     */
    constructor (bankPanel, number) {
        this.container = document.createElement('div');
        this.container.className = 'bank_tab_cont';
        this.container.draggable = false;
        bankPanel.tabsContainer.appendChild(this.container);

        this.button = document.createElement('img');
        this.button.src = 'assets/img/gui/panels/bank-tab-' + number + '-button-inactive.png';
        this.button.className = 'bank_tab_button';
        this.container.appendChild(this.button);

        // Add the tab click event.
        this.container.onclick = bankPanel.tabClick;
        // Store the number of this tab on the tab itself.
        this.container.setAttribute('tabNumber', number);
    }
}

class Slot {
    /**
     *
     * @param {BankPanel} bankPanel - The bank panel to add this tab to.
     * @param {Number} slotIndex - The index of this slot in the bank contents.
     */
    constructor (bankPanel, slotIndex) {
        this.icon = document.createElement('img');
        this.icon.src = 'assets/img/gui/items/icon-dungium-ore.png';
        this.icon.className = 'bank_slot_icon';
        this.icon.draggable = false;

        this.durability = document.createElement('img');
        this.durability.src = 'assets/img/gui/hud/durability-meter-10.png';
        this.durability.className = 'bank_slot_durability';
        this.durability.draggable = false;

        this.container = document.createElement('div');
        this.container.className = 'bank_slot_cont';
        this.container.draggable = true;

        this.container.appendChild(this.icon);
        this.container.appendChild(this.durability);

        bankPanel.bankSlots.appendChild(this.container);

        // Withdraw the item from the bank when it is clicked on.
        this.container.onclick =        bankPanel.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover =    bankPanel.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout =     bankPanel.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart =    bankPanel.slotDragStart;
        this.container.ondragend =      bankPanel.slotDragEnd;
        this.container.ondragenter =    bankPanel.slotDragEnter;
        this.container.ondrop =         bankPanel.slotDrop;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotIndex', slotIndex);

    }

    refreshBackground () {
        // Need to do 1* to convert string number into an actual number, otherwise they would be concatenated.
        const relativeSlotIndex = 1*this.container.getAttribute('slotIndex') + _this.player.bankManager.selectedTabSlotIndexOffset;

        // Only give a white background back to the bank slots that have something in them.
        if(_this.player.bankManager.items[relativeSlotIndex].catalogueEntry === null){
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;
        }
        else {
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;
        }
    }

    loadItem () {
        const relativeSlotIndex = 1*this.container.getAttribute('slotIndex') + _this.player.bankManager.selectedTabSlotIndexOffset;
        /** @type {BankItem} */
        const bankItem = _this.player.bankManager.items[relativeSlotIndex];
        // Check there is anything in this slot.
        if(bankItem.catalogueEntry !== null){
            // Change the source image for the icon.
            this.icon.src = "assets/img/gui/items/" + bankItem.catalogueEntry.iconSource + ".png";
            this.icon.style.visibility = "visible";

            // Make the background look occupied.
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;

            if(bankItem.durability !== null){
                this.durability.style.visibility = "visible";
                // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
                const meterNumber = Math.floor((bankItem.durability / bankItem.maxDurability) * 10);
                this.durability.src = "assets/img/gui/hud/durability-meter-" + meterNumber + ".png";
            }
            else {
                this.durability.style.visibility = "hidden";
            }

        }
        // Nothing in that slot.
        else {
            this.icon.style.visibility = "hidden";
            this.durability.style.visibility = "hidden";
            // Make the background look empty.
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;
        }
    }
}

class BankPanel extends PanelTemplate {

    constructor () {
        super(document.getElementById('bank_panel'), 500, 320, dungeonz.getTextDef('Bank panel: name'), 'gui/panels/bank-chest');

        this.innerContainer = document.createElement('div');
        this.innerContainer.id = 'bank_inner_cont';
        this.innerContainer.ondrop = function (event) {
            // Stop items from being accidentally dropped to the ground if the drag drop wasn't over a valid slot.
            event.stopPropagation();
        };
        this.contentsContainer.appendChild(this.innerContainer);

        this.tabsContainer = document.createElement('div');
        this.tabsContainer.id = 'bank_tabs_cont';
        this.innerContainer.appendChild(this.tabsContainer);

        const spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        this.innerContainer.appendChild(spacer);

        this.tabs = {
            1: new Tab(this, 1),
            2: new Tab(this, 2),
            3: new Tab(this, 3),
            4: new Tab(this, 4),
        };
        // Make the first tab look active, as that is what is loaded by default.
        this.tabs["1"].button.src = 'assets/img/gui/panels/bank-tab-1-button-active.png';

        this.bankSlots = document.createElement('div');
        this.bankSlots.id = 'bank_contents';
        this.innerContainer.appendChild(this.bankSlots);

        this.slots = [];

        // Create some slots.
        for(let i=0; i<15; i+=1){
            this.slots.push(new Slot(this, i));
        }

        this.tooltip = document.createElement('div');
        this.tooltip.id = 'bank_tooltip';
        this.topContainer.appendChild(this.tooltip);

    }

    show () {
        // Show the panel.
        super.show();

        _this.GUI.isAnyPanelOpen = true;

        /** @type {Slot[]} */
        const slots = this.slots;

        for(let i=0; i<slots.length; i+=1){
            //console.log("showing item:", slots[i]);
            slots[i].loadItem();
        }

        // Show the add buttons on the inventory bar.
        _this.GUI.inventoryBar.showAddButtons();
    }

    hide () {
        // Hide the panel.
        super.hide();
        this.tooltip.style.visibility = 'hidden';

        _this.GUI.isAnyPanelOpen = false;

        // Hide the contents.
        for(let i=0; i<this.slots.length; i+=1){
            const slot = this.slots[i];
            slot.icon.style.visibility = "hidden";
            slot.durability.style.visibility = "hidden";
        }

        // Hide the add buttons on the inventory bar.
        _this.GUI.inventoryBar.hideAddButtons();
    }

    tabClick () {
        const tabNumber = this.getAttribute('tabNumber');
        _this.player.bankManager.loadTab(tabNumber);
        const tabs = _this.GUI.bankPanel.tabs;
        // Make the all tabs look inactive.
        tabs[1].button.src = 'assets/img/gui/panels/bank-tab-1-button-inactive.png';
        tabs[2].button.src = 'assets/img/gui/panels/bank-tab-2-button-inactive.png';
        tabs[3].button.src = 'assets/img/gui/panels/bank-tab-3-button-inactive.png';
        tabs[4].button.src = 'assets/img/gui/panels/bank-tab-4-button-inactive.png';
        // Make the selected tab look active.
        tabs[tabNumber].button.src = 'assets/img/gui/panels/bank-tab-' + tabNumber + '-button-active.png';
    }

    slotClick () {
        //console.log("slot clicked:", this.getAttribute('slotIndex'));
        const relativeSlotIndex = 1*this.getAttribute('slotIndex') + _this.player.bankManager.selectedTabSlotIndexOffset;
        // Multiply by the selected tab number, to get the slot index of the right tab, otherwise it is just 0-14 and will only access the first tab.
        _this.player.bankManager.withdrawItem(relativeSlotIndex);
    }

    slotMouseOver () {
        const relativeSlotIndex = 1*this.getAttribute('slotIndex') + _this.player.bankManager.selectedTabSlotIndexOffset;
        /** @type {BankItem} */
        const bankSlot = _this.player.bankManager.items[relativeSlotIndex];
        // If the slot is empty, don't show the tooltip.
        if(bankSlot.catalogueEntry === null) return;

        const bankPanel = _this.GUI.bankPanel;

        bankPanel.tooltip.innerText = dungeonz.getTextDef("Item name: " + bankSlot.catalogueEntry.translationID);
        bankPanel.tooltip.style.visibility = 'visible';

        bankPanel.slots[this.getAttribute('slotIndex')].container.appendChild(bankPanel.tooltip);
    }

    slotMouseOut () {
        _this.GUI.bankPanel.tooltip.style.visibility = 'hidden';
    }

    slotDragStart (event) {
        //console.log("this:", this);
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();

        const slotIndex = this.getAttribute('slotIndex');
        const relativeSlotIndex = 1*slotIndex + _this.player.bankManager.selectedTabSlotIndexOffset;

        // Don't bother doing a drag if there is nothing in this slot.
        if(_this.player.bankManager.items[relativeSlotIndex].catalogueEntry === null){
            event.preventDefault();
            return;
        }

        const icon = _this.GUI.bankPanel.slots[slotIndex].icon;
        //console.log("icon:", icon);
        event.dataTransfer.setData('text/plain', null);
        _this.GUI.dragData = {
            dragOrigin: _this.GUI.bankPanel.bankSlots,
            bankSlot: _this.GUI.bankPanel.slots[slotIndex].container
        };
        event.dataTransfer.setDragImage(icon, icon.width/2, icon.height/2);

        // Highlight the bank panel slots, to show that slots can be swapped within the bank panel.
        const bankGUISlots = _this.GUI.bankPanel.slots;
        for(let i=0, len=bankGUISlots.length; i<len; i+=1){
            bankGUISlots[i].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }

        // Highlight the inventory bar slots, to show that bank slots can be moved to the inventory bar.
        const inventoryGUISlots = _this.GUI.inventoryBar.slots;
        for(let slotKey in inventoryGUISlots){
            if(inventoryGUISlots.hasOwnProperty(slotKey) === false) continue;
            inventoryGUISlots[slotKey].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }

        this.style.backgroundColor = _this.GUI.GUIColours.currentlyDragged;
    }

    slotDragEnter (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        //console.log("slot drag enter");
    }

    slotDrop (event) {
        const thisSlotIndex = this.getAttribute('slotIndex');
        event.preventDefault();
        event.stopPropagation();
        // Only add an item to the bank if it was dropped from the inventory bar.
        if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
            const relativeSlotIndex = 1*thisSlotIndex + _this.player.bankManager.selectedTabSlotIndexOffset;
            _this.player.bankManager.depositItem(_this.GUI.dragData.inventorySlot.slotKey, relativeSlotIndex);
        }
        else if(_this.GUI.dragData.dragOrigin === _this.GUI.bankPanel.bankSlots){
            const otherSlotIndex = _this.GUI.dragData.bankSlot.getAttribute('slotIndex');
            _this.player.bankManager.swapSlots(otherSlotIndex, thisSlotIndex);
        }
        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;
        // Reset the highlighted bank slots.
        const bankSlots = _this.GUI.bankPanel.slots;
        for(let i=0, len=bankSlots.length; i<len; i+=1){
            bankSlots[i].refreshBackground();
        }
    }

    slotDragEnd (event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        const bankSlots = _this.GUI.bankPanel.slots;
        for(let i=0, len=bankSlots.length; i<len; i+=1){
            bankSlots[i].refreshBackground();
        }
        // And the inventory bar slots.
        const inventorySlots = _this.GUI.inventoryBar.slots;
        for(let slotKey in inventorySlots){
            if(inventorySlots.hasOwnProperty(slotKey) === false) continue;
            inventorySlots[slotKey].container.style.backgroundColor = "transparent";
        }
        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;
    }

}

export default BankPanel;