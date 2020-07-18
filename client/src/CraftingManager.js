import RecipeCatalogue from './catalogues/CraftingRecipes'
import ItemTypes from '../src/catalogues/ItemTypes'

class CraftingComponent {
    constructor(number) {
        /**
         * The position of this component slot along the bar. [1] [2]...
         * @type {Number}
         */
        this.number = number;
        /**
         * The key of the inventory slot that is occupying this component, or null if empty.
         * @type {String||null}
         */
        this.occupiedBy = null;
        /**
         * @type {ComponentSlot}
         */
        this.guiSlot = _this.GUI.craftingPanel.components['slot' + number];

    }
}

class CraftingManager {

    constructor() {

        this.stationTypeNumber = null;

        this.recipeCode = '';

        this.components = {};
        for (let i = 1; i < 6; i += 1) {
            this.components['slot' + i] = new CraftingComponent(i);
        }

        this.guiResult = _this.GUI.craftingPanel.result;

    }

    /**
     * Add an item from the inventory to the crafting recipe.
     * @param {Number|String} inventorySlotKey - The slot key of the inventory item to add.
     */
    addComponent(inventorySlotKey) {
        //console.log("adding component, key:", inventorySlotKey);

        const inventory = _this.player.inventory;

        // Don't try to add this item if it is already being used as a component.
        if (inventory[inventorySlotKey].craftingComponent !== null) return;
        // Don't try to add this item if there is nothing in that inventory slot.
        if (inventory[inventorySlotKey].catalogueEntry === null) return;

        let component;
        // Get the first empty component slot.
        for (let slotKey in this.components) {
            if (this.components.hasOwnProperty(slotKey) === false) continue;
            component = this.components[slotKey];
            if (component.occupiedBy === null) {
                component.occupiedBy = inventorySlotKey;
                component.guiSlot.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;
                component.guiSlot.remove.style.visibility = "visible";
                component.guiSlot.icon.style.visibility = "visible";
                component.guiSlot.icon.src = _this.GUI.inventoryBar.slots[inventorySlotKey].icon.src;
                this.recipeCode += inventory[inventorySlotKey].catalogueEntry.typeNumber + '-';
                inventory[inventorySlotKey].craftingComponent = component;
                // Hide the add item button on the inventory bar.
                _this.GUI.inventoryBar.slots[inventorySlotKey].addButton.style.visibility = "hidden";
                // Fade out the item icon on the inventory bar a bit.
                _this.GUI.inventoryBar.slots[inventorySlotKey].container.style.opacity = 0.5;

                this.checkRecipeCode();

                _this.GUI.inventoryBar.updateCraftingPanelAddButtons();
                // Component added. Don't loop the other slots.
                return;
            }
        }

    }

    removeComponent(componentNumber) {
        //console.log("remove component:", componentNumber);
        let component = this.components['slot' + componentNumber];
        if (component === undefined) return;
        if (component.occupiedBy === null) return;
        let guiSlot = component.guiSlot;
        guiSlot.remove.style.visibility = "hidden";
        guiSlot.icon.style.visibility = "hidden";
        guiSlot.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;
        // Show the add item button.
        _this.GUI.inventoryBar.slots[component.occupiedBy].addButton.style.visibility = "visible";
        // Make the item in the inventory full opacity to show it isn't in the craft any more.
        _this.GUI.inventoryBar.slots[component.occupiedBy].container.style.opacity = 1;
        _this.player.inventory[component.occupiedBy].craftingComponent = null;
        component.occupiedBy = null;

        this.shiftEmptyComponentsLeft();

        // Remake the recipe code.
        this.recipeCode = '';
        for (let slotKey in this.components) {
            if (this.components.hasOwnProperty(slotKey) === false) continue;
            if (this.components[slotKey].occupiedBy === null) break;
            this.recipeCode += _this.player.inventory[this.components[slotKey].occupiedBy].catalogueEntry.typeNumber + '-';
        }

        this.checkRecipeCode();

        _this.GUI.inventoryBar.updateCraftingPanelAddButtons();
    }

    checkRecipeCode() {
        //console.log("checking recipe code", this.recipeCode);
        // Check if the recipe code matches a valid recipe.
        if (RecipeCatalogue[this.stationTypeNumber] !== undefined) {
            //console.log("  station is valid, result:", RecipeCatalogue[this.stationTypeNumber]);
            if (RecipeCatalogue[this.stationTypeNumber][this.recipeCode] !== undefined) {
                //console.log("  recipe found for this crafting station:", RecipeCatalogue[this.stationTypeNumber][this.recipeCode]);
                this.guiResult.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;
                this.guiResult.icon.style.visibility = "visible";
                this.guiResult.icon.src = 'assets/img/gui/items/' + ItemTypes[RecipeCatalogue[this.stationTypeNumber][this.recipeCode].resultTypeNumber].iconSource + ".png";
                this.guiResult.accept.style.visibility = "visible";
                this.guiResult.itemName = dungeonz.getTextDef("Item name: " + ItemTypes[RecipeCatalogue[this.stationTypeNumber][this.recipeCode].resultTypeNumber].idName);
            }
            else {
                //console.log("  recipe is NOT valid");
                this.guiResult.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;
                this.guiResult.icon.style.visibility = "hidden";
                this.guiResult.accept.style.visibility = "hidden";
                this.guiResult.itemName = '';
            }
        }
    }

    shiftEmptyComponentsLeft() {
        // Move the remaining components to the left to fill any gaps.
        const componentKeys = Object.keys(this.components);
        let currentComponent,
            nextComponent;
        for (let i = 0; i < componentKeys.length; i += 1) {
            currentComponent = this.components[componentKeys[i]];
            if (currentComponent.occupiedBy === null) {
                // An empty slot found. Find the next non-empty slot and move it to this one.
                for (let j = i + 1; j < componentKeys.length; j += 1) {
                    nextComponent = this.components[componentKeys[j]];
                    if (nextComponent.occupiedBy === null) continue;

                    currentComponent.occupiedBy = nextComponent.occupiedBy;
                    nextComponent.occupiedBy = null;

                    currentComponent.guiSlot.remove.style.visibility = 'visible';
                    nextComponent.guiSlot.remove.style.visibility = 'hidden';

                    currentComponent.guiSlot.icon.src = nextComponent.guiSlot.icon.src;
                    currentComponent.guiSlot.icon.style.visibility = 'visible';
                    nextComponent.guiSlot.icon.style.visibility = 'hidden';

                    currentComponent.guiSlot.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;
                    nextComponent.guiSlot.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;

                    break;
                }
            }
        }
    }

    static accept() {
        const inventorySlotKeys = [];
        const components = _this.craftingManager.components;
        for (let slotKey in components) {
            if (components.hasOwnProperty(slotKey) === false) continue;
            if (components[slotKey].occupiedBy === null) break;
            inventorySlotKeys.push(components[slotKey].occupiedBy);
        }

        for (let slotKey in components) {
            if (components.hasOwnProperty(slotKey) === false) continue;
            _this.craftingManager.removeComponent(components.slot1.number);
        }

        window.ws.sendEvent("craft", { stationTypeNumber: _this.craftingManager.stationTypeNumber, inventorySlotKeys: inventorySlotKeys });
    }

    empty() {
        for (let i = 0; i < 5; i += 1) {
            this.removeComponent(1);
        }
    }

}

export default CraftingManager;