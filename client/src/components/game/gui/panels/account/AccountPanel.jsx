import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import exitIcon from "../../../../../assets/images/gui/hud/exit-icon.png";
import borderImage from "../../../../../assets/images/gui/panels/account/create-account-button-border.png";
import "./AccountPanel.scss";
import Utils from "../../../../../shared/Utils";
import { CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_SUCCESS } from "../../../../../shared/EventTypes";
import { ApplicationState } from "../../../../../shared/state/States";

function AccountPanel({ onCloseCallback }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [warningText, setWarningText] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);

    const acceptPressed = async () => {
        Utils.message("Reset password pressed.");

        // Check the current and new passwords are valid.
        if (currentPassword === "") {
            setWarningText("Current password required.");
            return;
        }
        if (newPassword === "") {
            setWarningText("New password required.");
            return;
        }

        // Encrypt the passwords before sending.
        const currentHash = await Utils.digestMessage(currentPassword);
        const newHash = await Utils.digestMessage(newPassword);

        ApplicationState.connection.sendEvent("change_password", {
            currentPassword: currentHash,
            newPassword: newHash,
        });
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(CHANGE_PASSWORD_SUCCESS, (msg, data) => {
                setWarningText(Utils.getTextDef("Password changed"));
                setPasswordChanged(true);
            }),
            PubSub.subscribe(CHANGE_PASSWORD_FAILURE, (msg, data) => {
                setWarningText(Utils.getTextDef(data.messageID));
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="account-panel centered panel-template-cont">
            <PanelTemplate
              width="440px"
              height="420px"
              panelName={Utils.getTextDef("Account panel: name")}
              icon={exitIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className={`account-inner-cont ${passwordChanged ? "password-changed" : ""}`}>
                    {!passwordChanged && (
                        <>
                            <div className="account-top-info-cont">
                                {Utils.getTextDef("Account panel: info")}
                            </div>

                            <input
                              type="password"
                              maxLength="50"
                              className="account-input"
                              placeholder={Utils.getTextDef("Current password")}
                              onChange={(event) => {
                                  setCurrentPassword(event.target.value);
                              }}
                            />

                            <input
                              type="password"
                              maxLength="50"
                              className="account-input"
                              placeholder={Utils.getTextDef("New password")}
                              onChange={(event) => {
                                  setNewPassword(event.target.value);
                              }}
                            />

                            <div
                              className="account-accept-button-cont"
                              onClick={acceptPressed}
                            >
                                <img
                                  src={borderImage}
                                  className="account-accept-button"
                                  draggable={false}
                                />
                                <div className="account-accept-button-text">
                                    {Utils.getTextDef("Accept")}
                                </div>

                            </div>
                        </>
                    )}

                    {warningText && (
                    <div className={`account-warning-text ${passwordChanged ? "password-changed" : ""}`}>
                        {warningText}
                    </div>
                    )}
                </div>
            </PanelTemplate>
        </div>
    );
}

AccountPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default AccountPanel;
