import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import styles from './Tooltip.module.scss';
import { CURSOR_MOVE, TOOLTIP_CONTENT } from '../../../../shared/EventTypes';
import { GUIState } from '../../../../shared/state';

function Tooltip() {
    const [content, setContent] = useState(null);
    const [cursorPosition, setCursorPosition] = useState({ cursorX: 0, cursorY: 0 });

    useEffect(() => {
        const subs = [
            PubSub.subscribe(CURSOR_MOVE, (msg, data) => {
                setCursorPosition(data.new);
            }),
            PubSub.subscribe(TOOLTIP_CONTENT, (msg, data) => {
                setContent(data);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <>
            {content && (
                <div
                    className={`tooltip ${!GUIState.cursorInLeftSide ? 'right' : ''} ${!GUIState.cursorInTopSide ? 'bottom' : ''}`}
                    style={{ top: cursorPosition.cursorY, left: cursorPosition.cursorX }}
                >
                    {content}
                </div>
            )}
        </>
    );
}

export default Tooltip;
