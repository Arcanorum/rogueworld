import React from "react";
import PanelTemplate from "../panel_template/PanelTemplate";
import respawnIcon from "../../../../../assets/images/gui/panels/respawn/respawn-icon.png";
import borderImage from "../../../../../assets/images/gui/panels/respawn/respawn-button-border.png";
import "./RespawnPanel.scss";
import Utils from "../../../../../shared/Utils";
import { ApplicationState } from "../../../../../shared/state/States";

function RespawnPanel() {
    const respawnPressed = async () => {
        ApplicationState.connection.sendEvent("respawn");
    };

    return (
        <div className="respawn-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width={440}
              height={220}
              panelName={Utils.getTextDef("Respawn panel: name")}
              icon={respawnIcon}
            >
                <div className="inner-cont">
                    <div className="main-cont">
                        <div className="info">
                            {Utils.getTextDef(`Respawn panel: info ${Utils.getRandomIntInclusive(1, 3)}`)}
                        </div>
                    </div>
                    <div className="bottom-cont">
                        <div
                          className="button-cont centered"
                          onClick={respawnPressed}
                        >
                            <img
                              src={borderImage}
                              className="button centered"
                            />
                            <div className="text centered">
                                {Utils.getTextDef("Respawn")}
                            </div>
                        </div>
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

export default RespawnPanel;
