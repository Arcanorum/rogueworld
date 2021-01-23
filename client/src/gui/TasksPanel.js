
//import TaskTypes from '../../src/catalogues/TaskTypes'
import ItemTypes from '../../src/catalogues/ItemTypes'
import PanelTemplate from "./PanelTemplate";

class TaskSlot {
    /**
     *
     * @param {PanelTemplate} panel
     * @param {Object} task
     * @param {String} task.taskID
     * @param {Number} task.progress
     * @param {Number} task.completionThreshold
     * @param {Array} task.rewardItemTypeNumbers
     * @param {Number} task.rewardGlory
     */
    constructor (panel, task) {
        //const task = TaskTypes[taskID];
        // Check the client actually has this task. Might not have it updated with a new one.
        if(task === undefined) return;

        this.container = document.createElement('div');
        this.container.className = 'task_slot_cont';

        this.taskName = document.createElement('div');
        this.taskName.className = 'task_slot_cell task_slot_task_name';
        let textName = dungeonz.getTextDef("Task ID: " + task.taskID);
        // If the task text def is not defined at all (in any language), at least show the task ID.
        if(textName === '???') textName = task.taskID;
        this.taskName.innerText = textName;

        this.progress = document.createElement('div');
        this.progress.className = 'task_slot_cell';
        this.progress.innerText = task.progress + "/" + task.completionThreshold;

        this.rewardContainer = document.createElement('div');
        this.rewardContainer.className = 'task_reward_cont task_slot_cell';

        this.rewardItemCont1 = document.createElement('div');
        this.rewardItemCont1.className = "task_reward_item_cont";
        this.rewardItemCont1.onmouseover = panel.rewardItemMouseOver;
        this.rewardItemCont1.onmouseout = panel.rewardItemMouseOut;
        this.rewardContainer.appendChild(this.rewardItemCont1);

        this.rewardItemIcon1 = document.createElement('img');
        this.rewardItemIcon1.className = "task_reward_item";
        this.rewardItemCont1.appendChild(this.rewardItemIcon1);

        this.rewardItemCont2 = document.createElement('div');
        this.rewardItemCont2.className = "task_reward_item_cont";
        this.rewardItemCont2.onmouseover = panel.rewardItemMouseOver;
        this.rewardItemCont2.onmouseout = panel.rewardItemMouseOut;
        this.rewardContainer.appendChild(this.rewardItemCont2);

        this.rewardItemIcon2 = document.createElement('img');
        this.rewardItemIcon2.className = "task_reward_item";
        this.rewardItemCont2.appendChild(this.rewardItemIcon2);

        this.rewardItemCont3 = document.createElement('div');
        this.rewardItemCont3.className = "task_reward_item_cont";
        this.rewardItemCont3.onmouseover = panel.rewardItemMouseOver;
        this.rewardItemCont3.onmouseout = panel.rewardItemMouseOut;
        this.rewardContainer.appendChild(this.rewardItemCont3);

        this.rewardItemIcon3 = document.createElement('img');
        this.rewardItemIcon3.className = "task_reward_item";
        this.rewardItemCont3.appendChild(this.rewardItemIcon3);

        if(task.rewardItemTypeNumbers[0]){
            this.rewardItemIcon1.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[0]].iconSource + '.png';
            this.rewardItemIcon1.style.visibility = "visible";
            this.rewardItemCont1.setAttribute('itemNumber', task.rewardItemTypeNumbers[0]);
        }

        if(task.rewardItemTypeNumbers[1]){
            this.rewardItemIcon2.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[1]].iconSource + '.png';
            this.rewardItemIcon2.style.visibility = "visible";
            this.rewardItemCont2.setAttribute('itemNumber', task.rewardItemTypeNumbers[1]);
        }

        if(task.rewardItemTypeNumbers[2]){
            this.rewardItemIcon3.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[2]].iconSource + '.png';
            this.rewardItemIcon3.style.visibility = "visible";
            this.rewardItemCont3.setAttribute('itemNumber', task.rewardItemTypeNumbers[2]);
        }

        this.rewardGloryIcon = document.createElement('img');
        this.rewardGloryIcon.className = 'task_glory_icon';
        this.rewardGloryIcon.src = 'assets/img/gui/hud/glory-icon.png';
        this.rewardGloryAmount = document.createElement('div');
        this.rewardGloryAmount.innerText = task.rewardGlory;

        this.rewardContainer.appendChild(this.rewardGloryIcon);
        this.rewardContainer.appendChild(this.rewardGloryAmount);

        this.container.onclick = panel.slotClick;
        // Store the task ID of the task this slot is for on the slot itself.
        this.container.setAttribute('taskID', task.taskID);

        this.container.appendChild(this.taskName);
        this.container.appendChild(this.progress);
        this.container.appendChild(this.rewardContainer);

        panel.listContainer.appendChild(this.container);

        this.completed = false;
        // Check this task is already completed. Progress might have been made before, but
        // the completion threshold lowered since they last played, and thus now is complete.
        if(task.progress >= task.completionThreshold){
            this.setCompleted();
            this.completed = true;
        }
    }

    setDefault () {
        this.taskName.style.backgroundColor = _this.GUI.GUIColours.taskSlotDefault;
        this.progress.style.backgroundColor = _this.GUI.GUIColours.taskSlotDefault;
        this.rewardContainer.style.backgroundColor = _this.GUI.GUIColours.taskSlotDefault;
    }

    // setTracking () {
    //     this.taskName.style.backgroundColor = _this.GUI.GUIColours.taskSlotTracking;
    //     this.progress.style.backgroundColor = _this.GUI.GUIColours.taskSlotTracking;
    //     this.rewardContainer.style.backgroundColor = _this.GUI.GUIColours.taskSlotTracking;
    // }

    setCompleted () {
        this.taskName.style.backgroundColor = _this.GUI.GUIColours.taskSlotCompleted;
        this.progress.style.backgroundColor = _this.GUI.GUIColours.taskSlotCompleted;
        this.rewardContainer.style.backgroundColor = _this.GUI.GUIColours.taskSlotCompleted;
    }
}

