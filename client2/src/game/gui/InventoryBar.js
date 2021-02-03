import RecipeCatalogue from "../../catalogues/CraftingRecipes";
import Slot from "./InventoryBarSlot";

class InventoryBar {
    constructor(GUI, GAME) {
        this.message = document.getElementById("inventory-message");
        this.message.addEventListener("webkitAnimationEnd", GUI.textCounterWebkitAnimationEnd,
            false);
        this.slotContainer = document.getElementById("inventory-bar");
        this.slots = {};
        this.GUI = GUI;
        this.GAME = GAME;

        // Rearrange the order of the slot numbers, as the 0 key is at the right end of keyboards.
        this.slotKeysByIndex = [
            "slot1",
            "slot2",
            "slot3",
            "slot4",
            "slot5",
            "slot6",
            "slot7",
            "slot8",
            "slot9",
            "slot0"];

        // Create 10 slots.
        for (let i = 0; i < 10; i += 1) {
            const slotKey = this.slotKeysByIndex[i];
            this.slots[slotKey] = new Slot(slotKey, this);
        }
    }

    showAddButtons() {
        for (const key in this.slots) {
            if (this.slots.hasOwnProperty(key) === false) continue;
            // Only show if the inventory slot has something in it.
            if (this.GAME.player.inventory[key].catalogueEntry === null) continue;

            this.slots[key].addButton.style.visibility = "visible";
        }
    }

    hideAddButtons() {
        for (const key in this.slots) {
            if (this.slots.hasOwnProperty(key) === false) continue;
            this.slots[key].addButton.style.visibility = "hidden";
        }
    }

