import React, { useState } from "react";
import "./TaskTracker.scss";

function TaskTracker() {
    return (
        <div className="task-tracker">
            <div className="task">
                Craft: Iron daggers
            </div>
            <div className="progress"> 9/15</div>

        </div>
    );
}

export default TaskTracker;
