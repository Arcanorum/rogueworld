import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import registerIcon from "../../../../../assets/images/gui/panels/change_name/register.png";
import borderImage from "../../../../../assets/images/gui/panels/account/create-account-button-border.png";
import gloryIcon from "../../../../../assets/images/gui/hud/glory-icon.png";
import "./ChangeNamePanel.scss";
import Utils from "../../../../../shared/Utils";
import { DISPLAY_NAME_VALUE } from "../../../../../shared/EventTypes";
import { ApplicationState, PlayerState } from "../../../../../shared/state/States";
import dungeonz from "../../../../../shared/Global";

function ChangeNamePanel({ onCloseCallback }) {
    const [newName, setNewName] = useState("");
    const [warningText, setWarningText] = useState(null);
    const [nameChanged, setNameChanged] = useState(false);

    const acceptPressed = async () => {
        Utils.message("Change name pressed.");

        // Check the new name is valid.
        // Don't allow just spaces.
        if (!newName || !newName.trim()) {
            setWarningText(Utils.getTextDef("New name required"));
            return;
        }

        // Check it is not the same.
        if (newName === PlayerState.displayName) {
            setWarningText(Utils.getTextDef("New name different"));
            return;
        }

        // Trim spaces from the ends to prevent players from making their usernames look out of place.
        ApplicationState.connection.sendEvent("change_display_name", newName.trim());
    };

    useEffect(() => {
        // The warning text might have been cleared, but some other message to show might still be met.
        if (!warningText) {
            // Check they have enough glory.
            if (ApplicationState.displayNameChangeCost > PlayerState.glory) {
                setWarningText(Utils.getTextDef("Not enough glory"));
            }
        }
    }, [warningText]);

    useEffect(() => {
        // Check it is not the same.
        if (newName === PlayerState.displayName) {
            setWarningText(Utils.getTextDef("New name different"));
        }
        else {
            setWarningText("");
        }
    }, [newName]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(DISPLAY_NAME_VALUE, () => {
                setWarningText(Utils.getTextDef("Character name changed"));
                setNameChanged(true);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="change-name-panel centered panel-template-cont">
            <PanelTemplate
              width="50vw"
              height="50vh"
              panelName={Utils.getTextDef("Change name panel: name")}
              icon={registerIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className={`inner-cont ${nameChanged ? "name-changed" : ""}`}>
                    {!nameChanged && (
                        <>
                            <div className="name-cont">
                                <div className="heading">
                                    {Utils.getTextDef("Current character name")}
                                </div>

                                <div className="name current">
                                    {PlayerState.displayName}
                                </div>
                            </div>
                            <div className="name-cont">
                                <div className="heading">
                                    {Utils.getTextDef("New character name")}
                                </div>

                                <input
                                  type="text"
                                  maxLength={ApplicationState.maxDisplayNameLength}
                                  className="name new"
                                  placeholder={Utils.getTextDef("Name input")}
                                  onChange={(event) => {
                                      setNewName(event.target.value);
                                  }}
                                  onMouseEnter={() => {
                                      dungeonz.gameScene.soundManager.effects.playGUITick();
                                  }}
                                />
                            </div>

                            <div className="cost">
                                <img src={gloryIcon} draggable={false} />
                                <div className={`high-contrast-text ${PlayerState.glory < ApplicationState.displayNameChangeCost ? "warning" : ""}`}>{ApplicationState.displayNameChangeCost}</div>
                            </div>

                            {!warningText && (
                            <div
                              className="accept-button-cont"
                              onClick={acceptPressed}
                              onMouseEnter={() => {
                                  dungeonz.gameScene.soundManager.effects.playGUITick();
                              }}
                            >
                                <img
                                  src={borderImage}
                                  className="accept-button"
                                  draggable={false}
                                />
                                <div className="accept-button-text">
                                    {Utils.getTextDef("Accept")}
                                </div>
                            </div>
                            )}
                        </>
                    )}

                    {warningText && (
                    <div className={`warning-text ${nameChanged ? "name-changed" : ""}`}>
                        {warningText}
                    </div>
                    )}
                </div>
            </PanelTemplate>
        </div>
    );
}

ChangeNamePanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default ChangeNamePanel;
