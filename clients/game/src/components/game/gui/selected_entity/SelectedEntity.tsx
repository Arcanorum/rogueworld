import { ReactElement, useEffect, useState } from 'react';
import { SELECTED_ENTITY, SELECTED_ENTITY_HITPOINTS } from '../../../../shared/EventTypes';
import styles from './SelectedEntity.module.scss';
import craftIcon from '../../../../assets/images/gui/hud/craft-icon.png';
import { GUIState } from '../../../../shared/state';
import getTextDef from '../../../../shared/GetTextDef';

const Tooltip = (content: ReactElement | string) => (
    <div style={{ width: '250px' }}>{content}</div>
);

function SelectedEntity() {
    const [icon, setIcon] = useState('');
    const [name, setName] = useState('');
    const [hitPoints, setHitPoints] = useState(0);
    const [maxHitPoints, setMaxHitPoints] = useState(0);
    const [canBeCraftedAt, setCanBeCraftedAt] = useState(false);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(SELECTED_ENTITY, (msg, data) => {
                setIcon(data?.new?.icon || '');
                setName(data?.new?.name || '');
                setHitPoints(data?.new?.hitPoints || 0);
                setMaxHitPoints(data?.new?.maxHitPoints || 0);
                setCanBeCraftedAt(data?.new?.canBeCraftedAt || false);
            }),
            PubSub.subscribe(SELECTED_ENTITY_HITPOINTS, (msg, data) => {
                setHitPoints(data.new || 0);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className={`${styles['selection']} ${styles['centered']}`}>
            {icon &&
                <div className={`${styles['entity-icon']}`}>
                    <img src={icon} />
                </div>
            }
            {hitPoints &&
                <div className={`${styles['hp-bar']} ${!icon ? styles['all-padding'] : ''}`}>
                    <div className={`${styles['entity-name']} high-contrast-text`}>{name}</div>
                    <div className={`${styles['hp']}`} style={{ width: `${(hitPoints / maxHitPoints) * 100}%` }}></div>
                    <div className={`${styles['value']} high-contrast-text`}>{`${hitPoints}/${maxHitPoints}`}</div>
                </div>
            || ''}
            {canBeCraftedAt &&
                <div className={styles['craft-icon']}>
                    <img
                        src={craftIcon.src}
                        draggable={false}
                        onMouseEnter={() => {
                            GUIState.setTooltipContent(
                                Tooltip(getTextDef('Can be crafted at tooltip')),
                            );
                        }}
                        onMouseLeave={() => {
                            GUIState.setTooltipContent(null);
                        }}
                    />
                </div>
            }
        </div>
    );
}

export default SelectedEntity;
