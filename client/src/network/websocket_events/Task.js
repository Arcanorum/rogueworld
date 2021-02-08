import eventResponses from "./EventResponses";

export default () => {
    eventResponses.task_progress_made = (data) => {
        // console.log("task progresss made, data:", data);
        window.gameScene.GUI.tasksPanel.updateTaskProgress(data.taskID, data.progress);
    };

    eventResponses.task_claimed = (data) => {
        // console.log("task claimed, data:", data);
        window.gameScene.GUI.tasksPanel.removeTask(data);
    };

    eventResponses.task_added = (data) => {
        // console.log("task added, data:", data);
        if (window.gameScene.GUI === undefined) return;

        window.gameScene.GUI.tasksPanel.addTask(data);
    };
};
