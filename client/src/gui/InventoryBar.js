
import RecipeCatalogue from '../catalogues/CraftingRecipes'

class Slot {
    constructor(slotKey, bar) {
        this.icon = document.createElement('img');
        this.icon.src = 'assets/img/gui/items/icon-dungium-ore.png';
        this.icon.className = 'inventory_slot_icon';
        this.icon.draggable = false;

        this.durability = document.createElement('img');
        this.durability.src = 'assets/img/gui/hud/durability-meter-10.png';
        this.durability.className = 'inventory_slot_durability';
        this.durability.draggable = false;

        this.equipped = document.createElement('img');
        this.equipped.src = 'assets/img/gui/hud/clothing-icon.png';
        this.equipped.className = 'inventory_slot_equipped';
        this.equipped.draggable = false;

        this.border = document.createElement('img');
        this.border.src = 'assets/img/gui/hud/inventory-slot-border.png';
        this.border.className = 'inventory_slot_border';
        this.border.draggable = false;

        this.addButton = document.createElement('img');
        this.addButton.src = 'assets/img/gui/hud/inventory-add-item-icon.png';
        this.addButton.className = 'inventory_slot_add_button';
        this.addButton.draggable = false;
        this.addButton.onclick = bar.addClick;
        // Store the key of this slot on the add button itself.
        this.addButton.setAttribute('slotKey', slotKey);

        this.container = document.createElement('div');
        this.container.className = 'inventory_slot';
        this.container.draggable = true;
        // Use the item in this slot when pressed.
        this.container.onclick = bar.click;
        this.container.onmousedown = bar.mouseDown;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover = bar.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout = bar.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart = bar.slotDragStart;
        this.container.ondragend = bar.slotDragEnd;
        this.container.ondragenter = bar.slotDragEnter;
        this.container.ondragleave = bar.slotDragLeave;
        this.container.ondragover = bar.slotDragOver;
        this.container.ondrop = bar.slotDrop;

        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotKey', slotKey);

        this.container.appendChild(this.icon);
        this.container.appendChild(this.durability);
        this.container.appendChild(this.equipped);
        this.container.appendChild(this.border);
        this.container.appendChild(this.addButton);

        bar.slotContainer.appendChild(this.container);
    }

    refreshAddButton() {
        // Show the add button if any of the relevant panels are open.
        if (_this.GUI.bankPanel.isOpen === true) {
            this.addButton.style.visibility = "visible";
        }
        else if (_this.GUI.craftingPanel.isOpen === true) {
            this.addButton.style.visibility = "visible";
            _this.GUI.inventoryBar.updateCraftingPanelAddButtons();
        }
        // None of them are open, hide the add button.
        else {
            this.addButton.style.visibility = "hidden";
        }
    }
}

class InventoryBar {

    constructor(gui) {
        this.message = document.getElementById('inventory_message');
        this.message.addEventListener('webkitAnimationEnd', gui.textCounterWebkitAnimationEnd, false);
        this.slotContainer = document.getElementById('inventory_bar');
        this.slots = {};

        // Rearrange the order of the slot numbers, as the 0 key is at the right end of keyboards.
        this.slotKeysByIndex = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9", "slot0"];

        // Create 10 slots.
        for (let i = 0; i < 10; i += 1) {
            const slotKey = this.slotKeysByIndex[i];
            this.slots[slotKey] = new Slot(slotKey, this);
        }
    }

    showAddButtons() {
        for (let key in this.slots) {
            if (this.slots.hasOwnProperty(key) === false) continue;
            // Only show if the inventory slot has something in it.
            if (_this.player.inventory[key].catalogueEntry === null) continue;

            this.slots[key].addButton.style.visibility = "visible";
        }
    }

    hideAddButtons() {
        for (let key in this.slots) {
            if (this.slots.hasOwnProperty(key) === false) continue;
            this.slots[key].addButton.style.visibility = "hidden";
        }
    }

