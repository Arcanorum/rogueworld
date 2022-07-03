import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { message, warning } from '@rogueworld/utils';
import News from './news/News';
// import Partners from './partners/Partners';
import notDiscordLogo from '../../assets/images/misc/branding/notdiscord-logo.png';
import notFandomLogo from '../../assets/images/misc/branding/notfandom-logo.png';
import notGithubLogo from '../../assets/images/misc/branding/notgithub-logo.png';
import notRedditLogo from '../../assets/images/misc/branding/notreddit-logo.png';
import rogueworldLogo from '../../assets/images/misc/branding/rogueworld-title.png';
import background from '../../assets/images/misc/home-background.gif';
import {
    ConnectionCloseTypes, connectToGameServer, joinGameContinue, joinGameNewCharacter,
} from '../../network/ConnectionManager';
import Config from '../../shared/Config';
import {
    ALREADY_LOGGED_IN, CONNECTED,
    CONNECTING,
    INVALID_LOGIN_DETAILS,
    JOINED,
    JOINING,
    SOMETHING_WENT_WRONG,
    WEBSOCKET_CLOSE,
    WORLD_FULL,
} from '../../shared/EventTypes';
import getTextDef from '../../shared/GetTextDef';
import styles from './LoginPage.module.scss';
import { ApplicationState } from '../../shared/state';

const Languages = [
    { listName: 'English', translationId: 'English' },
    { listName: 'Français', translationId: 'French' },
    { listName: 'Español', translationId: 'Spanish' },
    { listName: 'Português do Brasil', translationId: 'Portuguese' },
    { listName: 'Türkçe', translationId: 'Turkish' },
    { listName: 'Deutsch', translationId: 'German' },
    { listName: 'русский язык', translationId: 'Russian' },
    { listName: 'Polski', translationId: 'Polish' },
    { listName: '中文', translationId: 'Chinese' },
    { listName: 'Tiếng Việt', translationId: 'Vietnamese' },
    { listName: 'Hrvatski', translationId: 'Croatian' },
    { listName: '한국어', translationId: 'Korean' },
];

