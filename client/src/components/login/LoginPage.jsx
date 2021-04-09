import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import Utils from "../../shared/Utils";
import News from "./news/News";
import Partners from "./partners/Partners";
import dungeonzLogo from "../../assets/images/misc/branding/dungeonz-title.png";
import background from "../../assets/images/misc/home-background.gif";
import notDiscordLogo from "../../assets/images/misc/branding/notdiscord-logo.png";
import notGithubLogo from "../../assets/images/misc/branding/notgithub-logo.png";
import notFandomLogo from "../../assets/images/misc/branding/notfandom-logo.png";
import notRedditLogo from "../../assets/images/misc/branding/notreddit-logo.png";
import "./LoginPage.scss";
import {
    CONNECTED,
    CONNECTING,
    INVALID_LOGIN_DETAILS,
    JOINED,
    JOINING,
    WORLD_FULL,
    WEBSOCKET_CLOSE,
    SOMETHING_WENT_WRONG,
    ALREADY_LOGGED_IN,
} from "../../shared/EventTypes";
import {
    connectToGameServer, joinGameContinue, joinGameNewCharacter, ConnectionCloseTypes,
} from "../../network/ConnectionManager";
import dungeonz from "../../shared/Global";
import { ApplicationState } from "../../shared/state/States";

const Languages = [
    { listName: "English", translationId: "English" },
    { listName: "Français", translationId: "French" },
    { listName: "Español", translationId: "Spanish" },
    { listName: "Português do Brasil", translationId: "Portuguese (Brazil)" },
    { listName: "Türkçe", translationId: "Turkish" },
    { listName: "Deutsch", translationId: "German" },
    { listName: "русский язык", translationId: "Russian" },
    { listName: "Polski", translationId: "Polish" },
    { listName: "中文", translationId: "Chinese" },
];