    /**
     * Update the inventory add buttons while he crafting panel is open, to show only the buttons
     * for items that can be added to make a valid item.
     */
    updateCraftingPanelAddButtons() {
        const stationTypeNumber = _this.craftingManager.stationTypeNumber;
        const inventory = _this.player.inventory;
        let codeSoFar = _this.craftingManager.recipeCode;
        let codeSoFarItemsLength = (codeSoFar.match(/-/g) || []).length;
        let slot;
        let catalogueEntry;
        let itemTypeNumber;
        let stationRecipes = RecipeCatalogue[stationTypeNumber];

        let getSubstring = function (string, targetLength) {
            let substring = '';
            let dashesFound = 0;
            for (let i = 0; i < string.length; i += 1) {
                substring += string[i];
                if (string[i] === '-') {
                    dashesFound += 1;
                }
                if (dashesFound === targetLength) return substring;
            }
            return null;
        };

        const nextRecipes = [];
        // Get all of the recipe codes of the length of the code so far. Don't need to do this every time for each slot.
        for (let recipeKey in stationRecipes) {
            if (stationRecipes.hasOwnProperty(recipeKey) === false) continue;
            nextRecipes.push(getSubstring(recipeKey, codeSoFarItemsLength + 1));
        }

        for (let key in this.slots) {
            if (this.slots.hasOwnProperty(key) === false) continue;
            slot = this.slots[key];
            catalogueEntry = inventory[slot.addButton.getAttribute('slotKey')].catalogueEntry;
            // Ignore empty slots.
            if (catalogueEntry === null) continue;
            itemTypeNumber = catalogueEntry.typeNumber;
            let isValid = false;

            slot.addButton.style.visibility = "hidden";

            const nextCode = codeSoFar + itemTypeNumber + '-';
            // Need to check all recipes (until a match is found) in this station type.
            for (let i = 0; i < nextRecipes.length; i += 1) {
                // Check if the recipe code matches a part of a valid recipe.
                if (nextCode === nextRecipes[i]) {
                    isValid = true;
                    slot.addButton.style.visibility = "visible";
                    break;
                }
            }
        }
    }

