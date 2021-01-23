import React, { useState } from "react";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";
import PanelButton from "./PanelButton";
import StatsPanel from "./panels/stats_panel/StatsPanel";
import statsIcon from "../../../assets/images/gui/hud/stats-icon.png";
import tasksIcon from "../../../assets/images/gui/hud/tasks-icon.png";
import TasksPanel from "./panels/tasks_panel/TasksPanel";
import TaskTracker from "./panels/task_tracker/TaskTracker";

const Panels = {
    NONE: Symbol("NONE"),
    Stats: Symbol("Stats"),
    Tasks: Symbol("Tasks"),
};

function GUI() {
    const [shownPanel, setShownPanel] = useState(false);
    const [trackedTask, setTrackedTask] = useState(null);

    return (
        <div className="gui">
            <Meters />

            {trackedTask && <TaskTracker />}

            <div className="top-left-corner-cont gui-zoomable">
                <GloryCounter />
                <DefenceCounter />
                <PanelButton
                  icon={statsIcon}
                  onClick={() => {
                      setShownPanel(Panels.Stats);
                  }}
                  tooltip="stats tooltip"
                />
                <PanelButton
                  icon={tasksIcon}
                  onClick={() => {
                      setShownPanel(Panels.Tasks);
                  }}
                  tooltip="stats tooltip"
                />
            </div>

            <div className="panel-cont">
                {shownPanel === Panels.Stats && (
                <StatsPanel
                  onCloseCallback={() => {
                      setShownPanel(Panels.NONE);
                  }}
                />
                )}
                {shownPanel === Panels.Tasks && (
                <TasksPanel
                  onCloseCallback={() => {
                      setShownPanel(Panels.NONE);
                  }}
                />
                )}
            </div>

            <input
              id="chat-input"
              type="text"
              minLength="1"
              maxLength="46"
              placeholder="Enter a message"
            />
        </div>
    );
}

export default GUI;