class TasksPanel extends PanelTemplate {
    constructor (tasks) {
        super(document.getElementById('tasks_panel'), 540, 380, dungeonz.getTextDef('Tasks'), 'gui/hud/tasks-icon');

        this.innerContainer = document.createElement('div');
        this.innerContainer.id = 'tasks_inner_cont';
        this.contentsContainer.appendChild(this.innerContainer);

        this.headingsContainer = document.createElement('div');
        this.headingsContainer.id = 'tasks_headings_cont';
        this.innerContainer.appendChild(this.headingsContainer);

        const taskText = document.createElement('div');
        taskText.innerText = dungeonz.getTextDef('Task');
        const progressText = document.createElement('div');
        progressText.innerText = dungeonz.getTextDef('Progress');
        const rewardText = document.createElement('div');
        rewardText.innerText = dungeonz.getTextDef('Reward');
        this.headingsContainer.appendChild(taskText);
        this.headingsContainer.appendChild(progressText);
        this.headingsContainer.appendChild(rewardText);

        const spacer = document.createElement('div');
        spacer.className = 'panel_template_spacer';
        this.innerContainer.appendChild(spacer);

        this.listContainer = document.createElement('div');
        this.listContainer.id = 'tasks_list_cont';
        this.innerContainer.appendChild(this.listContainer);

        this.bottomContainer = document.createElement('div');
        this.bottomContainer.id = 'tasks_bottom_cont';
        this.innerContainer.appendChild(this.bottomContainer);

        this.trackButtonContainer = document.createElement('div');
        this.trackButtonContainer.className = 'tasks_bottom_button_cont';
        this.bottomContainer.appendChild(this.trackButtonContainer);

        this.trackButton = document.createElement('img');
        this.trackButton.className = 'centered tasks_bottom_button';
        this.trackButton.src = 'assets/img/gui/panels/track-button-border-inactive.png';
        this.trackButton.draggable = false;
        this.trackButtonContainer.appendChild(this.trackButton);

        const trackText = document.createElement('div');
        trackText.innerText = dungeonz.getTextDef('Track');
        trackText.className = 'centered tasks_bottom_text';
        this.trackButtonContainer.appendChild(trackText);

        this.claimButtonContainer = document.createElement('div');
        this.claimButtonContainer.className = 'tasks_bottom_button_cont';
        this.bottomContainer.appendChild(this.claimButtonContainer);

        this.claimButton = document.createElement('img');
        this.claimButton.className = 'centered tasks_bottom_button';
        this.claimButton.src = 'assets/img/gui/panels/claim-button-border-invalid.png';
        this.claimButton.draggable = false;
        this.claimButtonContainer.appendChild(this.claimButton);

        const claimText = document.createElement('div');
        claimText.innerText = dungeonz.getTextDef('Claim');
        claimText.className = 'centered tasks_bottom_text';
        this.claimButtonContainer.appendChild(claimText);

        this.claimButtonContainer.onclick = this.claimPressed;

        this.tooltip = document.createElement('div');
        this.tooltip.id = "tasks_panel_tooltip";

        /**
         * @type {Object.<TaskSlot>} Each task slot instance, accessed by the task ID of the task it is for.
         */
        this.taskSlots = {};

        // The currently selected slot.
        this.selectedSlot = null;
    }

    show () {
        super.show();

        _this.GUI.isAnyPanelOpen = true;

        // Show the reward item icons.
        for(let taskKey in this.taskSlots){
            if(this.taskSlots.hasOwnProperty(taskKey) === false) continue;
            const taskSlot = this.taskSlots[taskKey];
            taskSlot.rewardItemIcon1.style.visibility = "visible";
            taskSlot.rewardItemIcon2.style.visibility = "visible";
            taskSlot.rewardItemIcon3.style.visibility = "visible";
        }
    }

