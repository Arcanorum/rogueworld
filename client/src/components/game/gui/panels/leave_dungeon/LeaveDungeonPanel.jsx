import React from "react";
import PropTypes from "prop-types";
import PanelTemplate from "../panel_template/PanelTemplate";
import Utils from "../../../../../shared/Utils";
import leaveDungeonIcon from "../../../../../assets/images/gui/hud/leave-dungeon-icon.png";
import "leaflet/dist/leaflet.css";
import "./LeaveDungeonPanel.scss";
import { ApplicationState } from "../../../../../shared/state/States";
import leavePartyButtonBorder from "../../../../../assets/images/gui/panels/dungeon/leave-party-button-border.png";
import createButtonBorderValid from "../../../../../assets/images/gui/panels/dungeon/create-button-border-valid.png";

function LeaveDungeonPanel({ onCloseCallback }) {
    return (
        <div className="leave-dungeon-panel centered panel-template-cont">
            <PanelTemplate
              width="540px"
              height="180px"
              panelName={`${Utils.getTextDef("Leave dungeon panel: title")}?`}
              icon={leaveDungeonIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="leave-dungeon-inner-cont">
                    <div className="leave-dungeon-info-cont">
                        {Utils.getTextDef("Leave dungeon panel: info")}
                    </div>
                    <div className="leave-dungeon-bottom-cont">
                        <div
                          className="leave-dungeon-button-cont centered"
                          onClick={onCloseCallback}
                        >
                            <img
                              className="leave-dungeon-button"
                              src={createButtonBorderValid}
                            />
                            <div className="leave-dungeon-button-text">
                                {Utils.getTextDef("Stay")}
                            </div>
                        </div>
                        <div
                          className="leave-dungeon-button-cont centered"
                          onClick={() => ApplicationState.connection.sendEvent("leave_dungeon")}
                        >
                            <img
                              className="leave-dungeon-button"
                              src={leavePartyButtonBorder}
                            />
                            <div className="leave-dungeon-button-text">
                                {Utils.getTextDef("Leave")}
                            </div>
                        </div>
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

LeaveDungeonPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default LeaveDungeonPanel;
