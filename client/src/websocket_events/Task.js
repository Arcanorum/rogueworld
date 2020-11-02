export default (eventResponses) => {
    eventResponses.task_progress_made = (data) => {
        //console.log("task progresss made, data:", data);
        _this.GUI.tasksPanel.updateTaskProgress(data.taskID, data.progress);
    };

    eventResponses.task_claimed = (data) => {
        //console.log("task claimed, data:", data);
        _this.GUI.tasksPanel.removeTask(data);
    };

    eventResponses.task_added = (data) => {
        //console.log("task added, data:", data);
        if (_this.GUI === undefined) return;

        _this.GUI.tasksPanel.addTask(data);
    };
};