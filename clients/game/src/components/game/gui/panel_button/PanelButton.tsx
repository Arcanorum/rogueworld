import { ReactElement } from 'react';
import { GUIState } from '../../../../shared/state';
import styles from './PanelButton.module.scss';
import guiStyles from '../GUI.module.scss';
import Global from '../../../../shared/Global';

function Tooltip(content: ReactElement | string) {
    return (
        <div className="tooltip-panel-button">
            {content}
        </div>
    );
}

function PanelButton({
    icon,
    tooltipText,
    onClick,
    className = '',
}: {
    icon: string;
    tooltipText: string;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <div className={`${styles['panel-button']} ${className}`}>
            <img
                className={`${guiStyles['gui-icon']} ${onClick ? 'interactive hand-cursor' : ''}`}
                src={icon}
                draggable={false}
                onMouseEnter={() => {
                    GUIState.setTooltipContent(
                        Tooltip(tooltipText),
                    );
                    Global.gameScene.soundManager.effects.playGUITick();
                }}
                onMouseLeave={() => {
                    GUIState.setTooltipContent(null);
                }}
                onClick={onClick}
            />
        </div>
    );
}

export default PanelButton;
