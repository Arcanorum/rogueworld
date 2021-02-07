import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";
import PanelButton from "./panel_button/PanelButton";
import StatsPanel from "./panels/stats_panel/StatsPanel";
import TasksPanel from "./panels/tasks_panel/TasksPanel";
import CreateAccountPanel from "./panels/create_account_panel/CreateAccountPanel";
import TaskTracker from "./task_tracker/TaskTracker";
import Utils from "../../../shared/Utils";
import AccountPanel from "./panels/account_panel/AccountPanel";
import { ApplicationState } from "../../../shared/state/States";
import statsIcon from "../../../assets/images/gui/hud/stats-icon.png";
import tasksIcon from "../../../assets/images/gui/hud/tasks-icon.png";
import exitIcon from "../../../assets/images/gui/hud/exit-icon.png";
import discordIcon from "../../../assets/images/gui/hud/notdiscord-icon.png";
import wikiIcon from "../../../assets/images/gui/hud/notwiki-icon.png";
import inventoryIcon from "../../../assets/images/gui/hud/inventory-icon.png";
import settingsIcon from "../../../assets/images/gui/hud/settings-icon.png";
import { DUNGEON_PORTAL_PRESSED, LOGGED_IN, POSITION_VALUE } from "../../../shared/EventTypes";
import ChatInput from "./chat_input/ChatInput";
import DungeonPanel from "./panels/dungeon_panel/DungeonPanel";

const Panels = {
    NONE: Symbol("NONE"),
    CreateAccount: Symbol("CreateAccount"),
    Account: Symbol("Account"),
    Dungeon: Symbol("Dungeon"),
    Stats: Symbol("Stats"),
    Tasks: Symbol("Tasks"),
};

function GUI() {
    const [shownPanel, setShownPanel] = useState(null);
    const [trackedTask, setTrackedTask] = useState(null);
    const [loggedIn, setLoggedIn] = useState(ApplicationState.loggedIn);
    const [targetDungeonPortal, setTargetDungeonPortal] = useState(null);
    const discordInviteLink = "https://discord.com/invite/7wjyU7B";
    const wikiLink = "https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki";

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOGGED_IN, (msg, data) => {
                setLoggedIn(data.new);
            }),
            PubSub.subscribe(DUNGEON_PORTAL_PRESSED, (msg, portal) => {
                // Set the target portal before changing the
                // panel, or it won't know what info to load.
                setTargetDungeonPortal(portal);
                setShownPanel(Panels.Dungeon);
            }),
            PubSub.subscribe(POSITION_VALUE, () => {
                setShownPanel(Panels.NONE);
                setTargetDungeonPortal(null);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    useEffect(() => {
        // If there were looking at the create account
        // panel, switch to the account panel.
        if (shownPanel === Panels.CreateAccount) {
            setShownPanel(Panels.Account);
        }
    }, [loggedIn]);

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
                  tooltip={Utils.getTextDef("Avatar tooltip")}
                />
                <PanelButton
                  icon={tasksIcon}
                  onClick={() => {
                      setShownPanel(Panels.Tasks);
                  }}
                  tooltip={Utils.getTextDef("Tasks tooltip")}
                />
            </div>

            <div className="top-right-corner-cont gui-zoomable">
                <PanelButton
                  icon={exitIcon}
                  onClick={() => {
                      if (loggedIn) {
                          setShownPanel(Panels.Account);
                      }
                      else {
                          setShownPanel(Panels.CreateAccount);
                      }
                  }}
                  tooltip={Utils.getTextDef("Exit tooltip")}
                />

                <PanelButton
                  icon={discordIcon}
                  onClick={() => window.open(discordInviteLink, "_blank")}
                  tooltip={Utils.getTextDef("Discord tooltip")}
                />

                <PanelButton
                  icon={wikiIcon}
                  onClick={() => window.open(wikiLink, "_blank")}
                  tooltip={Utils.getTextDef("Wikia tooltip")}
                />
            </div>

            <div className="bottom-right-corner-cont gui-zoomable">
                <PanelButton
                  icon={inventoryIcon}
                  onClick={() => null} // @TODO implement this later
                  tooltip={Utils.getTextDef("Inventory tooltip")}
                />

                <PanelButton
                  icon={settingsIcon}
                  onClick={() => null} // @TODO implement this later
                  tooltip={Utils.getTextDef("Settings tooltip")}
                />
            </div>

            <div className="panel-cont">
                {shownPanel === Panels.CreateAccount && (
                <CreateAccountPanel
                  onCloseCallback={() => {
                      setShownPanel(Panels.NONE);
                  }}
                />
                )}
                {shownPanel === Panels.Account && (
                <AccountPanel
                  onCloseCallback={() => {
                      setShownPanel(Panels.NONE);
                  }}
                />
                )}
                {shownPanel === Panels.Dungeon && (
                <DungeonPanel
                  onCloseCallback={() => {
                      setShownPanel(Panels.NONE);
                  }}
                  dungeonPortal={targetDungeonPortal}
                />
                )}
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

            <ChatInput />
        </div>
    );
}

export default GUI;
