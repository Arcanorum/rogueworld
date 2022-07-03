import { useEffect, useState, ReactElement } from 'react';
import PubSub from 'pubsub-js';
import hitpointIcon from '../../../../assets/images/gui/hud/hitpoint-icon.png';
import hitpointCounter from '../../../../assets/images/gui/hud/hitpoint-counter.png';
import foodIcon from '../../../../assets/images/gui/hud/food-icon.png';
import combatIcon from '../../../../assets/images/gui/hud/combat-icon.png';
import outOfcombatIcon from '../../../../assets/images/gui/hud/out-of-combat-icon.png';
import foodCounter from '../../../../assets/images/gui/hud/food-counter.png';
import emptyCounter from '../../../../assets/images/gui/hud/empty-counter.png';
import styles from './Meters.module.scss';
import guiStyles from '../GUI.module.scss';
import {
    HITPOINTS_VALUE, MAX_HITPOINTS_VALUE, FOOD_VALUE, MAX_FOOD_VALUE,
    COMBAT_STATUS_TRIGGER,
    ADD_INVENTORY_ITEM,
    MODIFY_INVENTORY_ITEM,
} from '../../../../shared/EventTypes';
import { GUIState, InventoryState } from '../../../../shared/state';
import inventoryIcon from '../../../../assets/images/gui/hud/inventory-icon.png';
import craftIcon from '../../../../assets/images/gui/hud/craft-icon.png';
import PanelButton from '../panel_button/PanelButton';
import Panels from '../panels/Panels';
import getTextDef from '../../../../shared/GetTextDef';
import ItemIconsList from '../../../../shared/ItemIconsList';
import Config from '../../../../shared/Config';

// How many of the little circle counters to show on each meter bar.
const maxCounters = 20;

function Counters({
    stat,
    maxStat,
    counterImage,
}: {
    stat: number;
    maxStat: number;
    counterImage: string;
}) {
    // The value might be in 0.5s as well as whole numbers, so round down to only count each full
    // counter.
    stat = Math.floor(stat);
    // Get the % of the stat this player has. i.e.
    const filledCount = Math.floor((stat / maxStat) * maxCounters);
    // Add some counters, up to the max amount, and show them filled in
    // if they are within the amount of HP/food that the player has.
    return <>{
        Array.from({ length: maxCounters }, (v, i) => {
            if (i < filledCount) {
                return <img key={i} src={counterImage} draggable={false} className={styles['meter-counter']} />;
            }
            return <img key={i} src={emptyCounter.src} draggable={false} className={styles['meter-counter']} />;
        })
    }</>;
}

interface INewItem {
    key: string;
    typeCode: string;
    quantity: number;
    timeout: NodeJS.Timeout;
}

function NewItem(config: INewItem) {
    return (
        <div key={config.key} className={styles['new-item']}>
            <img
                src={ItemIconsList[Config.ItemTypes[config.typeCode].iconSource]}
                draggable={false}
            />
            <div className={'high-contrast-text'}>+{config.quantity}</div>
        </div>
    );
}

const Tooltip = (content: ReactElement | string) => (
    <div style={{ width: '500px' }}>{content}</div>
);

