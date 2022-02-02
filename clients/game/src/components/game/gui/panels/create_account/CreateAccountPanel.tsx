import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import PanelTemplate from '../panel_template/PanelTemplate';
import exitIcon from '../../../../../assets/images/gui/hud/exit-icon.png';
import borderImage from '../../../../../assets/images/gui/panels/account/create-account-button-border.png';
import './CreateAccountPanel.scss';
import { CREATE_ACCOUNT_FAILURE } from '../../../../../shared/EventTypes';
import { ApplicationState } from '../../../../../shared/state';
import Global from '../../../../../shared/Global';
import { digestMessage, message } from '../../../../../../../../shared/utils/src';
import getTextDef from '../../../../../shared/GetTextDef';

function CreateAccountPanel({ onCloseCallback }: { onCloseCallback: () => void }) {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ warningText, setWarningText ] = useState('');

    const createAccountPressed = async() => {
        message('Create account pressed.');

        // Check username and password are valid.
        // Strict check, so it still allows weird names like "0"...
        if (username === '') {
            setWarningText('Username required.');
            return;
        }
        if (password === '') {
            setWarningText('Password required.');
            return;
        }

        // Encrypt the password before sending.
        const hash = await digestMessage(password);

        ApplicationState.connection?.sendEvent('create_account', {
            username,
            password: hash,
        });
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(CREATE_ACCOUNT_FAILURE, (msg, data) => {
                setWarningText(getTextDef(data.messageID));
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="create-account-panel centered panel-template-cont">
            <PanelTemplate
                width="440px"
                height="420px"
                panelName={getTextDef('Create account panel: name')}
                icon={exitIcon}
                onCloseCallback={onCloseCallback}
            >
                <div className="create-account-inner-cont">
                    <div className="create-account-top-info-cont">{getTextDef('Create account panel: info')}</div>

                    <input
                        className="create-account-input"
                        type="text"
                        maxLength={ApplicationState.maxUsernameLength}
                        placeholder={getTextDef('Enter username')}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                        onMouseEnter={() => {
                            Global.gameScene.soundManager.effects.playGUITick();
                        }}
                    />

                    <input
                        className="create-account-input"
                        type="password"
                        maxLength={50}
                        placeholder={getTextDef('Enter password')}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        onMouseEnter={() => {
                            Global.gameScene.soundManager.effects.playGUITick();
                        }}
                    />

                    <div
                        className="create-account-button-cont"
                        onClick={createAccountPressed}
                        onMouseEnter={() => {
                            Global.gameScene.soundManager.effects.playGUITick();
                        }}
                    >
                        <img
                            src={borderImage}
                            className="create-account-button"
                        />
                        <div className="create-account-button-text">
                            {getTextDef('Create account')}
                        </div>
                    </div>

                    {warningText && (
                        <div className="create-account-warning-text">
                            {warningText}
                        </div>
                    )}
                </div>
            </PanelTemplate>
        </div>
    );
}

export default CreateAccountPanel;