function LoginPage() {
    // const [showPartners, setShowPartners] = useState(false);
    const [loginExistingUser, setLoginExistingUser] = useState(false);
    const [newCharacterName, setNewCharacterName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [joining, setJoining] = useState(false);

    const [connectionIssue, setConnectionIssue] = useState<string | null>(null);
    const [joinIssue, setJoinIssue] = useState<string | null>(null);

    const [showLanguageList, setShowLanguageList] = useState(false);

    if (Config.Settings.USE_SECURE_PROTOCOLS) {
        // Live or test. Connect to server, which should be using SSL.
        ApplicationState.languageServiceHTTPServerURL = `https://${Config.Settings.LANGUAGE_SERVICE_URL}`;
    }
    else {
        // Connect without SSL for environments (localhost) that don't need it.
        ApplicationState.languageServiceHTTPServerURL = `http://${Config.Settings.LANGUAGE_SERVICE_URL}`;
    }

    const changeLanguage = async (languageName: string) => {
        try {
            const url = `${ApplicationState.languageServiceHTTPServerURL}/language/${languageName}`;

            const res = await fetch(url);

            const json = await res.json();

            Config.language = languageName;

            Config.TextDefs = json;
        }
        catch (err) {
            warning('Error changing language:', err);
        }

        setShowLanguageList(false);
    };

    const playPressed = () => {
        message('Play pressed');

        if (connected && !joining) {
            if (!loginExistingUser) {
                // New character option selected. Start as a new character with the given display
                // name.
                joinGameNewCharacter(newCharacterName);
            }
            else if (!username) {
                setJoinIssue(getTextDef('Username required'));
            }
            else if (!password) {
                setJoinIssue(getTextDef('Password required'));
            }
            else {
                // Log in to an existing account.
                joinGameContinue(username, password);
            }
        }
    };

    const reconnectPressed = () => {
        message('Play pressed');
        if (connectionIssue) {
            connectToGameServer();

            setConnectionIssue(null);
        }
    };

    useEffect(() => {
        // Load the default language.
        changeLanguage(Config.language);

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
                setJoinIssue(getTextDef('Invalid login details'));
            }),
            PubSub.subscribe(ALREADY_LOGGED_IN, () => {
                setJoinIssue(getTextDef('Already logged in'));
            }),
            PubSub.subscribe(WORLD_FULL, () => {
                setJoinIssue(getTextDef('Game full'));
            }),
            PubSub.subscribe(SOMETHING_WENT_WRONG, () => {
                setJoinIssue(getTextDef('Something went wrong'));
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
                    setConnectionIssue('Unknown connection error. :/');
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

    const inputEnterPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
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

    // const toggleShowPartners = () => {
    //     setShowPartners(!showPartners);
    // };

    return (
        <div className="press-start-font">
            <img className={`${styles['background-img']}`} src={background.src} />
            <div className={`${styles['background-shadow']}`} />

            <div className={styles['center-text-cont']}>
                {connectionIssue && <div className={`${styles['connection-issue']} ${styles['scale-up-center']}`}>{connectionIssue}</div>}
                {joinIssue && <div className={`${styles['connection-issue']} ${styles['scale-up-center']}`}>{joinIssue}</div>}
                {connectionIssue && <div className={styles['scale-up-center']}>{getTextDef('Reconnect')}</div>}
                {connecting && <div className={styles['scale-up-center']}>{getTextDef('Connecting to game server')}</div>}
                {connected && !joining && <div className={styles['scale-up-center']}>{getTextDef('Play')}</div>}
                {joining && <div className={styles['scale-up-center']}>{getTextDef('Joining game world')}</div>}
            </div>

            <div id={styles['main-columns']}>
                <div id={styles['left-bar']}>
                    <div id={styles['partners-credits-cont']} className={styles['bottom-texts']}>
                        {/* <span
                            id={styles['partners-text']}
                            onClick={() => {
                                toggleShowPartners();
                            }}
                        >
                            {getTextDef('Partners')}
                        </span>
                        | */}
                        <span
                            id={styles['credits-text']}
                            onClick={() => {
                                window.open('/credits', '_blank');
                            }}
                        >
                            {getTextDef('Credits')}
                        </span>
                        |
                        <span
                            id={styles['test-server-text']}
                            onClick={() => {
                                window.open('https://test.rogueworld.io/', '_blank');
                            }}
                        >
                            {getTextDef('PTS')}
                        </span>
                    </div>
                </div>

                <div id={styles['center-bar']}>
                    <div id={styles['title-cont']}>
                        <img id={styles['title-img']} src={rogueworldLogo.src} />
                        <div id={styles['new-character-continue-cont']}>
                            <div
                                id={styles['new-character']}
                                className={!loginExistingUser ? styles['title-button-selected'] : styles['title-button-unselected']}
                                onClick={newCharacterPressed}
                            >
                                {getTextDef('New character')}
                            </div>
                            <div
                                id={styles.continue}
                                className={loginExistingUser ? styles['title-button-selected'] : styles['title-button-unselected']}
                                onClick={continuePressed}
                            >
                                {getTextDef('Continue')}
                            </div>
                        </div>
                        <div id={styles['play-inputs-cont']}>
                            {!loginExistingUser && (
                                <>
                                    <input
                                        id={styles['name-input']}
                                        className={styles['home-input']}
                                        type="text"
                                        maxLength={
                                            Config.Settings.MAX_CHARACTER_DISPLAY_NAME_LENGTH
                                        }
                                        value={newCharacterName}
                                        placeholder={getTextDef('Name input')}
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
                                        id={styles['username-input']}
                                        className={styles['home-input']}
                                        type="text"
                                        // Max username length might have been lowered since they
                                        // made the account, so don't be strict about length here,
                                        // but add some kind of limit so they can't send the entire
                                        // works of Shakespeare...
                                        maxLength={100}
                                        value={username}
                                        placeholder={getTextDef('Username input')}
                                        onKeyDown={inputEnterPressed}
                                        onChange={(event) => {
                                            setUsername(event.target.value);
                                        }}
                                    />
                                    <input
                                        id={styles['password-input']}
                                        className={styles['home-input']}
                                        type="password"
                                        maxLength={50}
                                        value={password}
                                        placeholder={getTextDef('Password input')}
                                        onKeyDown={inputEnterPressed}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    {connected && <div id={styles['center-button']} className={styles['hand-cursor']} onClick={playPressed} />}
                    {connectionIssue && <div id={styles['center-button']} className={styles['hand-cursor']} onClick={reconnectPressed} />}
                </div>

                <div id={styles['right-bar']}>
                    <div id={styles['antisocial-bar']}>
                        <div id={styles['notdiscord-button']} className={styles['antisocial-button']}>
                            <img
                                className={styles['antisocial-icon']}
                                src={notDiscordLogo.src}
                                onClick={() => {
                                    window.open('https://discord.gg/7wjyU7B', '_blank');
                                }}
                            />
                        </div>
                        <div id={styles['notreddit-button']} className={styles['antisocial-button']}>
                            <img
                                className={styles['antisocial-icon']}
                                src={notRedditLogo.src}
                                onClick={() => {
                                    window.open('https://www.reddit.com/r/rogueworld/', '_blank');
                                }}
                            />
                        </div>
                        <div id={styles['notwiki-button']} className={styles['antisocial-button']}>
                            <img
                                className={styles['antisocial-icon']}
                                src={notFandomLogo.src}
                                onClick={() => {
                                    window.open('https://dungeonz.fandom.com/wiki/Dungeonz.io_Wiki', '_blank');
                                }}
                            />
                        </div>
                        <div id={styles['notgithub-button']} className={styles['antisocial-button']}>
                            <img
                                className={styles['antisocial-icon']}
                                src={notGithubLogo.src}
                                onClick={() => {
                                    window.open('https://github.com/Arcanorum/rogueworld', '_blank');
                                }}
                            />
                        </div>
                    </div>
                    <News />
                    <div />
                    <div id={styles['language-cont']} className={styles['bottom-texts']}>
                        <span
                            id={styles['language-text']}
                            onClick={() => { setShowLanguageList(!showLanguageList); }}
                        >
                            {getTextDef('Language')}
                        </span>
                    </div>
                    {showLanguageList && (
                        <ul id={styles['language-list']}>
                            {Languages.map((language) => (
                                <li
                                    key={language.listName}
                                    className={styles['language-option']}
                                    onClick={() => { changeLanguage(language.translationId); }}
                                >
                                    {language.listName}
                                </li>
                            ))}
                            <li
                                key="add-translation"
                                className={styles['language-option']}
                                onClick={() => {
                                    window.open('https://docs.google.com/spreadsheets/d/1n6jSigPBWrubNQMTz00GsLIh3U8CMtfZH8wMFYmfHaA/edit#gid=0', '_blank');
                                }}
                            >
                                {getTextDef('Add translation')}
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            {/* {showPartners && (
                <Partners
                    toggleShowPartners={toggleShowPartners}
                />
            )} */}
        </div>
    );
}

export default LoginPage;
