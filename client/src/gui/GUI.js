
import InventoryBar from './InventoryBar';
import SettingsBar from "./SettingsBar";
import StatsPanel from "./StatsPanel";
import CraftingPanel from "./CraftingPanel";
import BankPanel from "./BankPanel";
//import ExitGamePanel from "./ExitGamePanel";
import ClanPanel from "./ClanPanel";
import SpellBar from "./SpellBar";
import ShopPanel from "./ShopPanel";
import TasksPanel from "./TasksPanel";
import DungeonPanel from "./DungeonPanel";
import RespawnPanel from "./RespawnPanel";
import HintPanel from "./HintPanel";
import CreateAccountPanel from "./CreateAccountPanel";
import AccountPanel from "./AccountPanel";
//import GeneratorPanel from "./GeneratorPanel";

class GUI {

    constructor(game) {

        this.game = game;

        this.GUIColours = {
            currentlyDragged: "rgba(255, 171, 0, 0.5)",
            validDropTarget: "rgba(146, 255, 236, 0.25)",
            validDropTargetOver: "rgba(140, 203, 255, 0.75)",
            invalidDropTarget: "rgba(255, 34, 0, 0.5)",
            currentlySelected: "rgba(251, 242, 54, 0.5)",
            white80Percent: "rgba(255, 255, 255, 0.8)",
            shopSelected: "rgb(153, 229, 80, 0.8)",
            taskComplete: "rgba(106, 190, 48, 0.8)",
            bankSlotOccupied: "rgba(255, 255, 255, 0.5)",
            bankSlotEmpty: "rgba(105, 106, 106, 0.5)",
            taskSlotUnselected: "#222034",
            taskSlotSelected: "#df7126",
            taskSlotDefault: "#ffffff",
            taskSlotTracking: "#639bff",
            taskSlotCompleted: "#6abe30",
            colourDB32SteelGreyOpacity50: "rgba(155, 173, 183, 0.8)",
        };

        this.gameCanvas = document.getElementById('game_canvas').childNodes[0];

        // References to the DOM elements for the icons and parents.
        this.gui = document.getElementById('gui_cont');

        this.defenceIcon = document.getElementById('defence_icon');
        this.hitPointIcon = document.getElementById('hitpoint_icon');
        this.energyIcon = document.getElementById('energy_icon');
        this.gloryIcon = document.getElementById('glory_icon');
        this.avatarIcon = document.getElementById('avatar_icon');
        this.tasksIcon = document.getElementById('tasks_icon');
        this.mapIcon = document.getElementById('map_icon');
        this.clanIcon = document.getElementById('clan_icon');
        this.inventoryIcon = document.getElementById('inventory_icon');
        this.exitIcon = document.getElementById('exit_icon');
        this.discordIcon = document.getElementById('discord_icon');
        this.wikiIcon = document.getElementById('wiki_icon');

        this.defenceTooltip = document.getElementById('defence_tooltip');
        this.hitPointTooltip = document.getElementById('hitpoint_tooltip');
        this.energyTooltip = document.getElementById('energy_tooltip');
        this.gloryTooltip = document.getElementById('glory_tooltip');
        this.avatarTooltip = document.getElementById('avatar_tooltip');
        this.tasksTooltip = document.getElementById('tasks_tooltip');
        this.mapTooltip = document.getElementById('map_tooltip');
        this.clanTooltip = document.getElementById('clan_tooltip');
        this.inventoryTooltip = document.getElementById('inventory_tooltip');
        this.exitTooltip = document.getElementById('exit_tooltip');
        this.discordTooltip = document.getElementById('discord_tooltip');
        this.wikiTooltip = document.getElementById('wiki_tooltip');

        this.gloryCounter = document.getElementById('glory_counter');
        this.gloryCounterTransition = document.getElementById('glory_counter_transition');
        this.defenceCounter = document.getElementById('defence_counter');

        this.virtualDPad = document.getElementById('virtual_dpad');
        this.virtualDPadUp = document.getElementById('virtual_dpad_up');
        this.virtualDPadDown = document.getElementById('virtual_dpad_down');
        this.virtualDPadLeft = document.getElementById('virtual_dpad_left');
        this.virtualDPadRight = document.getElementById('virtual_dpad_right');

        this.itemTooltipContainer = document.getElementById('item_tooltip_cont');
        this.itemTooltipName = document.getElementById('item_name');
        this.itemTooltipDescription = document.getElementById('item_description');
        this.itemTooltipDurability = document.getElementById('item_durability');

        this.dungeonTimerContainer = document.getElementById('dungeon_timer_cont');
        this.dungeonTimerValue = document.getElementById('dungeon_timer_value');

        this.dungeonKeysContainer = document.getElementById('dungeon_keys_cont');
        this.dungeonKeysList = document.getElementById('dungeon_keys_list');

        this.chatInput = document.getElementById('chat_input');

        this.panels = [];
        this.isAnyPanelOpen = false;

        this.inventoryBar = new InventoryBar(this);
        this.spellBar = new SpellBar();
        this.settingsBar = new SettingsBar();
        //this.exitGamePanel =    new ExitGamePanel();
        this.createAccountPanel = this.addPanel(new CreateAccountPanel());
        this.accountPanel = this.addPanel(new AccountPanel());
        this.statsPanel = this.addPanel(new StatsPanel());
        this.craftingPanel = this.addPanel(new CraftingPanel(this));
        this.bankPanel = this.addPanel(new BankPanel());
        this.clanPanel = this.addPanel(new ClanPanel());
        this.dungeonPanel = this.addPanel(new DungeonPanel());
        //this.generatorPanel =   this.addPanel(new GeneratorPanel());
        this.shopPanel = this.addPanel(new ShopPanel());
        this.tasksPanel = this.addPanel(new TasksPanel());
        this.hintPanel = new HintPanel();
        this.respawnPanel = new RespawnPanel();

        // Show the GUI.
        this.gui.style.visibility = "visible";

        // Hide the chat input at the start.
        this.chatInput.isActive = false;
        this.chatInput.style.visibility = "hidden";

        // Check if the virtual D-pad should be shown at the start.
        if (dungeonz.virtualDPadEnabled === true) this.virtualDPad.style.visibility = "visible";

        // Attach the events so the tooltips appear when the icons are hovered over.
        this.defenceIcon.onmouseover = () => { game.GUI.defenceTooltip.style.visibility = "visible" };
        this.defenceIcon.onmouseout = () => { game.GUI.defenceTooltip.style.visibility = "hidden" };

        this.hitPointIcon.onmouseover = () => { game.GUI.hitPointTooltip.style.visibility = "visible" };
        this.hitPointIcon.onmouseout = () => { game.GUI.hitPointTooltip.style.visibility = "hidden" };

        this.energyIcon.onmouseover = () => { game.GUI.energyTooltip.style.visibility = "visible" };
        this.energyIcon.onmouseout = () => { game.GUI.energyTooltip.style.visibility = "hidden" };

        this.gloryIcon.onmouseover = () => { game.GUI.gloryTooltip.style.visibility = "visible" };
        this.gloryIcon.onmouseout = () => { game.GUI.gloryTooltip.style.visibility = "hidden" };

        this.avatarIcon.onmouseover = () => { game.GUI.avatarTooltip.style.visibility = "visible" };
        this.avatarIcon.onmouseout = () => { game.GUI.avatarTooltip.style.visibility = "hidden" };
        this.avatarIcon.onclick = () => {
            if (game.GUI.statsPanel.isOpen === true) game.GUI.statsPanel.hide();
            else game.GUI.statsPanel.show();
        };

        this.tasksIcon.onmouseover = () => { game.GUI.tasksTooltip.style.visibility = "visible" };
        this.tasksIcon.onmouseout = () => { game.GUI.tasksTooltip.style.visibility = "hidden" };
        this.tasksIcon.onclick = () => {
            if (game.GUI.tasksPanel.isOpen === true) game.GUI.tasksPanel.hide();
            else game.GUI.tasksPanel.show();
        };

        this.mapIcon.onmouseover = () => { game.GUI.mapTooltip.style.visibility = "visible" };
        this.mapIcon.onmouseout = () => { game.GUI.mapTooltip.style.visibility = "hidden" };

        this.clanIcon.onmouseover = () => { game.GUI.clanTooltip.style.visibility = "visible" };
        this.clanIcon.onmouseout = () => { game.GUI.clanTooltip.style.visibility = "hidden" };
        this.clanIcon.onclick = () => {
            if (game.GUI.clanPanel.isOpen === true) game.GUI.clanPanel.hide();
            else game.GUI.clanPanel.show();
        };
        this.clanIcon.style.visibility = "hidden";

        this.inventoryIcon.onmouseover = () => { game.GUI.inventoryTooltip.style.visibility = "visible" };
        this.inventoryIcon.onmouseout = () => { game.GUI.inventoryTooltip.style.visibility = "hidden" };
        this.inventoryIcon.onclick = () => { window.ws.sendEvent('pick_up_item'); };

        this.exitIcon.onmouseover = () => { game.GUI.exitTooltip.style.visibility = "visible" };
        this.exitIcon.onmouseout = () => { game.GUI.exitTooltip.style.visibility = "hidden" };
        this.exitIcon.onclick = () => {
            if (game.player.isLoggedIn) {
                if (game.GUI.accountPanel.isOpen === true) game.GUI.accountPanel.hide();
                else game.GUI.accountPanel.show();
            }
            else {
                if (game.GUI.createAccountPanel.isOpen === true) game.GUI.createAccountPanel.hide();
                else game.GUI.createAccountPanel.show();
            }
        };

        this.discordIcon.onmouseover = () => { game.GUI.discordTooltip.style.visibility = "visible" };
        this.discordIcon.onmouseout = () => { game.GUI.discordTooltip.style.visibility = "hidden" };

        this.wikiIcon.onmouseover = () => { game.GUI.wikiTooltip.style.visibility = "visible" };
        this.wikiIcon.onmouseout = () => { game.GUI.wikiTooltip.style.visibility = "hidden" };

        this.virtualDPadUp.onmousedown = game.moveUpPressed;
        this.virtualDPadUp.onmouseup = game.moveUpReleased;
        this.virtualDPadUp.onmouseout = game.moveUpReleased;

        this.virtualDPadDown.onmousedown = game.moveDownPressed;
        this.virtualDPadDown.onmouseup = game.moveDownReleased;
        this.virtualDPadDown.onmouseout = game.moveDownReleased;

        this.virtualDPadLeft.onmousedown = game.moveLeftPressed;
        this.virtualDPadLeft.onmouseup = game.moveLeftReleased;
        this.virtualDPadLeft.onmouseout = game.moveLeftReleased;

        this.virtualDPadRight.onmousedown = game.moveRightPressed;
        this.virtualDPadRight.onmouseup = game.moveRightReleased;
        this.virtualDPadRight.onmouseout = game.moveRightReleased;

        // References to the DOM elements for the variable things.
        this.hitPointCounters = [];
        this.energyCounters = [];

        this.addHitPointCounters(20);
        this.addEnergyCounters(this.game.player.maxEnergy);

        this.stopDungeonTimer();

        // Set the values for the text based counters (glory, coins).
        this.gloryCounter.innerText = this.game.player.glory;
        this.gloryCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);

