import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";
import PanelButton from "./panel_button/PanelButton";
import StatsPanel from "./panels/stats/StatsPanel";
import TasksPanel from "./panels/tasks/TasksPanel";
import CreateAccountPanel from "./panels/create_account/CreateAccountPanel";
import TaskTracker from "./task_tracker/TaskTracker";
import Utils from "../../../shared/Utils";
import AccountPanel from "./panels/account/AccountPanel";
import { ApplicationState, GUIState } from "../../../shared/state/States";
import statsIcon from "../../../assets/images/gui/hud/stats-icon.png";
import tasksIcon from "../../../assets/images/gui/hud/tasks-icon.png";
import mapIcon from "../../../assets/images/gui/hud/map-icon.png";
import exitIcon from "../../../assets/images/gui/hud/exit-icon.png";
import discordIcon from "../../../assets/images/gui/hud/notdiscord-icon.png";
import wikiIcon from "../../../assets/images/gui/hud/notwiki-icon.png";
import inventoryIcon from "../../../assets/images/gui/hud/inventory-icon.png";
import settingsIcon from "../../../assets/images/gui/hud/settings/settings-icon.png";
import {
    DUNGEON_PORTAL_PRESSED, HITPOINTS_VALUE, LOGGED_IN, POSITION_VALUE,
} from "../../../shared/EventTypes";
import ChatInput from "./chat_input/ChatInput";
import DungeonPanel from "./panels/dungeon/DungeonPanel";
import RespawnPanel from "./panels/respawn/RespawnPanel";
import DungeonTimer from "./dungeon_timer/DungeonTimer";
import DungeonKeys from "./dungeon_keys/DungeonKeys";
import MapPanel from "./panels/map/MapPanel";
import InventoryPanel from "./panels/inventory/InventoryPanel";
import Tooltip from "./tooltip/Tooltip";
import Panels from "./panels/PanelsEnum";

const discordInviteLink = "https://discord.com/invite/7wjyU7B";
const wikiLink = "https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki";

function GUI() {
    const [shownPanel, setShownPanel] = useState(null);
    const [trackedTask, setTrackedTask] = useState(null);
    const [loggedIn, setLoggedIn] = useState(ApplicationState.loggedIn);
    const [targetDungeonPortal, setTargetDungeonPortal] = useState(null);

    const closePanelCallback = () => {
        setShownPanel(Panels.NONE);
    };

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
            }),
            PubSub.subscribe(HITPOINTS_VALUE, (msg, data) => {
                // If the player died, show the respawn panel.
                if (data.new <= 0) {
                    setShownPanel(Panels.Respawn);
                }
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

    useEffect(() => {
        GUIState.setActivePanel(shownPanel);
    }, [shownPanel]);

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
                  tooltipText={Utils.getTextDef("Avatar tooltip")}
                />
                <PanelButton
                  icon={tasksIcon}
                  onClick={() => {
                      setShownPanel(Panels.Tasks);
                  }}
                  tooltipText={Utils.getTextDef("Tasks tooltip")}
                />
                <PanelButton
                  icon={mapIcon}
                  onClick={() => {
                      setShownPanel(Panels.Map);
                  }}
                  tooltipText={Utils.getTextDef("Map tooltip")}
                />
                <PanelButton
                  icon={inventoryIcon}
                  onClick={() => {
                      setShownPanel(Panels.Inventory);
                  }}
                  tooltipText={Utils.getTextDef("Inventory tooltip")}
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
                  tooltipText={Utils.getTextDef("Exit tooltip")}
                />

                <PanelButton
                  icon={discordIcon}
                  onClick={() => window.open(discordInviteLink, "_blank")}
                  tooltipText={Utils.getTextDef("Discord tooltip")}
                />

                <PanelButton
                  icon={wikiIcon}
                  onClick={() => window.open(wikiLink, "_blank")}
                  tooltipText={Utils.getTextDef("Wikia tooltip")}
                />
            </div>

            <div className="bottom-right-corner-cont gui-zoomable">
                <PanelButton
                  icon={inventoryIcon}
                  onClick={() => null} // @TODO implement this later
                  tooltipText={Utils.getTextDef("Inventory tooltip")}
                />

                <PanelButton
                  icon={settingsIcon}
                  onClick={() => null} // @TODO implement this later
                  tooltipText={Utils.getTextDef("Settings tooltip")}
                />
            </div>

            <DungeonTimer />
            <DungeonKeys />

            <div className="panel-cont">
                {shownPanel === Panels.CreateAccount && (
                <CreateAccountPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Account && (
                <AccountPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Respawn && (
                <RespawnPanel />
                )}
                {shownPanel === Panels.Dungeon && (
                <DungeonPanel
                  onCloseCallback={closePanelCallback}
                  dungeonPortal={targetDungeonPortal}
                />
                )}
                {shownPanel === Panels.Stats && (
                <StatsPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Tasks && (
                <TasksPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Map && (
                <MapPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
                {shownPanel === Panels.Inventory && (
                <InventoryPanel
                  onCloseCallback={closePanelCallback}
                />
                )}
            </div>

            <ChatInput />

            <Tooltip />
        </div>
    );
}

export default GUI;
