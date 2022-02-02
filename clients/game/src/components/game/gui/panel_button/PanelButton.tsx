import { GUIState } from '../../../../shared/state';
import './PanelButton.scss';
import Global from '../../../../shared/Global';
import { ReactElement } from 'react';

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
        <div className={`panel-button ${className}`}>
            <img
                className={`gui-icon ${onClick ? 'interactive hand-cursor' : ''}`}
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