    /**
     * Update the inventory add buttons while he crafting panel is open, to show only the buttons
     * for items that can be added to make a valid item.
     */
    updateCraftingPanelAddButtons() {
        const { stationTypeNumber } = this.GAME.craftingManager;
        const { inventory } = this.GAME.player;
        const codeSoFar = this.GAME.craftingManager.recipeCode;
        const codeSoFarItemsLength = (codeSoFar.match(/-/g) || []).length;
        let slot;
        let catalogueEntry;
        let itemTypeNumber;
        const stationRecipes = RecipeCatalogue[stationTypeNumber];

        const getSubstring = function (string, targetLength) {
            let substring = "";
            let dashesFound = 0;
            for (let i = 0; i < string.length; i += 1) {
                substring += string[i];
                if (string[i] === "-") {
                    dashesFound += 1;
                }
                if (dashesFound === targetLength) return substring;
            }
            return null;
        };

        const nextRecipes = [];
        // Get all of the recipe codes of the length of the code so far. Don't need to do this every time for each slot.
        for (const recipeKey in stationRecipes) {
            if (stationRecipes.hasOwnProperty(recipeKey) === false) continue;
            nextRecipes.push(getSubstring(recipeKey, codeSoFarItemsLength + 1));
        }

        for (const key in this.slots) {
            if (this.slots.hasOwnProperty(key) === false) continue;
            slot = this.slots[key];
            catalogueEntry = inventory[slot.addButton.getAttribute("slotKey")].catalogueEntry;
            // Ignore empty slots.
            if (catalogueEntry === null) continue;
            itemTypeNumber = catalogueEntry.typeNumber;
            let isValid = false;

            slot.addButton.style.visibility = "hidden";

            const nextCode = `${codeSoFar + itemTypeNumber}-`;
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
        if ("which" in event) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        {
            isRightMB = event.which === 3;
        }
        else if ("button" in event) // IE, Opera
        {
            isRightMB = event.button === 2;
        }

        if (isRightMB === true) {
            window.window.ws.sendEvent("drop_item", this.getAttribute("slotKey"));
        }
    }

    click() {
        this.GAME.player.inventory.useItem(this.getAttribute("slotKey"));
    }

    addClick(event) {
        event.stopPropagation();

        // Check if any of the panels that can have items added to them are open.
        if (this.GUI.bankPanel.isOpen === true) {
            const emptySlotIndex = this.GAME.player.bankManager.getFirstEmptySlotIndexInSelectedTab();
            if (emptySlotIndex === false) return;

            this.GAME.player.bankManager.depositItem(this.getAttribute("slotKey"), emptySlotIndex);
        }
        else if (this.GUI.craftingPanel.isOpen === true) {
            this.GAME.craftingManager.addComponent(this.getAttribute("slotKey"));
        }
    }

    slotMouseOver() {
        console.log(this);
        /* const slotKey = this.getAttribute("slotKey");
        const inventorySlot = this.GAME.player.inventory[slotKey];
        // Skip empty inventory slots.
        if (inventorySlot.catalogueEntry === null) return;
        // Show the container.
        this.GUI.itemTooltipContainer.style.visibility = "visible";
        // Update the contents.
        this.GUI.itemTooltipName.innerHTML = window.dungeonz.getTextDef(
            `Item name: ${inventorySlot.catalogueEntry.translationID}`,
        );
        this.GUI.itemTooltipDescription.innerHTML = window.dungeonz.getTextDef(
            `Item description: ${inventorySlot.catalogueEntry.translationID}`,
        );

        if (inventorySlot.durability === null) {
            this.GUI.itemTooltipDurability.innerHTML = "";
        }
        else {
            this.GUI.itemTooltipDurability.innerHTML = `(${inventorySlot.durability}/${
                inventorySlot.maxDurability})`;
        }

        /!* Bug fix hack, brightness changes position when used on parent. :S *!/
        const guiSlot = this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)"; */
    }

    slotMouseOut() {
        const slotKey = this.getAttribute("slotKey");
        this.GUI.itemTooltipContainer.style.visibility = "hidden";
        /* Bug fix hack, brightness changes position when used on parent. :S */
        const guiSlot = this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
    }

    slotDragStart(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.

        // console.log("drag started, this:", this);
        const slotKeyAttr = this.getAttribute("slotKey");
        const { icon } = this.GUI.inventoryBar.slots[slotKeyAttr];
        event.dataTransfer.setData("text/plain", null);
        this.GUI.dragData = {
            dragOrigin: this.GUI.inventoryBar.slotContainer,
            inventorySlot: this.GAME.player.inventory[slotKeyAttr],
        };
        event.dataTransfer.setDragImage(icon, icon.width / 2, icon.height / 2);

        // Highlight the slots in panels where items can be dropped.
        const { GUIColours } = this.GAME.GUI;
        let list = this.GUI.inventoryBar.slots;
        for (const slotKey in list) {
            if (list.hasOwnProperty(slotKey) === false) continue;
            list[slotKey].container.style.backgroundColor = GUIColours.validDropTargetOver;
        }
        list = this.GUI.craftingPanel.components;
        for (const slotKey in list) {
            if (list.hasOwnProperty(slotKey) === false) continue;
            list[slotKey].container.style.backgroundColor = GUIColours.validDropTargetOver;
        }
        list = this.GUI.bankPanel.slots;
        for (let i = 0, len = list.length; i < len; i += 1) {
            list[i].container.style.backgroundColor = GUIColours.validDropTargetOver;
        }

        this.style.backgroundColor = GUIColours.currentlyDragged;
    }

    slotDragEnter(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        /* const slotKey = this.getAttribute('slotKey');
        //console.log("drag enter, slotkey:", slotKey);
        const guiSlot = this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
        if(this.GUI.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.container.style.backgroundColor = this.GUI.dragColours.validDropTarget;
        } */
    }

    slotDragLeave(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        // console.log("drag leave");
        /* const slotKey = this.getAttribute('slotKey');
        const guiSlot = this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
        // Don't change the colour if the element being left is the start element.
        // Want to keep the orange background for the start.
        if(this.GUI.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.container.style.backgroundColor = "transparent";
        } */
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
        const slotKeyAttr = this.getAttribute("slotKey");
        // If it was from the inventory bar, swap the slots.
        if (this.GUI.dragData.dragOrigin === this.GUI.inventoryBar.slotContainer) {
            // console.log("invent slot dropped over another inventory slot");
            this.GAME.player.inventory.swapInventorySlots(this.GUI.dragData.inventorySlot.slotKey,
                slotKeyAttr);
        }
        // If it was from the bank panel, withdraw the item.
        else if (this.GUI.dragData.dragOrigin === this.GUI.bankPanel.bankSlots) {
            this.GAME.player.bankManager.withdrawItem(
                (this.GUI.dragData.bankSlot.getAttribute("slotIndex") * 1)
                + this.GAME.player.bankManager.selectedTabSlotIndexOffset, slotKeyAttr,
            );
        }

        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        const components = this.GUI.craftingPanel.components;
        for (const slotKey in components) {
            if (components.hasOwnProperty(slotKey)) {
                this.GUI.craftingPanel.components[slotKey].refreshBackground();
            }
        }

        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        this.GUI.dragData.dragOrigin = null;

        // console.log("invent slot drop");
    }

    slotDragEnd(event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        const inventorySlots = this.GUI.inventoryBar.slots;
        for (const slotKey in inventorySlots) {
            if (inventorySlots.hasOwnProperty(slotKey) === false) continue;
            inventorySlots[slotKey].container.style.backgroundColor = "transparent";
        }
        const craftingComponents = this.GUI.craftingPanel.components;
        for (const slotKey in craftingComponents) {
            if (craftingComponents.hasOwnProperty(slotKey) === false) continue;
            craftingComponents[slotKey].refreshBackground();
        }
        const bankSlots = this.GUI.bankPanel.slots;
        for (let i = 0, len = bankSlots.length; i < len; i += 1) {
            bankSlots[i].refreshBackground();
        }

        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        this.GUI.dragData.dragOrigin = null;
    }
}

export default InventoryBar;
