import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import PanelTemplate from '../panel_template/PanelTemplate';
import exitIcon from '../../../../../assets/images/gui/hud/exit-icon.png';
import borderImage from '../../../../../assets/images/gui/panels/account/create-account-button-border.png';
import styles from './CreateAccountPanel.module.scss';
import panelTemplateStyles from '../panel_template/PanelTemplate.module.scss';
import { CREATE_ACCOUNT_FAILURE } from '../../../../../shared/EventTypes';
import { ApplicationState } from '../../../../../shared/state';
import Global from '../../../../../shared/Global';
import { digestMessage, message } from '@rogueworld/utils';
import getTextDef from '../../../../../shared/GetTextDef';
import Config from '../../../../../shared/Config';

function CreateAccountPanel({ onCloseCallback }: { onCloseCallback: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [warningText, setWarningText] = useState('');

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
                setWarningText(getTextDef(data.messageId));
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className={`${styles['create-account-panel']} ${panelTemplateStyles.centered} ${panelTemplateStyles['panel-template-cont']}`}>
            <PanelTemplate
                width="440px"
                height="420px"
                panelName={getTextDef('Create account panel: name')}
                icon={exitIcon.src}
                onCloseCallback={onCloseCallback}
            >
                <div className={styles['create-account-inner-cont']}>
                    <div className={styles['create-account-top-info-cont']}>{getTextDef('Create account panel: info')}</div>

                    <input
                        className={styles['create-account-input']}
                        type="text"
                        maxLength={Config.Settings.MAX_ACCOUNT_USERNAME_LENGTH}
                        placeholder={getTextDef('Enter username')}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                        onMouseEnter={() => {
                            Global.gameScene.soundManager.effects.playGUITick();
                        }}
                    />

                    <input
                        className={styles['create-account-input']}
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
                        className={styles['create-account-button-cont']}
                        onClick={createAccountPressed}
                        onMouseEnter={() => {
                            Global.gameScene.soundManager.effects.playGUITick();
                        }}
                    >
                        <img
                            src={borderImage.src}
                            className={styles['create-account-button']}
                        />
                        <div className={styles['create-account-button-text']}>
                            {getTextDef('Create account')}
                        </div>
                    </div>

                    {warningText && (
                        <div className={styles['create-account-warning-text']}>
                            {warningText}
                        </div>
                    )}
                </div>
            </PanelTemplate>
        </div>
    );
}

export default CreateAccountPanel;
