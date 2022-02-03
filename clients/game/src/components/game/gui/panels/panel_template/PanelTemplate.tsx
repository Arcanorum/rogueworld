import { MouseEventHandler, ReactElement } from 'react';
import styles from './PanelTemplate.module.scss';
import closeButtonImage from '../../../../../assets/images/gui/panels/panel-close-button.png';
import cornerImage from '../../../../../assets/images/gui/panels/panel-corner.png';
import iconBorderImage from '../../../../../assets/images/gui/panels/panel-icon-border.png';
import Global from '../../../../../shared/Global';

function PanelTemplate({
    children,
    width,
    height,
    icon = '',
    panelName = '',
    onCloseCallback,
}: {
    children: ReactElement;
    width: string;
    height: string;
    icon?: string;
    panelName?: string;
    onCloseCallback?: MouseEventHandler<HTMLImageElement>;
}) {
    return (
        <div
            className="panel-template-main-cont"
            style={{ width: `${width}`, height: `${height}` }}
            draggable={false}
        >
            <img
                src={iconBorderImage}
                className="centered panel-template-icon-border"
                draggable={false}
            />

            <div className="panel-template-name-border">
                {`\xa0\xa0${panelName}`}
            </div>

            <div className="panel-template-name">
                {`\xa0\xa0${panelName}`}
            </div>

            <img
                src={icon}
                className="centered panel-template-icon"
                draggable={false}
            />

            {onCloseCallback && (
                <img
                    src={closeButtonImage}
                    className="centered panel-template-close-button"
                    draggable={false}
                    onClick={onCloseCallback}
                    onMouseEnter={() => {
                        Global.gameScene.soundManager.effects.playGUITick();
                    }}
                />
            )}
            {!onCloseCallback && (
                <img
                    src={cornerImage}
                    className="centered panel-template-top-corner"
                    draggable={false}
                />
            )}

            <img
                src={iconBorderImage}
                className="centered panel-template-left-corner"
                draggable={false}
            />

            <img
                src={iconBorderImage}
                className="centered panel-template-right-corner"
                draggable={false}
            />

            <div className="panel-template-contents-cont">
                {children}
            </div>
        </div>
    );
}

export default PanelTemplate;
