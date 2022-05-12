import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import Meters from './meters/Meters';
import styles from './GUI.module.scss';
import GloryCounter from './glory_counter/GloryCounter';
import DefenceCounter from './defence_counter/DefenceCounter';
import PanelButton from './panel_button/PanelButton';
import {
    ApplicationState, GUIState, ChatState, PlayerState,
} from '../../../shared/state';
import mapIcon from '../../../assets/images/gui/hud/map-icon.png';
import chatIcon from '../../../assets/images/gui/hud/chat-icon.png';
import chatUnreadedMessageIcon from '../../../assets/images/gui/hud/chat-unreaded-msg-icon.png';
import exitIcon from '../../../assets/images/gui/hud/exit-icon.png';
import discordIcon from '../../../assets/images/gui/hud/notdiscord-icon.png';
import wikiIcon from '../../../assets/images/gui/hud/notwiki-icon.png';
import settingsIcon from '../../../assets/images/gui/panels/settings/settings-icon.png';
import {
    HITPOINTS_VALUE,
    LOGGED_IN,
    PANEL_CHANGE,
    POSITION_VALUE,
    BEFORE_PAGE_UNLOAD,
    SHOW_CHAT_BOX,
    QUICK_CHAT_ENABLED,
    NEW_CHAT,
} from '../../../shared/EventTypes';
import Tooltip from './tooltip/Tooltip';
import Panels from './panels/Panels';
import Hotbar from './hotbar/Hotbar';
import GUIPanelWindows from './GUIPanelWindows';
import ChatPanel from './panels/chat/ChatPanel';
import getTextDef from '../../../shared/GetTextDef';
import SelectedEntity from './selected_entity/SelectedEntity';

const discordInviteLink = 'https://discord.com/invite/7wjyU7B';
const wikiLink = 'https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki';

function GUI() {
    const [shownPanel, setShownPanel] = useState<Panels>(Panels.NONE);
    const [showChatBox, setShowChatBox] = useState(GUIState.showChatBox);
    const [quickChatEnabled, setQuickChatEnabled] = useState(GUIState.quickChatEnabled);
    const [showNewNotification, setShowNewNotification] = useState(ChatState.newChatNotification);
    // const [ trackedTask, setTrackedTask ] = useState(null);
    const [loggedIn, setLoggedIn] = useState(ApplicationState.loggedIn);

    const closePanelCallback = () => {
        setShownPanel(Panels.NONE);
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOGGED_IN, (msg, data) => {
                setLoggedIn(data.new);
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

    const togglePanel = (panel: Panels) => {
        if (PlayerState.hitPoints <= 0) return; // prevent toggling the panels if player is dead
        if (shownPanel === Panels.NONE) setShownPanel(panel);
        else closePanelCallback();
    };

    return (
        <div className={`${styles['gui']}`}>
            {shownPanel !== Panels.NONE && <div
                className={styles['backdrop']}
                onClick={closePanelCallback}
            />}

            <Meters />

            <SelectedEntity />

            {/* {trackedTask && <TaskTracker />} */}

            <div className={`${styles['top-left-corner-cont']} gui-scalable`}>
                <GloryCounter />
                <DefenceCounter />

                <PanelButton
                    icon={mapIcon.src}
                    onClick={() => togglePanel(Panels.Map)}
                    tooltipText={`${getTextDef('Map tooltip')} ( M )`}
                />

                <PanelButton
                    icon={showNewNotification && !showChatBox && quickChatEnabled
                        ? chatUnreadedMessageIcon.src : chatIcon.src}
                    onClick={() => {
                        setShowNewNotification(false);
                        GUIState.setQuickChatEnabled(!GUIState.quickChatEnabled);
                    }}
                    tooltipText={`${getTextDef('Chat tooltip')} ( ENTER )`}
                    className={quickChatEnabled ? 'inactive' : ''}
                />
            </div>

            <div className={`${styles['top-right-corner-cont']} gui-scalable`}>
                <PanelButton
                    icon={exitIcon.src}
                    onClick={() => {
                        if (loggedIn) togglePanel(Panels.Account);
                        else togglePanel(Panels.CreateAccount);
                    }}
                    tooltipText={getTextDef('Account tooltip')}
                />

                <PanelButton
                    icon={settingsIcon.src}
                    onClick={() => togglePanel(Panels.Settings)}
                    tooltipText={getTextDef('Settings tooltip')}
                />

                <PanelButton
                    icon={discordIcon.src}
                    onClick={() => window.open(discordInviteLink, '_blank')}
                    tooltipText={getTextDef('Discord tooltip')}
                />

                <PanelButton
                    icon={wikiIcon.src}
                    onClick={() => window.open(wikiLink, '_blank')}
                    tooltipText={getTextDef('Wikia tooltip')}
                />
            </div>

            <div className={`${styles['bottom-right-corner-cont']} gui-scalable`} />

            <div id='fps-counter' className={`${styles['fps-counter']}`}>FPS: </div>

            <div>
                <GUIPanelWindows
                    shownPanel={shownPanel}
                    closePanelCallback={closePanelCallback}
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
