import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import PanelTemplate from '../panel_template/PanelTemplate';
import exitIcon from '../../../../../assets/images/gui/hud/exit-icon.png';
import borderImage from '../../../../../assets/images/gui/panels/account/create-account-button-border.png';
import styles from './AccountPanel.module.scss';
import panelTemplateStyles from '../panel_template/PanelTemplate.module.scss';
import { CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_SUCCESS } from '../../../../../shared/EventTypes';
import { ApplicationState } from '../../../../../shared/state';
import Global from '../../../../../shared/Global';
import { digestMessage, message } from '@rogueworld/utils';
import getTextDef from '../../../../../shared/GetTextDef';

function AccountPanel({
    onCloseCallback,
}: {
    onCloseCallback: () => void;
}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [warningText, setWarningText] = useState('');
    const [passwordChanged, setPasswordChanged] = useState(false);

    const acceptPressed = async() => {
        message('Reset password pressed.');

        // Check the current and new passwords are valid.
        if (currentPassword === '') {
            setWarningText('Current password required.');
            return;
        }
        if (newPassword === '') {
            setWarningText('New password required.');
            return;
        }

        // Encrypt the passwords before sending.
        const currentHash = await digestMessage(currentPassword);
        const newHash = await digestMessage(newPassword);

        ApplicationState.connection?.sendEvent('change_password', {
            currentPassword: currentHash,
            newPassword: newHash,
        });
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(CHANGE_PASSWORD_SUCCESS, (msg, data) => {
                setWarningText(getTextDef('Password changed'));
                setPasswordChanged(true);
            }),
            PubSub.subscribe(CHANGE_PASSWORD_FAILURE, (msg, data) => {
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
        <div className={`${styles['account-panel']} ${panelTemplateStyles.centered} ${panelTemplateStyles['panel-template-cont']}`}>
            <PanelTemplate
                width="440px"
                height="420px"
                panelName={getTextDef('Account panel: name')}
                icon={exitIcon.src}
                onCloseCallback={onCloseCallback}
            >
                <div className={`account-inner-cont ${passwordChanged ? 'password-changed' : ''}`}>
                    {!passwordChanged && (
                        <>
                            <div className={panelTemplateStyles['account-top-info-cont']}>
                                {getTextDef('Account panel: info')}
                            </div>

                            <input
                                type="password"
                                maxLength={50}
                                className={panelTemplateStyles['account-input']}
                                placeholder={getTextDef('Current password')}
                                onChange={(event) => {
                                    setCurrentPassword(event.target.value);
                                }}
                                onMouseEnter={() => {
                                    Global.gameScene.soundManager.effects.playGUITick();
                                }}
                            />

                            <input
                                type="password"
                                maxLength={50}
                                className={panelTemplateStyles['account-input']}
                                placeholder={getTextDef('New password')}
                                onChange={(event) => {
                                    setNewPassword(event.target.value);
                                }}
                                onMouseEnter={() => {
                                    Global.gameScene.soundManager.effects.playGUITick();
                                }}
                            />

                            <div
                                className={panelTemplateStyles['account-accept-button-cont']}
                                onClick={acceptPressed}
                                onMouseEnter={() => {
                                    Global.gameScene.soundManager.effects.playGUITick();
                                }}
                            >
                                <img
                                    src={borderImage.src}
                                    className={panelTemplateStyles['account-accept-button']}
                                    draggable={false}
                                />
                                <div className={panelTemplateStyles['account-accept-button-text']}>
                                    {getTextDef('Accept')}
                                </div>

                            </div>
                        </>
                    )}

                    {warningText && (
                        <div className={`${panelTemplateStyles['account-warning-text']} ${passwordChanged ? panelTemplateStyles['password-changed'] : ''}`}>
                            {warningText}
                        </div>
                    )}
                </div>
            </PanelTemplate>
        </div>
    );
}

export default AccountPanel;
