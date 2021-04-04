import { PlayerState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.task_progress_made = (data) => {
        PlayerState.modifyTaskProgress(data.taskId, data.progress);
    };

    eventResponses.task_claimed = (data) => {
        PlayerState.removeTask(data);
    };

    eventResponses.task_added = (data) => {
        PlayerState.addTask(data);
    };
};
