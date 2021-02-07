import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import "./TasksPanel.scss";
import tasksIcon from "../../../../../assets/images/gui/hud/tasks-icon.png";
import { TASKS_VALUE } from "../../../../../shared/EventTypes";
import { PlayerState } from "../../../../../shared/state/States";
import Utils from "../../../../../shared/Utils";
import ItemIconList from "../../../../../shared/ItemIconList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import trackButtonBorderActiveImage from "../../../../../assets/images/gui/panels/tasks/track-button-border-active.png";
import trackButtonBorderInactiveImage from "../../../../../assets/images/gui/panels/tasks/track-button-border-inactive.png";
import claimButtonBorderValidImage from "../../../../../assets/images/gui/panels/tasks/claim-button-border-valid.png";
import claimButtonBorderInvalidImage from "../../../../../assets/images/gui/panels/tasks/claim-button-border-invalid.png";
import Player from "../../../../../shared/state/Player";

function RewardItem({ rewardItemTypeNumber }) {
    return (
        <div className="reward-item-cont">
            {rewardItemTypeNumber && (
                <img
                  className="reward-item"
                  src={ItemIconList[ItemTypes[rewardItemTypeNumber].iconSource]}
                />
            )}
        </div>
    );
}

RewardItem.propTypes = {
    rewardItemTypeNumber: PropTypes.number.isRequired,
};

function TaskSlot({ task, setSelectedTaskID, selectedTaskID }) {
    // TODO: some weird shit where this state prop isnt showing as the right value in the template...
    // was same problem doing it for `selected`
    const [completed, setCompleted] = useState(
        task.progress >= task.completionThreshold,
    );

    return (
        <div
          className={`slot-cont ${task.taskID === selectedTaskID ? "selected" : ""}`}
          onClick={() => {
              // The selected slot was selected again, deselect it.
              if (selectedTaskID === task.taskID) {
                  setSelectedTaskID(null);
              }
              // Another slot (or none at all) is selected, select this slot instead.
              else {
                  setSelectedTaskID(task.taskID);
              }
          }}
        >
            <div className={`slot-cell slot-task-name ${completed ? "completed" : ""}`}>
                {Utils.getTextDef(`Task ID: ${task.taskID}`)}
            </div>
            <div className={`slot-cell ${completed ? "completed" : ""}`}>
                {`${task.progress}/${task.completionThreshold}`}
            </div>
            <div className={`slot-cell reward-cont ${completed ? "completed" : ""}`}>
                {task.rewardItemTypeNumbers.map((typeNumber) => (
                    <RewardItem key={typeNumber} rewardItemTypeNumber={typeNumber} />
                ))}
            </div>
        </div>
    );
}

TaskSlot.propTypes = {
    task: PropTypes.object.isRequired,
    setSelectedTaskID: PropTypes.func.isRequired,
    selectedTaskID: PropTypes.string,
};

TaskSlot.defaultProps = {
    selectedTaskID: null,
};

function TasksPanel({ onCloseCallback }) {
    const [selectedTaskID, setSelectedTaskID] = useState(null);
    const [tasks, setTasks] = useState(PlayerState.tasks);
    const [claimValid, setClaimValid] = useState(false);

    useEffect(() => {
        // Get the task data of the selected task slot.
        const task = PlayerState.tasks[selectedTaskID];

        // Show the claim button if the task is complete.
        if (task && task.progress >= task.completionThreshold) {
            setClaimValid(true);
        }
        else {
            setClaimValid(false);
        }
    }, [selectedTaskID]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(TASKS_VALUE, (msd, data) => {
                setTasks(data.new);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    const onClaimPressed = () => {
        // Check a slot is actually selected.
        if (selectedTaskID === null) return;

        // Get the selected slot task ID.
        window.ws.sendEvent("task_claim_reward", selectedTaskID.container.getAttribute("taskID"));

        // Assume it will be claimed successfully, so default the claim button.
        setClaimValid(false);
    };

    return (
        <div className="tasks-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width={540}
              height={360}
              panelName={Utils.getTextDef("Tasks")}
              icon={tasksIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="headings-cont">
                        <div>{Utils.getTextDef("Task")}</div>
                        <div>{Utils.getTextDef("Progress")}</div>
                        <div>{Utils.getTextDef("Reward")}</div>
                    </div>
                    <div className="panel-template-spacer" />
                    <div className="list-cont">
                        {tasks && Object.entries(tasks).map(([taskID, task]) => (
                            <TaskSlot
                              key={taskID}
                              task={task}
                              setSelectedTaskID={setSelectedTaskID}
                              selectedTaskID={selectedTaskID}
                            />
                        ))}
                    </div>
                    <div className="bottom-cont">
                        <div className="bottom-button-cont">
                            <img
                              className="centered bottom-button"
                              src={trackButtonBorderInactiveImage}
                              draggable={false}
                            />
                            <div className="centered bottom-text">
                                {Utils.getTextDef("Track")}
                            </div>
                        </div>
                        {claimValid && (
                            <div
                              className="bottom-button-cont"
                              onClick={onClaimPressed}
                            >
                                <img
                                  className="centered bottom-button"
                                  src={claimButtonBorderValidImage}
                                  draggable={false}
                                />
                                <div className="centered bottom-text">
                                    {Utils.getTextDef("Claim")}
                                </div>
                            </div>
                        )}
                        {!claimValid && (
                            <div
                              className="bottom-button-cont"
                            >
                                <img
                                  className="centered bottom-button"
                                  src={claimButtonBorderInvalidImage}
                                  draggable={false}
                                />
                                <div className="centered bottom-text">
                                    {Utils.getTextDef("Claim")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

TasksPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default TasksPanel;
