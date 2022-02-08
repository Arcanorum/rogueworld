import { error, getRandomElement } from '@dungeonz/utils';
import TaskTypes from './TaskTypes';

class TaskType {
    taskId: string;

    otherTasks: Array<TaskType> = [];

    category: Array<TaskType>;

    constructor(taskId: string, category: Array<TaskType>) {
        if (TaskTypes[taskId] !== undefined) {
            error(`Cannot create new task type, task name already exists in task types list: ${taskId}`);
        }
        this.taskId = taskId;
        this.category = category;
        category.push(this);
    }

    getOtherTask() {
        return getRandomElement(this.otherTasks);
    }
}

export default TaskType;
