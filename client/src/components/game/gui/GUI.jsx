import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import Meters from "./meters/Meters";
import "./GUI.scss";
import GloryCounter from "./glory_counter/GloryCounter";
import DefenceCounter from "./defence_counter/DefenceCounter";
import PanelButton from "./panel_button/PanelButton";
import TaskTracker from "./task_tracker/TaskTracker";
import Utils from "../../../shared/Utils";
import {
    ApplicationState, GUIState, ChatState, PlayerState,
} from "../../../shared/state/States";
import statsIcon from "../../../assets/images/gui/hud/stats-icon.png";
import tasksIcon from "../../../assets/images/gui/hud/tasks-icon.png";
import mapIcon from "../../../assets/images/gui/hud/map-icon.png";
import chatIcon from "../../../assets/images/gui/hud/chat-icon.png";
import chatUnreadedMessageIcon from "../../../assets/images/gui/hud/chat-unreaded-msg-icon.png";
import exitIcon from "../../../assets/images/gui/hud/exit-icon.png";
import discordIcon from "../../../assets/images/gui/hud/notdiscord-icon.png";
import wikiIcon from "../../../assets/images/gui/hud/notwiki-icon.png";
import settingsIcon from "../../../assets/images/gui/panels/settings/settings-icon.png";
import {
    DUNGEON_PORTAL_PRESSED,
    HITPOINTS_VALUE,
    LOGGED_IN,
    PANEL_CHANGE,
    POSITION_VALUE,
    BEFORE_PAGE_UNLOAD,
    SHOW_CHAT_BOX,
    QUICK_CHAT_ENABLED,
    NEW_CHAT,
} from "../../../shared/EventTypes";
import DungeonTimer from "./dungeon_timer/DungeonTimer";
import DungeonKeys from "./dungeon_keys/DungeonKeys";
import Tooltip from "./tooltip/Tooltip";
import Panels from "./panels/PanelsEnum";
import Hotbar from "./hotbar/Hotbar";
import GUIPanelWindows from "./GUIPanelWindows";
import ChatPanel from "./panels/chat/ChatPanel";

const discordInviteLink = "https://discord.com/invite/7wjyU7B";
const wikiLink = "https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki";

function GUI() {
    const [shownPanel, setShownPanel] = useState(null);
    const [showChatBox, setShowChatBox] = useState(GUIState.showChatBox);
    const [quickChatEnabled, setQuickChatEnabled] = useState(GUIState.quickChatEnabled);
    const [showNewNotification, setShowNewNotification] = useState(ChatState.newChatNotification);
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
                if (GUIState.activePanel !== Panels.Chat) {
                    setShownPanel(Panels.NONE);
                }
            }),
            PubSub.subscribe(HITPOINTS_VALUE, (msg, data) => {
                // If the player died, show the respawn panel.
                if (data.new <= 0) {
                    setShownPanel(Panels.Respawn);
                }
            }),
            PubSub.subscribe(PANEL_CHANGE, () => {
                setShownPanel(GUIState.activePanel);
            }),
            PubSub.subscribe(SHOW_CHAT_BOX, () => {
                setShowChatBox(GUIState.showChatBox);
            }),
            PubSub.subscribe(QUICK_CHAT_ENABLED, () => {
                setQuickChatEnabled(GUIState.quickChatEnabled);
            }),
            PubSub.subscribe(BEFORE_PAGE_UNLOAD, () => {
                if (ApplicationState.loggedIn !== true) {
                    setShownPanel(Panels.CreateAccount);
                }
            }),
            PubSub.subscribe(NEW_CHAT, () => {
                if (showChatBox === false) {
                    setShowNewNotification(ChatState.newChatNotification);
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

    const togglePanel = (panel) => {
        if (PlayerState.hitPoints <= 0) return; // prevent toggling the panels if player is dead
        if (shownPanel === Panels.NONE) setShownPanel(panel);
        else closePanelCallback();
    };

    return (
        <div className="gui">
            <Meters />

            {trackedTask && <TaskTracker />}

            <div className="top-left-corner-cont gui-scalable">
                <GloryCounter />
                <DefenceCounter />
                <PanelButton
                  icon={statsIcon}
                  onClick={() => togglePanel(Panels.Stats)}
                  tooltipText={`${Utils.getTextDef("Stats tooltip")} ( V )`}
                />
                <PanelButton
                  icon={tasksIcon}
                  onClick={() => togglePanel(Panels.Tasks)}
                  tooltipText={`${Utils.getTextDef("Tasks tooltip")} ( B )`}
                />
                <PanelButton
                  icon={mapIcon}
                  onClick={() => togglePanel(Panels.Map)}
                  tooltipText={`${Utils.getTextDef("Map tooltip")} ( M )`}
                />
                <PanelButton
                  icon={showNewNotification && !showChatBox && quickChatEnabled
                      ? chatUnreadedMessageIcon : chatIcon}
                  onClick={() => {
                      setShowNewNotification(false);
                      GUIState.setQuickChatEnabled(!GUIState.quickChatEnabled);
                  }}
                  tooltipText={`${Utils.getTextDef("Chat tooltip")} ( ENTER )`}
                  className={quickChatEnabled ? "inactive" : ""}
                />
            </div>

            <div className="top-right-corner-cont gui-scalable">
                <PanelButton
                  icon={exitIcon}
                  onClick={() => {
                      if (loggedIn) togglePanel(Panels.Account);
                      else togglePanel(Panels.CreateAccount);
                  }}
                  tooltipText={Utils.getTextDef("Account tooltip")}
                />

                <PanelButton
                  icon={settingsIcon}
                  onClick={() => togglePanel(Panels.Settings)}
                  tooltipText={Utils.getTextDef("Settings tooltip")}
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

            <div className="bottom-right-corner-cont gui-scalable" />

            <DungeonTimer />
            <DungeonKeys />

            <div className="panel-cont">
                <GUIPanelWindows
                  shownPanel={shownPanel}
                  closePanelCallback={closePanelCallback}
                  targetDungeonPortal={targetDungeonPortal}
                />
            </div>

            {(showChatBox || !quickChatEnabled) && (
                <ChatPanel />
            )}

            <Hotbar />

            <Tooltip />
        </div>
    );
}

export default GUI;
