
import CraftingManager from "../CraftingManager";
import PanelTemplate from "./PanelTemplate";

class ComponentSlot {
    /**
     * Create a new crafting component slot.
     * @param {CraftingPanel} panel
     * @param {Number} slotNumber
     */
    constructor(panel, slotNumber) {
        this.container = document.createElement('div');
        this.container.id = 'component_slot_' + slotNumber + '_cont';
        this.container.className = 'crafting_component_slot_cont';
        this.container.draggable = false;
        // Remove the component when it is clicked on.
        this.container.onclick = panel.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover = panel.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout = panel.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart = panel.slotDragStart;
        this.container.ondragenter = panel.slotDragEnter;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotKey', 'slot' + slotNumber);
        panel.innerContainer.appendChild(this.container);

        this.icon = document.createElement('img');
        this.icon.id = 'component_slot_' + slotNumber + '_icon';
        this.icon.src = 'assets/img/gui/items/icon-dungium-ore.png';
        this.icon.className = 'crafting_component_slot_icon';
        this.icon.draggable = false;
        this.container.appendChild(this.icon);
    }

    refreshBackground() {
        // Only give a white background back to the component slots that have something in them.
        if (_this.craftingManager.components[this.container.getAttribute('slotKey')].occupiedBy === null) {
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;
        }
        else {
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;
        }
    }
}

class CraftingPanel extends PanelTemplate {
    /**
     * @param {GUI} gui - A reference to the GUI object.
     */
    constructor(gui) {
        super(document.getElementById('crafting_panel'), 500, 180, "Crafting", 'gui/panels/anvil');

        const panel = this;

        this.innerContainer = document.createElement('div');
        this.innerContainer.id = 'crafting_inner_cont';
        this.innerContainer.ondragenter = panel.componentsBarDragEnter;
        this.innerContainer.ondragover = panel.componentsBarDragOver;
        this.innerContainer.ondrop = panel.componentsBarDrop;
        this.contentsContainer.appendChild(this.innerContainer);

        this.mainContainer.style.backgroundColor = gui.GUIColours.colourDB32SteelGreyOpacity50;

        this.components = {};
        for (let i = 1; i < 6; i += 1) {
            this.components['slot' + i] = new ComponentSlot(this, i);
        }

        // Add the arrow icon.
        const arrowIcon = document.createElement('img');
        arrowIcon.id = 'crafting_arrow_icon';
        arrowIcon.src = 'assets/img/gui/panels/crafting-arrow-icon.png';
        arrowIcon.draggable = false;
        this.innerContainer.appendChild(arrowIcon);

        const resultContainer = document.createElement('div');
        //resultContainer.id = 'crafting_result_cont';
        resultContainer.className = 'crafting_component_slot_cont';
        resultContainer.draggable = false;
        resultContainer.onmouseover = this.resultMouseOver;
        resultContainer.onmouseout = this.slotMouseOut;
        this.innerContainer.appendChild(resultContainer);

        const resultIcon = document.createElement('img');
        resultIcon.src = 'assets/img/gui/items/icon-dungium-ore.png';
        resultIcon.className = 'crafting_component_slot_icon';
        resultIcon.draggable = false;
        resultContainer.appendChild(resultIcon);

        // Add the remove buttons.
        for (let i = 1; i < 6; i += 1) {
            const removeButton = this.components['slot' + i].remove = document.createElement('img');
            //removeButton.id = 'component_slot_' + i + '_icon';
            removeButton.src = 'assets/img/gui/panels/crafting-remove-button.png';
            removeButton.className = 'crafting_button';
            removeButton.draggable = false;
            // Store the key of this slot on the button itself.
            removeButton.setAttribute('slotKey', 'slot' + i);
            // Remove the component when this is clicked on.
            removeButton.onclick = panel.slotClick;
            this.innerContainer.appendChild(removeButton);
        }

        // Add the empty space.
        const emptySpace = document.createElement('div');
        this.innerContainer.appendChild(emptySpace);

        const acceptButton = document.createElement('img');
        acceptButton.src = 'assets/img/gui/panels/crafting-accept-button.png';
        acceptButton.className = 'crafting_button';
        acceptButton.draggable = false;
        acceptButton.onclick = CraftingManager.accept;
        this.innerContainer.appendChild(acceptButton);

        this.tooltip = document.createElement('div');
        this.tooltip.id = 'crafting_tooltip';

        this.result = {
            container: resultContainer,
            icon: resultIcon,
            accept: acceptButton,
            itemName: ''
        };

    }

    /**
     * Show the panel.
     * @param {String} stationName - The display name of this crafting station. "Anvil", "Workbench", etc.
     * @param {String} panelIconURL - The URL of the image to change the panel icon to.
     */
    show(stationName, panelIconURL) {
        super.show();

        _this.GUI.isAnyPanelOpen = true;

        this.changeName(stationName);

        if (panelIconURL) {
            // Update the top left icon to show the crafting station sprite.
            this.icon.src = panelIconURL;
        }

        // Clear any existing recipe code.
        _this.craftingManager.recipeCode = '';

        // Show the valid buttons on the inventory bar.
        _this.GUI.inventoryBar.updateCraftingPanelAddButtons();
    }

    hide() {
        super.hide();

        this.tooltip.style.visibility = 'hidden';
        this.result.icon.style.visibility = "hidden";
        this.result.accept.style.visibility = "hidden";

        _this.GUI.isAnyPanelOpen = false;

        _this.craftingManager.empty();

        // Hide the add buttons on the inventory bar.
        _this.GUI.inventoryBar.hideAddButtons();
    }

    slotClick() {
        const slotKey = this.getAttribute('slotKey');
        //console.log("slot clicked:", slotKey);
        _this.craftingManager.removeComponent(slotKey[4]);
    }

    slotMouseOver() {
        const slotKey = this.getAttribute('slotKey');
        //console.log("slot mouse over, slotkey:", slotKey);
        // If the slot is empty, don't show the tooltip.
        if (_this.craftingManager.components[slotKey].occupiedBy === null) return;

        const craftingPanel = _this.GUI.craftingPanel;

        craftingPanel.tooltip.innerText = dungeonz.getTextDef("Item name: " + _this.player.inventory[_this.craftingManager.components[slotKey].occupiedBy].catalogueEntry.idName);
        craftingPanel.tooltip.style.visibility = 'visible';

        this.appendChild(craftingPanel.tooltip);
    }

    slotMouseOut() {
        _this.GUI.craftingPanel.tooltip.style.visibility = 'hidden';
    }

    slotDragStart(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        event.preventDefault();
    }

    slotDragEnter(event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
    }

    componentsBarDragEnter(event) {
        event.preventDefault();
    }

    componentsBarDragOver(event) {
        event.preventDefault();
    }

    componentsBarDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        if (_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer) {
            _this.craftingManager.addComponent(_this.GUI.dragData.inventorySlot.slotKey);
        }
    }

    resultMouseOver() {
        const craftingPanel = _this.GUI.craftingPanel;
        if (craftingPanel.result.itemName === '') return;

        craftingPanel.tooltip.innerText = craftingPanel.result.itemName;
        craftingPanel.tooltip.style.visibility = 'visible';

        this.appendChild(_this.GUI.craftingPanel.tooltip);
    }

}

export default CraftingPanel;