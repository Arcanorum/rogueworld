import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import exitIcon from "../../../../../assets/images/gui/hud/exit-icon.png";
import borderImage from "../../../../../assets/images/gui/panels/account/create-account-button-border.png";
import "./CreateAccountPanel.scss";
import Utils from "../../../../../shared/Utils";
import { CREATE_ACCOUNT_FAILURE } from "../../../../../shared/EventTypes";
import { ApplicationState } from "../../../../../shared/state/States";

function CreateAccountPanel({ onCloseCallback }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [warningText, setWarningText] = useState("");

    const createAccountPressed = async () => {
        Utils.message("Create account pressed.");

        // Check username and password are valid.
        // Strict check, so it still allows weird names like "0"...
        if (username === "") {
            setWarningText("Username required.");
            return;
        }
        if (password === "") {
            setWarningText("Password required.");
            return;
        }

        // Encrypt the password before sending.
        const hash = await Utils.digestMessage(password);

        ApplicationState.connection.sendEvent("create_account", {
            username,
            password: hash,
        });
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(CREATE_ACCOUNT_FAILURE, (msg, data) => {
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
        <div className="create-account-panel centered panel-template-cont">
            <PanelTemplate
              width="440px"
              height="420px"
              panelName={Utils.getTextDef("Create account panel: name")}
              icon={exitIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="create-account-inner-cont">
                    <div className="create-account-top-info-cont">{Utils.getTextDef("Create account panel: info")}</div>

                    <input
                      className="create-account-input"
                      type="text"
                      maxLength={ApplicationState.maxUsernameLength}
                      placeholder={Utils.getTextDef("Enter username")}
                      onChange={(event) => {
                          setUsername(event.target.value);
                      }}
                    />

                    <input
                      className="create-account-input"
                      type="password"
                      maxLength="50"
                      placeholder={Utils.getTextDef("Enter password")}
                      onChange={(event) => {
                          setPassword(event.target.value);
                      }}
                    />

                    <div
                      className="create-account-button-cont"
                      onClick={createAccountPressed}
                    >
                        <img
                          src={borderImage}
                          className="create-account-button"
                        />
                        <div className="create-account-button-text">
                            {Utils.getTextDef("Create account")}
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

CreateAccountPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default CreateAccountPanel;