function Meters() {
    const [hitPoints, setHitPoints] = useState(0);
    const [maxHitPoints, setMaxHitPoints] = useState(0);

    const [food, setFood] = useState(0);
    const [maxFood, setMaxFood] = useState(0);

    const [newItems, setNewItems] = useState<Array<INewItem>>([]);

    const [combatTimer, setCombatTimer] = useState(0);

    let combatTimerUpdateInterval = -1;
    let combatTimerInterval = 0;

    const updateCombatTimer = () => {
        combatTimerInterval = Math.max(0, combatTimerInterval - 1000);
        setCombatTimer(Math.ceil(combatTimerInterval / 1000));
    };

    const refreshCombatTimer = () => {
        if (combatTimerUpdateInterval !== -1) {
            clearInterval(combatTimerUpdateInterval);
        }
        combatTimerUpdateInterval = window.setInterval(() => updateCombatTimer(), 1000);
    };

    const addNewItem = (typeCode: string, quantity: number) => {
        const key = `${Date.now()}`;
        setNewItems(
            (prev) => [
                ...prev,
                {
                    key,
                    typeCode,
                    quantity,
                    timeout: setTimeout(() => {
                        setNewItems((prev2) => [...prev2.slice(1)]);
                    }, 2000),
                },
            ],
        );
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(HITPOINTS_VALUE, (msg, data) => {
                setHitPoints(data.new);
            }),
            PubSub.subscribe(MAX_HITPOINTS_VALUE, (msg, data) => {
                setMaxHitPoints(data.new);
            }),
            PubSub.subscribe(FOOD_VALUE, (msg, data) => {
                setFood(data.new);
            }),
            PubSub.subscribe(MAX_FOOD_VALUE, (msg, data) => {
                setMaxFood(data.new);
            }),
            PubSub.subscribe(ADD_INVENTORY_ITEM, (msg, data) => {
                addNewItem(data.typeCode, data.quantity);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_ITEM, (msg, data) => {
                if (!data) return;

                const diff = data.new.quantity - data.old.quantity;

                if (diff <= 0) return;

                addNewItem(InventoryState.items[data.new.slotIndex].typeCode, diff);
            }),
            PubSub.subscribe(COMBAT_STATUS_TRIGGER, (msg, data) => {
                data = parseInt(data, 10);
                if (Number.isNaN(data)) {
                    data = 0;
                }
                combatTimerInterval = data;
                setCombatTimer(Math.ceil(combatTimerInterval / 1000));
                refreshCombatTimer();
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
            if (combatTimerUpdateInterval !== -1) {
                clearInterval(combatTimerUpdateInterval);
            }
            combatTimerUpdateInterval = -1;
        };
    }, []);

    return (
        <div className={styles.meters}>
            <div className={styles['new-items']}>
                {newItems.map((newItem) => NewItem(newItem))}
            </div>
            <div className={styles['inventory-button']}>
                <PanelButton
                    icon={inventoryIcon.src}
                    onClick={() => {
                        GUIState.setActivePanel(Panels.Inventory);
                    }}
                    tooltipText={`${getTextDef('Inventory tooltip')} ( I, right-click, spacebar )`}
                />
                <PanelButton
                    icon={craftIcon.src}
                    onClick={() => {
                        GUIState.setCraftingStation(
                            'Self',
                            'Crafting',
                        );
                        GUIState.setActivePanel(Panels.Crafting);
                    }}
                    tooltipText={`${getTextDef('Craft tooltip')} ( C )`}
                />
            </div>
            <div className={styles.meter}>
                <img
                    className={guiStyles['gui-icon']}
                    src={hitpointIcon.src}
                    draggable={false}
                    onMouseEnter={() => {
                        GUIState.setTooltipContent(
                            Tooltip(getTextDef('Hitpoint tooltip')),
                        );
                    }}
                    onMouseLeave={() => {
                        GUIState.setTooltipContent(null);
                    }}
                />
                <div>
                    <Counters
                        stat={hitPoints}
                        maxStat={maxHitPoints}
                        counterImage={hitpointCounter.src}
                    />
                </div>
            </div>
            <div className={styles.meter}>
                <img
                    className={guiStyles['gui-icon']}
                    src={foodIcon.src}
                    draggable={false}
                    onMouseEnter={() => {
                        GUIState.setTooltipContent(
                            Tooltip(getTextDef('Food tooltip')),
                        );
                    }}
                    onMouseLeave={() => {
                        GUIState.setTooltipContent(null);
                    }}
                />
                <div id="food-counters">
                    <Counters
                        stat={food}
                        maxStat={maxFood}
                        counterImage={foodCounter.src}
                    />
                </div>
            </div>
            <div className={styles['combat-indicator-icon']}>
                <img
                    className={guiStyles['gui-icon']}
                    src={((combatTimer > 0) && combatIcon.src) || outOfcombatIcon.src}
                    draggable={false}
                    onMouseEnter={() => {
                        GUIState.setTooltipContent(
                            Tooltip(getTextDef('Combat tooltip')),
                        );
                    }}
                    onMouseLeave={() => {
                        GUIState.setTooltipContent(null);
                    }}
                />
                { (combatTimer > 0) && <span className="high-contrast-text">{combatTimer}</span> }
            </div>
        </div>
    );
}

export default Meters;
