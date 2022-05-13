import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import playButtonBorder from '../../assets/images/misc/play-button-border.png';
import styles from './LoadingPage.module.scss';
import { LOADING, LOAD_PROGRESS, LOAD_FILE_PROGRESS } from '../../shared/EventTypes';
import { ApplicationState } from '../../shared/state';
import Hints from './Hints';
import { getShuffledArray } from '@rogueworld/utils';
import getTextDef from '../../shared/GetTextDef';

function LoadingBar() {
    const [progress, setProgress] = useState('0%');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOAD_PROGRESS, (msg, data) => {
                setProgress(`${Math.floor(data * 100)}%`);
            }),
            PubSub.subscribe(LOAD_FILE_PROGRESS, (msg, data) => {
                setFileName(data);
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className={styles['progress-bar']}>
            <div className={styles.filled} style={{ width: progress }} />
            <div className={styles.info}>
                <div className={styles.percent}>{progress}</div>
                <div className={styles['file-name']}>{`( ${fileName} )`}</div>
            </div>
        </div>
    );
}

function LoadingPage() {
    const [randomHints] = useState(getShuffledArray(Hints));
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [hint, setHint] = useState(randomHints[currentHintIndex]);
    const [loading, setLoading] = useState(ApplicationState.loading);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(LOADING, (msg, data) => {
                setLoading(data.new);
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    useEffect(() => {
        setHint(randomHints[currentHintIndex]);
    }, [currentHintIndex]);

    const nextHintPressed = () => {
        if (currentHintIndex === randomHints.length - 1) {
            // Reset back to the start of the hints list.
            setCurrentHintIndex(0);
        }
        else {
            setCurrentHintIndex(currentHintIndex + 1);
        }
    };

    const playPressed = () => {
        ApplicationState.setLoadAccepted(true);
    };

    return (
        <div className={styles['loading-page']}>
            {loading && (
                <div className={styles['heading animated-ellipsis']}>
                    {getTextDef('Loading')}
                </div>
            )}
            {!loading && (
                <div className={styles['heading']}>{getTextDef('Game loaded')}</div>
            )}

            <div className={styles['loading-hint-cont']}>
                <div className={styles['col image']}>
                    <img src={hint.image} className={styles['loading-hint-image']} draggable={false} />
                </div>
                <div className={styles['col loading-hint-text']}>
                    {getTextDef(`Hint: ${hint.textDefId}`)}
                </div>
            </div>

            <div className={styles['loading-next-hint-button']} onClick={nextHintPressed}>
                {getTextDef('Next hint')}
            </div>

            {!loading && (
                <div className={styles['loading-play-button-cont']} onClick={playPressed}>
                    <img className={styles['loading-play-button-border']} src={playButtonBorder.src} draggable={false} />
                    <div className={styles['loading-play-text']}>{getTextDef('Play')}</div>
                </div>
            )}
            {loading && (
                <LoadingBar />
            )}
        </div>
    );
}

export default LoadingPage;
