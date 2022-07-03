import { getRandomIntInclusive } from '@rogueworld/utils';
import PanelTemplate from '../panel_template/PanelTemplate';
import respawnIcon from '../../../../../assets/images/gui/panels/respawn/respawn-icon.png';
import borderImage from '../../../../../assets/images/gui/panels/respawn/respawn-button-border.png';
import styles from './RespawnPanel.module.scss';
import panelTemplateStyles from '../panel_template/PanelTemplate.module.scss';
import { ApplicationState } from '../../../../../shared/state';
import Global from '../../../../../shared/Global';
import getTextDef from '../../../../../shared/GetTextDef';

function RespawnPanel() {
    const respawnPressed = async () => {
        ApplicationState.connection?.sendEvent('respawn');
    };

    return (
        <div className={`${styles['respawn-panel']} ${panelTemplateStyles.centered} ${panelTemplateStyles['panel-template-cont']}`}>
            <PanelTemplate
                width="440px"
                height="220px"
                panelName={getTextDef('Respawn panel: name')}
                icon={respawnIcon.src}
            >
                <div className={styles['inner-cont']}>
                    <div className={styles['main-cont']}>
                        <div className={styles.info}>
                            {getTextDef(`Respawn panel: info ${getRandomIntInclusive(1, 3)}`)}
                        </div>
                    </div>
                    <div className={styles['bottom-cont']}>
                        <div
                            className={`${styles['button-cont']} ${panelTemplateStyles.centered}`}
                            onClick={respawnPressed}
                            onMouseEnter={() => {
                                Global.gameScene.soundManager.effects.playGUITick();
                            }}
                        >
                            <img
                                src={borderImage.src}
                                className={`${styles.button} ${panelTemplateStyles.centered}`}
                                draggable={false}
                            />
                            <div className={`${styles.text} ${panelTemplateStyles.centered}`}>
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
