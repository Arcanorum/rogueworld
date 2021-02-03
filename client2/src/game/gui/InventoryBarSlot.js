class Slot {
    constructor(slotKey, bar) {
        this.icon = document.createElement("img");
        this.icon.src = "assets/img/gui/items/icon-dungium-ore.png";
        this.icon.className = "inventory_slot_icon";
        this.icon.draggable = false;

        this.durability = document.createElement("img");
        this.durability.src = "assets/img/gui/hud/durability-meter-10.png";
        this.durability.className = "inventory_slot_durability";
        this.durability.draggable = false;

        this.equipped = document.createElement("img");
        this.equipped.src = "assets/img/gui/hud/clothing-icon.png";
        this.equipped.className = "inventory_slot_equipped";
        this.equipped.draggable = false;

        this.border = document.createElement("img");
        this.border.src = "assets/img/gui/hud/inventory-slot-border.png";
        this.border.className = "inventory_slot_border";
        this.border.draggable = false;

        this.addButton = document.createElement("img");
        this.addButton.src = "assets/img/gui/hud/inventory-add-item-icon.png";
        this.addButton.className = "inventory_slot_add_button";
        this.addButton.draggable = false;
        this.addButton.onclick = bar.addClick;
        // Store the key of this slot on the add button itself.
        this.addButton.setAttribute("slotKey", slotKey);

        this.container = document.createElement("div");
        this.container.className = "inventory_slot";
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
        this.container.setAttribute("slotKey", slotKey);

        this.container.appendChild(this.icon);
        this.container.appendChild(this.durability);
        this.container.appendChild(this.equipped);
        this.container.appendChild(this.border);
        this.container.appendChild(this.addButton);

        bar.slotContainer.appendChild(this.container);
    }

    refreshAddButton() {
        // Show the add button if any of the relevant panels are open.
        if (window.gameScene.GUI.bankPanel.isOpen === true) {
            this.addButton.style.visibility = "visible";
        }
        else if (window.gameScene.GUI.craftingPanel.isOpen === true) {
            this.addButton.style.visibility = "visible";
            window.gameScene.GUI.inventoryBar.updateCraftingPanelAddButtons();
        }
        // None of them are open, hide the add button.
        else {
            this.addButton.style.visibility = "hidden";
        }
    }
}

export default Slot;