function LoginPage() {
    const [showPartners, setShowPartners] = useState(false);
    const [loginExistingUser, setLoginExistingUser] = useState(false);
    const [newCharacterName, setNewCharacterName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [joining, setJoining] = useState(false);

    const [connectionIssue, setConnectionIssue] = useState(null);
    const [joinIssue, setJoinIssue] = useState(null);

    const [showLanguageList, setShowLanguageList] = useState(false);

    const playPressed = () => {
        Utils.message("Play pressed");

        if (connected && !joining) {
            if (!loginExistingUser) {
                // New character option selected. Start as a new character with the given display name.
                joinGameNewCharacter(newCharacterName);
            }
            else if (!username) {
                setJoinIssue(Utils.getTextDef("Username required"));
            }
            else if (!password) {
                setJoinIssue(Utils.getTextDef("Password required"));
            }
            else {
                // Log in to an existing account.
                joinGameContinue(username, password);
            }
        }
    };

    const reconnectPressed = () => {
        Utils.message("Play pressed");
        if (connectionIssue) {
            connectToGameServer();

            setConnectionIssue(null);
        }
    };

    const changeLanguage = (language) => {
        dungeonz.gameConfig.language = language;

        setShowLanguageList(false);
    };

    useEffect(() => {
        // Load the default language.
        changeLanguage(dungeonz.gameConfig.language);

        const subs = [
            PubSub.subscribe(CONNECTING, (msg, data) => {
                setConnecting(data.new);
            }),
            PubSub.subscribe(CONNECTED, (msg, data) => {
                setConnected(data.new);
            }),
            PubSub.subscribe(JOINING, (msg, data) => {
                setJoining(data.new);
            }),
            PubSub.subscribe(JOINED, () => {
                // Start the game state.
            }),
            PubSub.subscribe(INVALID_LOGIN_DETAILS, () => {
                setJoinIssue(Utils.getTextDef("Invalid login details"));
            }),
            PubSub.subscribe(ALREADY_LOGGED_IN, () => {
                setJoinIssue(Utils.getTextDef("Already logged in"));
            }),
            PubSub.subscribe(WORLD_FULL, () => {
                setJoinIssue(Utils.getTextDef("Game full"));
            }),
            PubSub.subscribe(SOMETHING_WENT_WRONG, () => {
                setJoinIssue(Utils.getTextDef("Something went wrong"));
            }),
            PubSub.subscribe(WEBSOCKET_CLOSE, (msg, data) => {
                if (data === ConnectionCloseTypes.CANNOT_CONNECT_NO_INTERNET) {
                    setConnectionIssue(
                        `Could not connect to game server.

                        No internet connection detected.
                    
                        Check your internet connection.`,
                    );
                }
                else if (data === ConnectionCloseTypes.CANNOT_CONNECT_NO_SERVER) {
                    setConnectionIssue(
                        `Could not connect to game server.

                        The server may be down due to update, maintenance, or other problem.
                        
                        Try again in a few minutes.`,
                    );
                }
                else if (data === ConnectionCloseTypes.DISCONNECTED_NO_INTERNET) {
                    setConnectionIssue(
                        `Disconnected from game server.

                        Internet connection lost.
                        
                        Check your internet connection.`,
                    );
                }
                else if (data === ConnectionCloseTypes.DISCONNECTED_NO_SERVER) {
                    setConnectionIssue(
                        `Disconnected from game server.

                        The server may have closed due to update, maintenance, or other problem.
                        
                        Try again in a few minutes.`,
                    );
                }
                else {
                    setConnectionIssue("Unknown connection error. :/");
                }
            }),
        ];

        // Connect as soon as the login page loads.
        connectToGameServer();

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    const inputEnterPressed = (event) => {
        // If the Enter key is pressed, attempt to connect.
        if (event.keyCode === 13) {
            playPressed();
        }
    };

    useEffect(() => {
        setJoinIssue(null);
    }, [connectionIssue, loginExistingUser, username, password]);

    const newCharacterPressed = () => {
        setLoginExistingUser(false);
    };

    const continuePressed = () => {
        setLoginExistingUser(true);
    };

    const toggleShowPartners = () => {
        setShowPartners(!showPartners);
    };

    return (
        <div className="press-start-font">
            <img className="background-img" src={background} />
            <div className="background-shadow" />

            <div className="center-text-cont">
                {connectionIssue && <div className="connection-issue scale-up-center">{connectionIssue}</div>}
                {joinIssue && <div className="connection-issue scale-up-center">{joinIssue}</div>}
                {connectionIssue && <div className="scale-up-center">{Utils.getTextDef("Reconnect")}</div>}
                {connecting && <div className="scale-up-center">{Utils.getTextDef("Connecting to game server")}</div>}
                {connected && !joining && <div className="scale-up-center">{Utils.getTextDef("Play")}</div>}
                {joining && <div className="scale-up-center">{Utils.getTextDef("Joining game world")}</div>}
            </div>

            <div id="main-columns">
                <div id="left-bar">
                    <div id="partners-credits-cont" className="bottom-texts">
                        <span
                          id="partners-text"
                          onClick={() => {
                              toggleShowPartners();
                          }}
                        >
                            {Utils.getTextDef("Partners")}
                        </span>
                        |
                        <span
                          id="credits-text"
                          onClick={() => {
                              window.open("/credits", "_blank");
                          }}
                        >
                            {Utils.getTextDef("Credits")}
                        </span>
                    </div>
                </div>

                <div id="center-bar">
                    <div id="title-cont">
                        <img id="title-img" src={dungeonzLogo} />
                        <div id="new-character-continue-cont">
                            <div
                              id="new-character"
                              className={!loginExistingUser ? "title-button-selected" : "title-button-unselected"}
                              onClick={newCharacterPressed}
                            >
                                {Utils.getTextDef("New character")}
                            </div>
                            <div
                              id="continue"
                              className={loginExistingUser ? "title-button-selected" : "title-button-unselected"}
                              onClick={continuePressed}
                            >
                                {Utils.getTextDef("Continue")}
                            </div>
                        </div>
                        <div id="play-inputs-cont">
                            {!loginExistingUser && (
                                <>
                                    <input
                                      id="name-input"
                                      className="home-input"
                                      type="text"
                                      maxLength={ApplicationState.maxDisplayNameLength}
                                      value={newCharacterName}
                                      placeholder={Utils.getTextDef("Name input")}
                                      onKeyDown={inputEnterPressed}
                                      onChange={(event) => {
                                          setNewCharacterName(event.target.value);
                                      }}
                                      autoFocus
                                    />
                                </>
                            )}
                            {loginExistingUser && (
                                <>
                                    <input
                                      id="username-input"
                                      className="home-input"
                                      type="text"
                                      // Max username length might have been lowered since they
                                      // made the account, so don't be strict about length here,
                                      // but add some kind of limit so they can't send the entire
                                      // works of Shakespeare...
                                      maxLength="100"
                                      value={username}
                                      placeholder={Utils.getTextDef("Username input")}
                                      onKeyDown={inputEnterPressed}
                                      onChange={(event) => {
                                          setUsername(event.target.value);
                                      }}
                                    />
                                    <input
                                      id="password-input"
                                      className="home-input"
                                      type="password"
                                      maxLength="50"
                                      value={password}
                                      placeholder={Utils.getTextDef("Password input")}
                                      onKeyDown={inputEnterPressed}
                                      onChange={(event) => {
                                          setPassword(event.target.value);
                                      }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    {connected && <div id="center-button" onClick={playPressed} />}
                    {connectionIssue && <div id="center-button" onClick={reconnectPressed} />}
                </div>

                <div id="right-bar">
                    <div id="antisocial-bar">
                        <div id="notdiscord-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notDiscordLogo}
                              onClick={() => {
                                  window.open("https://discord.gg/7wjyU7B", "_blank");
                              }}
                            />
                        </div>
                        <div id="notreddit-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notRedditLogo}
                              onClick={() => {
                                  window.open("https://www.reddit.com/r/dungeonz/", "_blank");
                              }}
                            />
                        </div>
                        <div id="notwiki-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notFandomLogo}
                              onClick={() => {
                                  window.open("https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki", "_blank");
                              }}
                            />
                        </div>
                        <div id="notgithub-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notGithubLogo}
                              onClick={() => {
                                  window.open("https://github.com/Arcanorum/dungeonz", "_blank");
                              }}
                            />
                        </div>
                    </div>
                    <News />
                    <div />
                    <div id="language-cont" className="bottom-texts">
                        <span
                          id="language-text"
                          onClick={() => { setShowLanguageList(!showLanguageList); }}
                        >
                            {Utils.getTextDef("Language")}
                        </span>
                    </div>
                    {showLanguageList && (
                    <ul id="language-list">
                        {Languages.map((language) => (
                            <li
                              key={language.listName}
                              className="language-option"
                              onClick={() => { changeLanguage(language.translationId); }}
                            >
                                {language.listName}
                            </li>
                        ))}
                        <li id="language-french" className="language-option" />
                        <li id="language-spanish" className="language-option" />
                        <li id="language-portuguese" className="language-option" />
                        <li id="language-turkish" className="language-option" />
                        <li id="language-german" className="language-option" />
                        <li id="language-russian" className="language-option" />
                        <li id="language-polish" className="language-option" />
                        <li id="language-chinese" className="language-option" />
                        <li
                          id="add-translation"
                          className="language-option"
                          onClick={() => {
                              window.open("https://docs.google.com/spreadsheets/d/1n6jSigPBWrubNQMTz00GsLIh3U8CMtfZH8wMFYmfHaA/edit#gid=0", "_blank");
                          }}
                        />
                    </ul>
                    )}
                </div>
            </div>

            {showPartners && (
                <Partners
                  toggleShowPartners={toggleShowPartners}
                />
            )}
        </div>
    );
}

export default LoginPage;