    hide () {
        super.hide();

        _this.GUI.isAnyPanelOpen = false;

        // If a slot is selected, deselect it.
        if(this.selectedSlot !== null){
            this.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.taskSlotUnselected;
            this.selectedSlot.container.style.borderColor = _this.GUI.GUIColours.taskSlotUnselected;
            this.selectedSlot = null;
        }
        // Hide the reward item icons and the claim button, as they have their visibility set.
        for(let taskKey in this.taskSlots){
            if(this.taskSlots.hasOwnProperty(taskKey) === false) continue;
            const taskSlot = this.taskSlots[taskKey];
            taskSlot.rewardItemIcon1.style.visibility = "hidden";
            taskSlot.rewardItemIcon2.style.visibility = "hidden";
            taskSlot.rewardItemIcon3.style.visibility = "hidden";
        }
    }

    rewardItemMouseOver () {
        const tooltip = _this.GUI.tasksPanel.tooltip;
        // If there is an item in this reward slot, show the tooltip with its name.
        const itemNumber = this.getAttribute('itemNumber');
        if(ItemTypes[itemNumber]){
            tooltip.innerText = dungeonz.getTextDef("Item name: " + ItemTypes[this.getAttribute('itemNumber')].translationID);
            tooltip.style.visibility = 'visible';
            this.appendChild(tooltip);
        }
    }

    rewardItemMouseOut () {
        _this.GUI.tasksPanel.tooltip.style.visibility = 'hidden';
    }

    claimPressed () {
        const tasksPanel = _this.GUI.tasksPanel;

        // Check a slot is actually selected.
        if(tasksPanel.selectedSlot === null) return;

        // Get the selected slot task ID.
        ws.sendEvent("task_claim_reward", tasksPanel.selectedSlot.container.getAttribute('taskID'));

        // Assume it will be claimed successfully, so default the claim button.
        tasksPanel.claimButton.src = 'assets/img/gui/panels/claim-button-border-invalid.png';
    }

    /**
     *
     * @param {Object} task
     */
    addTask (task) {
        _this.player.tasks[task.taskID] = task;
        this.taskSlots[task.taskID] = new TaskSlot(this, task);
    }

    /**
     *
     * @param {String} taskID
     */
    removeTask (taskID) {
        this.taskSlots[taskID].container.remove();
        delete this.taskSlots[taskID];
        delete _this.player.tasks[taskID];
    }

    updateTaskProgress (taskID, progress) {
        _this.player.tasks[taskID].progress = progress;
        const taskSlot = this.taskSlots[taskID];
        taskSlot.progress.innerText = progress + "/" + _this.player.tasks[taskID].completionThreshold;
        // If the progress is now enough for the completion threshold, make the slot green.
        if(progress >= _this.player.tasks[taskID].completionThreshold){
            taskSlot.setCompleted();
            taskSlot.completed = true;
            // Tell them via a chat message.
            _this.chat(undefined, dungeonz.getTextDef("Task completed"), "#50ff7f");
        }
    }

    slotClick () {
        const tasksPanel = _this.GUI.tasksPanel;
        // If nothing is selected, select this slot.
        if(tasksPanel.selectedSlot === null){
            const slot = tasksPanel.taskSlots[this.getAttribute('taskID')];
            tasksPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.taskSlotSelected;
            slot.container.style.borderColor = _this.GUI.GUIColours.taskSlotSelected;
            // Show the claim button if the task is complete.
            if(tasksPanel.selectedSlot.completed === true) tasksPanel.claimButton.src = 'assets/img/gui/panels/claim-button-border-valid.png';
            else tasksPanel.claimButton.src = 'assets/img/gui/panels/claim-button-border-invalid.png'
        }
        // The selected slot was selected again, deselect it.
        else if(tasksPanel.selectedSlot.container === this){
            tasksPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.taskSlotUnselected;
            tasksPanel.selectedSlot.container.style.borderColor = _this.GUI.GUIColours.taskSlotUnselected;
            tasksPanel.selectedSlot = null;
            tasksPanel.claimButton.src = 'assets/img/gui/panels/claim-button-border-invalid.png';
        }
        // A slot is already selected, deselect it and select this one.
        else {
            tasksPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.taskSlotUnselected;
            tasksPanel.selectedSlot.container.style.borderColor = _this.GUI.GUIColours.taskSlotUnselected;
            const slot = tasksPanel.taskSlots[this.getAttribute('taskID')];
            tasksPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.taskSlotSelected;
            slot.container.style.borderColor = _this.GUI.GUIColours.taskSlotSelected;
            // Show the claim button if the task is complete.
            if(tasksPanel.selectedSlot.completed === true) tasksPanel.claimButton.src = 'assets/img/gui/panels/claim-button-border-valid.png';
            else tasksPanel.claimButton.src = 'assets/img/gui/panels/claim-button-border-invalid.png';
        }
    }

}

export default TasksPanel;