import React, { useEffect, useState } from "react";
import { autorun } from "mobx";
import Utils from "../../shared/Utils";
import News from "./news/News";
import Partners from "./partners/Partners";
import dungeonzLogo from "./assets/dungeonz-title.png";
import background from "./assets/home-background.gif";
import notDiscordLogo from "./assets/notdiscord-logo.png";
import notFacebookLogo from "./assets/notfacebook-logo.png";
import notFandomLogo from "./assets/notfandom-logo.png";
import notRedditLogo from "./assets/notreddit-logo.png";
import "./LoginPage.scss";
import States from "../../shared/States";

function LoginPage() {
    const [showPartners, setShowPartners] = useState(false);
    const [loginExistingUser, setLoginExistingUser] = useState(false);
    const [newCharacterName, setNewCharacterName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const playPressed = async () => {
        // Show connecting message.

        console.log("* Play pressed");
        if (!loginExistingUser) {
            // New character option selected. Start as a new character with the given display name.
            window.connectToGameServer();
            // Only attempt to connect if the connection is ready to communicate.
            if (window.ws.readyState === 1) {
                window.ws.sendEvent("new_char", { displayName: newCharacterName });
            }
        } else {
            console.log("u:", username, "p:", password);
            // Continue as an existing character with the given credentials.
            window.connectToGameServer();

            console.log("ws?", window.ws);
            // Only attempt to connect if the connection is ready to communicate.
            if (window.ws.readyState === 1) {
                // Check username and password are valid.
                if (username === "") return;
                if (password === "") return;

                // Encrypt the password before sending.
                const hash = await Utils.digestMessage(password);

                console.log("before sending event");

                window.ws.sendEvent("log_in", {
                    username,
                    password: hash,
                });
            }
        }
    };

    useEffect(() => {
        autorun(() => {
            console.log("in loginpage, states changed:", States.playing);

            playPressed();
        });
    }, []);

    const inputEnterPressed = (event) => {
        console.log("inputEnterPressed");
        // If the Enter key is pressed, attempt to connect.
        if (event.keyCode === 13) {
            playPressed();
        }
    };

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

            <div id="center-text-cont">
                <div id="center-text" className="scale-up-center">Play</div>
            </div>

            <div id="main-columns">
                <div id="left-bar">
                    <div id="partners-credits-cont" className="bottom-texts">
                        <span id="partners-text" onClick={() => { toggleShowPartners(); }}>Partners</span>
                        |
                        <span id="credits-text" onClick={() => { window.open("/credits", "_blank"); }}>Credits</span>
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
                            />
                            <div
                              id="continue"
                              className={loginExistingUser ? "title-button-selected" : "title-button-unselected"}
                              onClick={continuePressed}
                            />
                        </div>
                        <div id="play-inputs-cont">
                            {!loginExistingUser && (
                                <>
                                    <input
                                      id="name-input"
                                      className="home-input"
                                      type="text"
                                      maxLength="20"
                                      value={newCharacterName}
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
                                      maxLength="50"
                                      value={username}
                                      onKeyDown={inputEnterPressed}
                                      onChange={(event) => { setUsername(event.target.value); }}
                                    />
                                    <input
                                      id="password-input"
                                      className="home-input"
                                      type="password"
                                      maxLength="50"
                                      value={password}
                                      onKeyDown={inputEnterPressed}
                                      onChange={(event) => { setPassword(event.target.value); }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div id="center-button" onClick={playPressed} />
                </div>

                <div id="right-bar">
                    <div id="antisocial-bar">
                        <div id="notdiscord-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notDiscordLogo}
                              onClick={() => { window.open("https://discord.gg/7wjyU7B", "_blank"); }}
                            />
                        </div>
                        <div id="notreddit-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notRedditLogo}
                              onClick={() => { window.open("https://www.reddit.com/r/dungeonz/", "_blank"); }}
                            />
                        </div>
                        <div id="notfacebook-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notFacebookLogo}
                              onClick={() => { window.open("https://www.facebook.com/sharer/sharer.php?u=dungeonz.io", "_blank"); }}
                            />
                        </div>
                        <div id="notwiki-button" className="antisocial-button">
                            <img
                              className="antisocial-icon"
                              src={notFandomLogo}
                              onClick={() => { window.open("https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki", "_blank"); }}
                            />
                        </div>
                    </div>
                    <News />
                    <div />
                    <div id="language-cont" className="bottom-texts">
                        <span id="language-text">Language</span>
                    </div>
                    <ul id="language-list">
                        <li id="language-english" className="language-option">English</li>
                        <li id="language-french" className="language-option">Français</li>
                        <li id="language-spanish" className="language-option">Español</li>
                        <li id="language-portuguese" className="language-option">Português do Brasil</li>
                        <li id="language-turkish" className="language-option">Türkçe</li>
                        <li id="language-german" className="language-option">Deutsch</li>
                        <li id="language-russian" className="language-option">русский язык</li>
                        <li id="language-polish" className="language-option">Polski</li>
                        <li id="language-chinese" className="language-option">中文</li>
                        <li
                          id="add-translation"
                          className="language-option"
                          onClick={() => { window.open("https://docs.google.com/spreadsheets/d/1n6jSigPBWrubNQMTz00GsLIh3U8CMtfZH8wMFYmfHaA/edit#gid=0", "_blank"); }}
                        />
                    </ul>
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
