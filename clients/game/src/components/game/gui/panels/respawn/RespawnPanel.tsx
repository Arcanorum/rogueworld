import PanelTemplate from '../panel_template/PanelTemplate';
import respawnIcon from '../../../../../assets/images/gui/panels/respawn/respawn-icon.png';
import borderImage from '../../../../../assets/images/gui/panels/respawn/respawn-button-border.png';
import styles from './RespawnPanel.module.scss';
import { ApplicationState } from '../../../../../shared/state';
import Global from '../../../../../shared/Global';
import getTextDef from '../../../../../shared/GetTextDef';
import { getRandomIntInclusive } from '@dungeonz/utils';

function RespawnPanel() {
    const respawnPressed = async() => {
        ApplicationState.connection?.sendEvent('respawn');
    };

    return (
        <div className="respawn-panel centered panel-template-cont">
            <PanelTemplate
                width="440px"
                height="220px"
                panelName={getTextDef('Respawn panel: name')}
                icon={respawnIcon.src}
            >
                <div className="inner-cont">
                    <div className="main-cont">
                        <div className="info">
                            {getTextDef(`Respawn panel: info ${getRandomIntInclusive(1, 3)}`)}
                        </div>
                    </div>
                    <div className="bottom-cont">
                        <div
                            className="button-cont centered"
                            onClick={respawnPressed}
                            onMouseEnter={() => {
                                Global.gameScene.soundManager.effects.playGUITick();
                            }}
                        >
                            <img
                                src={borderImage.src}
                                className="button centered"
                                draggable={false}
                            />
                            <div className="text centered">
                                {getTextDef('Respawn')}
                            </div>
                        </div>
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

export default RespawnPanel;