    mouseDown(event) {
        // Detect right mouse button click, to drop inventory items.
        let isRightMB;
        if ("which" in event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = event.which === 3;
        else if ("button" in event)  // IE, Opera
            isRightMB = event.button === 2;

        if (isRightMB === true) {
            window.ws.sendEvent('drop_item', this.getAttribute('slotKey'));
        }
    }

    click() {
        _this.player.inventory.useItem(this.getAttribute('slotKey'));
    }

    addClick(event) {

        event.stopPropagation();

        // Check if any of the panels that can have items added to them are open.
        if (_this.GUI.bankPanel.isOpen === true) {
            const emptySlotIndex = _this.player.bankManager.getFirstEmptySlotIndexInSelectedTab();
            if (emptySlotIndex === false) return;

            _this.player.bankManager.depositItem(this.getAttribute('slotKey'), emptySlotIndex);
        }
        else if (_this.GUI.craftingPanel.isOpen === true) {
            _this.craftingManager.addComponent(this.getAttribute('slotKey'));
        }

    }

    slotMouseOver() {
        const slotKey = this.getAttribute('slotKey');
        const inventorySlot = _this.player.inventory[slotKey];
        // Skip empty inventory slots.
        if (inventorySlot.catalogueEntry === null) return;
        // Show the container.
        _this.GUI.itemTooltipContainer.style.visibility = "visible";
        // Update the contents.
        _this.GUI.itemTooltipName.innerHTML = dungeonz.getTextDef("Item name: " + inventorySlot.catalogueEntry.idName);
        _this.GUI.itemTooltipDescription.innerHTML = dungeonz.getTextDef("Item description: " + inventorySlot.catalogueEntry.idName);

        if (inventorySlot.durability === null) _this.GUI.itemTooltipDurability.innerHTML = "";
        else _this.GUI.itemTooltipDurability.innerHTML = "(" + inventorySlot.durability + "/" + inventorySlot.maxDurability + ")";

        /* Bug fix hack, brightness changes position when used on parent. :S */
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
    }

    slotMouseOut() {
        const slotKey = this.getAttribute('slotKey');
        _this.GUI.itemTooltipContainer.style.visibility = "hidden";
        /* Bug fix hack, brightness changes position when used on parent. :S */
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
    }

    slotDragStart(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.

        //console.log("drag started, this:", this);
        const slotKey = this.getAttribute('slotKey');
        const icon = _this.GUI.inventoryBar.slots[slotKey].icon;
        event.dataTransfer.setData('text/plain', null);
        _this.GUI.dragData = {
            dragOrigin: _this.GUI.inventoryBar.slotContainer,
            inventorySlot: _this.player.inventory[slotKey]
        };
        event.dataTransfer.setDragImage(icon, icon.width / 2, icon.height / 2);

        // Highlight the slots in panels where items can be dropped.
        const GUIColours = _this.GUI.GUIColours;
        let list = _this.GUI.inventoryBar.slots;
        for (let slotKey in list) {
            if (list.hasOwnProperty(slotKey) === false) continue;
            list[slotKey].container.style.backgroundColor = GUIColours.validDropTargetOver;
        }
        list = _this.GUI.craftingPanel.components;
        for (let slotKey in list) {
            if (list.hasOwnProperty(slotKey) === false) continue;
            list[slotKey].container.style.backgroundColor = GUIColours.validDropTargetOver;
        }
        list = _this.GUI.bankPanel.slots;
        for (let i = 0, len = list.length; i < len; i += 1) {
            list[i].container.style.backgroundColor = GUIColours.validDropTargetOver;
        }

        this.style.backgroundColor = GUIColours.currentlyDragged;

    }

    slotDragEnter(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        /*const slotKey = this.getAttribute('slotKey');
        //console.log("drag enter, slotkey:", slotKey);
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
        if(_this.GUI.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.container.style.backgroundColor = _this.GUI.dragColours.validDropTarget;
        }*/
    }

    slotDragLeave(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        //console.log("drag leave");
        /*const slotKey = this.getAttribute('slotKey');
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
        // Don't change the colour if the element being left is the start element.
        // Want to keep the orange background for the start.
        if(_this.GUI.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.container.style.backgroundColor = "transparent";
        }*/
    }

    slotDragOver(event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
    }

    slotDrop(event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        const slotKey = this.getAttribute('slotKey');
        // If it was from the inventory bar, swap the slots.
        if (_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer) {
            //console.log("invent slot dropped over another inventory slot");
            _this.player.inventory.swapInventorySlots(_this.GUI.dragData.inventorySlot.slotKey, slotKey);
        }
        // If it was from the bank panel, withdraw the item.
        else if (_this.GUI.dragData.dragOrigin === _this.GUI.bankPanel.bankSlots) {
            _this.player.bankManager.withdrawItem((_this.GUI.dragData.bankSlot.getAttribute('slotIndex') * 1) + _this.player.bankManager.selectedTabSlotIndexOffset, slotKey);
        }

        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        for (let slotKey in _this.GUI.craftingPanel.components) {
            _this.GUI.craftingPanel.components[slotKey].refreshBackground();
        }

        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;

        //console.log("invent slot drop");
    }

    slotDragEnd(event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        const inventorySlots = _this.GUI.inventoryBar.slots;
        for (let slotKey in inventorySlots) {
            if (inventorySlots.hasOwnProperty(slotKey) === false) continue;
            inventorySlots[slotKey].container.style.backgroundColor = "transparent";
        }
        const craftingComponents = _this.GUI.craftingPanel.components;
        for (let slotKey in craftingComponents) {
            if (craftingComponents.hasOwnProperty(slotKey) === false) continue;
            craftingComponents[slotKey].refreshBackground();
        }
        const bankSlots = _this.GUI.bankPanel.slots;
        for (let i = 0, len = bankSlots.length; i < len; i += 1) {
            bankSlots[i].refreshBackground();
        }

        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;
    }

}

export default InventoryBar