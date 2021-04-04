import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import "./TasksPanel.scss";
import tasksIcon from "../../../../../assets/images/gui/hud/tasks-icon.png";
import gloryIcon from "../../../../../assets/images/gui/hud/glory-icon.png";
import { TASKS_VALUE, TASK_PROGRESS } from "../../../../../shared/EventTypes";
import { ApplicationState, GUIState, PlayerState } from "../../../../../shared/state/States";
import Utils from "../../../../../shared/Utils";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
// import trackButtonBorderActiveImage from "../../../../../assets/images/gui/panels/tasks/track-button-border-active.png";
import trackButtonBorderInactiveImage from "../../../../../assets/images/gui/panels/tasks/track-button-border-inactive.png";
import claimButtonBorderValidImage from "../../../../../assets/images/gui/panels/tasks/claim-button-border-valid.png";
import claimButtonBorderInvalidImage from "../../../../../assets/images/gui/panels/tasks/claim-button-border-invalid.png";
import ItemTooltip from "../../item_tooltip/ItemTooltip";

function RewardItem({ rewardItemTypeCode }) {
    return (
        <div
          className="reward-item-cont"
          draggable={false}
          onMouseEnter={() => {
              GUIState.setTooltipContent(
                  <ItemTooltip itemTypeCode={rewardItemTypeCode} />,
              );
          }}
          onMouseLeave={() => {
              GUIState.setTooltipContent(null);
          }}
        >
            {rewardItemTypeCode && (
                <img
                  className="reward-item"
                  src={ItemIconsList[ItemTypes[rewardItemTypeCode].iconSource]}
                />
            )}
        </div>
    );
}

RewardItem.propTypes = {
    rewardItemTypeCode: PropTypes.string.isRequired,
};

function TaskSlot({ task, setSelectedTaskID, selectedTaskID }) {
    // TODO: some weird shit where this state prop isnt showing as the right value in the template...
    // was same problem doing it for `selected`
    const [completed, setCompleted] = useState(
        task.progress >= task.completionThreshold,
    );

    return (
        <div
          className={`slot-cont ${task.taskId === selectedTaskID ? "selected" : ""}`}
          onClick={() => {
              // The selected slot was selected again, deselect it.
              if (selectedTaskID === task.taskId) {
                  setSelectedTaskID(null);
              }
              // Another slot (or none at all) is selected, select this slot instead.
              else {
                  setSelectedTaskID(task.taskId);
              }
          }}
        >
            <div className={`slot-cell slot-task-name-cont ${completed ? "completed" : ""}`}>
                <div className="slot-task-name">
                    {Utils.getTextDef(`Task ID: ${task.taskId}`)}
                </div>
            </div>
            <div className={`slot-cell ${completed ? "completed" : ""}`}>
                {`${task.progress}/${task.completionThreshold}`}
            </div>
            <div className={`slot-cell reward-cont ${completed ? "completed" : ""}`}>
                {task.rewardItemTypeCodes.map((typeCode) => (
                    <RewardItem key={typeCode} rewardItemTypeCode={typeCode} />
                ))}
                <div className="glory">
                    <img src={gloryIcon} draggable={false} />
                    <span>{task.rewardGlory}</span>
                </div>
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
            PubSub.subscribe(TASKS_VALUE, (msg, data) => {
                setTasks({ ...data.new });
            }),
            PubSub.subscribe(TASK_PROGRESS, () => {
                setTasks({ ...PlayerState.tasks });
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

        ApplicationState.connection.sendEvent("task_claim_reward", selectedTaskID);

        // Assume it will be claimed successfully, so default the claim button.
        setClaimValid(false);
    };

    return (
        <div className="tasks-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="540px"
              height="360px"
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
                        {tasks && Object.values(tasks).map((task) => (
                            <TaskSlot
                              key={task.taskId}
                              task={task}
                              setSelectedTaskID={setSelectedTaskID}
                              selectedTaskID={selectedTaskID}
                            />
                        ))}
                    </div>
                    <div className="bottom-cont">
                        <div className="bottom-button-cont">
                            {/* <img
                              className="centered bottom-button"
                              src={trackButtonBorderInactiveImage}
                              draggable={false}
                            />
                            <div className="centered bottom-text">
                                {Utils.getTextDef("Track")}
                            </div> */}
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
