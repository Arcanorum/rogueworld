import { useEffect, useState } from 'react';
import AnimatedNumber from 'animated-number-react';
import PubSub from 'pubsub-js';
import gloryIcon from '../../../../assets/images/gui/hud/glory-icon.png';
import { GLORY_VALUE } from '../../../../shared/EventTypes';
import PanelButton from '../panel_button/PanelButton';
import styles from './GloryCounter.module.scss';
import getTextDef from '../../../../shared/GetTextDef';
import Config from '../../../../shared/Config';

let transitionValueTimeout = 0;

function GloryCounter() {
    const [ glory, setGlory ] = useState(0);
    // Use a string, so it will show the + when positive change.
    const [ difference, setDifference ] = useState('');

    useEffect(() => {
        const subs = [
            PubSub.subscribe(GLORY_VALUE, (msg, data) => {
                const diff = Math.abs(data.old - data.new);

                if (data.new > data.old) {
                    setDifference(`+${diff}`);
                }
                else {
                    setDifference(`-${diff}`);
                }

                clearTimeout(transitionValueTimeout);

                transitionValueTimeout = window.setTimeout(() => {
                    setDifference('');
                }, 5000);

                setGlory(data.new);
            }),
        ];

        // Cleanup.
        return () => {
            clearTimeout(transitionValueTimeout);

            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="glory-counter">
            <PanelButton
                icon={gloryIcon}
                tooltipText={getTextDef('Glory tooltip')}
            />
            <AnimatedNumber
                value={glory}
                formatValue={Config.ANIMATED_NUMBER_FORMAT}
                className="high-contrast-text"
            />
            {difference && <div className={`high-contrast-text ${parseInt(difference) >= 0 ? 'glory-gained' : 'glory-lost'}`}>{difference}</div>}
        </div>
    );
}

export default GloryCounter;