        this.dragData = null;

        this.updateDungeonKeysList({});

        this.gui.ondragenter = (event) => {
            event.preventDefault();
        };
        this.gui.ondragover = (event) => {
            event.preventDefault();
        };
        this.gui.ondrop = (event) => {
            event.preventDefault();
        };

        this.gameCanvas.ondragenter = (event) => {
            event.preventDefault();
        };
        this.gameCanvas.ondragover = (event) => {
            event.preventDefault();
        };
        // If an inventory item is dropped onto the game canvas, drop it.
        this.gameCanvas.ondrop = (event) => {
            event.preventDefault();

            if (_this.GUI.dragData === null) return; // TODO: this can just be `this` now with arrow funcs
            // If it was from the inventory bar, drop the item.
            if (_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer) {
                window.ws.sendEvent('drop_item', _this.GUI.dragData.inventorySlot.slotKey);
            }
        };

    }

    /**
     * @param {PanelTemplate} panel
     * @returns {PanelTemplate}
     */
    addPanel(panel) {
        this.panels.push(panel);
        // Make the various panels draggable.
        //this.makeElementDraggable(panel.icon, panel.topContainer);
        return panel;
    }

    hideAllPanels() {
        this.panels.forEach((panel) => {
            panel.hide();
        });
    }

    addHitPointCounters(amount) {
        this.addCounters(amount, this.hitPointIcon, 'hitpoint', this.hitPointCounters);
    }

    addEnergyCounters(amount) {
        this.addCounters(amount, this.energyIcon, 'energy', this.energyCounters);
    }

    textCounterSetText(element, value) {
        // Clear the previous animation.
        element.style.animationName = "none";
        // Trigger reflow.
        element.offsetHeight;

        element.style.visibility = "visible";
        element.style.webkitAnimationName = 'fadeOut';
        element.innerText = value;
    }

    textCounterWebkitAnimationEnd() {
        this.style.webkitAnimationName = '';
        this.style.visibility = "hidden";
    }

    addCounters(amount, icon, type, groupArray) {

        this.removeExistingDOMElements(groupArray);

        const iconTop = icon.offsetTop;
        const halfIconHeight = icon.clientHeight / 2;
        const halfCounterHeight = 8;
        const container = document.getElementById(type + "_counters");

        for (let i = 0; i < amount; i += 1) {
            const element = document.createElement('img');

            element.src = 'assets/img/gui/hud/' + type + '-counter.png';

            element.draggable = false;

            element.className = "gui_counter_icon";

            element.style.top = (halfIconHeight - halfCounterHeight) + iconTop + 'px';
            element.style.left = (46 + (18 * i)) + 'px';

            groupArray.push(element);

            container.appendChild(element);
        }
    }

    removeExistingDOMElements(groupObject) {
        //console.log("remove existing counters, ", groupObject);

        // Check if the group is an array, such as the energy/HP counters.
        if (Array.isArray(groupObject)) {
            //console.log("group is an array");
            if (groupObject.length < 1) return;

            // Remove any existing icons of this type.
            for (let i = 0; i < groupObject.length; i += 1) {
                //console.log("removing counter");
                //console.dir(groupObject[i]);
                groupObject[i].remove();
            }
            // Empty the object.
            groupObject.length = 0;
        }
        // Is a regular object.
        else {
            //console.log("group is an object");
            // Remove any existing icons of this type.
            for (let key in groupObject) {
                if (groupObject.hasOwnProperty(key) === false) continue;
                //console.log("removing counter");
                //console.dir(groupObject[key]);
                groupObject[key].remove();
            }
        }

    }

    updateDefenceCounter() {
        this.defenceCounter.innerText = this.game.player.defence;
    }

    updateHitPointCounters() {
        // Hitpoints might be in 0.5s as well as whole numbers, so round down to only count each full hitpoint counter.
        let hitPoints = Math.floor(this.game.player.hitPoints);
        let maxHitPoints = this.game.player.maxHitPoints;
        // Get the % of HP this player has.
        hitPoints = Math.floor((hitPoints / maxHitPoints) * this.hitPointCounters.length);

        for (let i = 0; i < this.hitPointCounters.length; i += 1) {
            if (i < hitPoints) {
                this.hitPointCounters[i].src = "./assets/img/gui/hud/hitpoint-counter.png";
            }
            else {
                this.hitPointCounters[i].src = "./assets/img/gui/hud/empty-counter.png";
            }
        }
    }

    updateEnergyCounters() {
        // Energy can be in 0.5s as well as whole numbers, so round down to only count each full energy counter.
        let energy = Math.floor(this.game.player.energy);
        let maxEnergy = this.game.player.maxEnergy;

        for (let i = 0; i < maxEnergy; i += 1) {
            if (i < energy) {
                this.energyCounters[i].src = "./assets/img/gui/hud/energy-counter.png";
            }
            else {
                this.energyCounters[i].src = "./assets/img/gui/hud/empty-counter.png";
            }
        }
    }

    updateGloryCounter(value) {
        const difference = value - _this.player.glory;
        if (difference > 0) {
            this.textCounterSetText(this.gloryCounterTransition, "+" + difference);
        }
        else {
            this.textCounterSetText(this.gloryCounterTransition, difference);
        }
        this.game.player.glory = value;
        this.gloryCounter.innerText = value;
    }

    startDungeonTimer(timeRemainingMinutes) {
        this.dungeonTimerContainer.style.visibility = "visible";

        this.timeRemainingSeconds = timeRemainingMinutes * 60;

        this.dungeonTimerValue.innerText = this.timeRemainingSeconds;

        // Add one so they don't lose one second immediately.
        this.timeRemainingSeconds += 1;

        const timer = () => {
            this.timeRemainingSeconds -= 1;
            this.dungeonTimerValue.innerText = this.timeRemainingSeconds;

            if (this.timeRemainingSeconds > 0) {
                this.dungeonTimerCounter = setTimeout(timer, 1000);
            }
        }

        // Start a countdown that ticks every second.
        timer();
    }

    stopDungeonTimer() {
        clearTimeout(this.dungeonTimerCounter);
        this.dungeonTimerContainer.style.visibility = "hidden";
    }

    updateDungeonKeysList(keys) {
        // Remove all current key icons.
        while (this.dungeonKeysList.firstChild) {
            this.dungeonKeysList.firstChild.remove();
        }

        // Add an icon for each key.
        Object.entries(keys).forEach(([colour, amount]) => {
            for (let i = 0; i < amount; i += 1) {
                const element = document.createElement('img');
                element.src = 'assets/img/gui/hud/' + colour + '-key.png';
                element.draggable = false;
                element.className = "dungeon_key_icon";
                this.dungeonKeysList.appendChild(element);
            }
        });

        if (this.dungeonKeysList.childElementCount > 0) {
            this.dungeonKeysList.style.visibility = "visible";
        }
        else {
            this.dungeonKeysList.style.visibility = "hidden";
        }
    }

    makeElementDraggable(handle, container) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.left = (container.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

}

export default GUI;