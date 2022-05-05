import { useEffect, useState } from 'react';
import { SELECTED_ENTITY } from '../../../../shared/EventTypes';
import styles from './SelectedEntity.module.scss';

function SelectedEntity() {
    const [icon, setIcon] = useState('');
    const [name, setName] = useState('');
    const [hitPoints, setHitPoints] = useState(0);
    const [maxHitPoints, setMaxHitPoints] = useState(0);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(SELECTED_ENTITY, (msg, data) => {
                setIcon(data.new.icon || '');
                setName(data.new.name || '');
                setHitPoints(data.new.hitPoints || 0);
                setMaxHitPoints(data.new.maxHitPoints || 0);
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
                <div className={`${styles['icon']}`}>
                    <img src={icon} />
                </div>
            }
            <div className={`${styles['hp-bar']} ${!icon ? styles['all-padding'] : ''}`}>
                <div className={`${styles['entity-name']} high-contrast-text`}>{name}</div>
                <div className={`${styles['hp']}`}></div>
                <div className={`${styles['value']} high-contrast-text`}>{`${hitPoints}/${maxHitPoints}`}</div>
            </div>
        </div>
    );
}

export default SelectedEntity;
