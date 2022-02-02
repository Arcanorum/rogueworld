import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import ItemIconsList from '../../../../shared/ItemIconsList';
import {
    AMMUNITION_ITEM,
    CLOTHING_ITEM,
    HOLDING_ITEM,
    HOTBAR_ITEM,
    MODIFY_INVENTORY_ITEM,
    PANEL_CHANGE,
} from '../../../../shared/EventTypes';
import { GUIState, InventoryState } from '../../../../shared/state';
import './Hotbar.scss';
import UseItem from '../../../../shared/UseItem';
import Panels from '../panels/Panels';
import holdingIcon from '../../../../assets/images/gui/hud/hotbar/holding-icon.png';
import ammunitionIcon from '../../../../assets/images/gui/hud/hotbar/ammunition-icon.png';
import clothingIcon from '../../../../assets/images/gui/hud/hotbar/clothing-icon.png';
import Global from '../../../../shared/Global';
import { formatItemValue } from '../../../../../../../shared/utils/src';
import getTextDef from '../../../../shared/GetTextDef';
import ItemState from '../../../../shared/ItemState';
import Config from '../../../../shared/Config';

const ItemTooltip = (itemState: ItemState) => (
    <div>
        <div>{getTextDef(`Item name: ${Config.ItemTypes[itemState.typeCode].translationId}`)}</div>
        <div>
            {itemState.durability && <div className="detail">{`${itemState.durability}/${itemState.maxDurability}`}</div>}
            {itemState.quantity && <div className="detail">{`x${itemState.quantity}`}</div>}
        </div>
    </div>
);

function HotbarSlot({
    itemState,
}: {
    itemState: ItemState;
}) {
    const [ inventoryPanelOpen, setInventoryPanelOpen ] = useState(
        GUIState.activePanel === Panels.Inventory,
    );
    const [ isHolding, setIsHolding ] = useState(itemState === InventoryState.holding);
    const [ isAmmunition, setIsAmmunition ] = useState(
        itemState === InventoryState.ammunition,
    );
    const [ isClothing, setIsClothing ] = useState(itemState === InventoryState.clothing);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(PANEL_CHANGE, () => {
                setInventoryPanelOpen(GUIState.activePanel === Panels.Inventory);
            }),
            PubSub.subscribe(HOLDING_ITEM, () => {
                setIsHolding(itemState === InventoryState.holding);
            }),
            PubSub.subscribe(AMMUNITION_ITEM, () => {
                setIsAmmunition(itemState === InventoryState.ammunition);
            }),
            PubSub.subscribe(CLOTHING_ITEM, () => {
                setIsClothing(itemState === InventoryState.clothing);
            }),
        ];

        return () => {
            // Hide in case the item in the hotbar was being hovered, and
            // now can't call it's own onMouseLeave when removed.
            GUIState.setTooltipContent(null);

            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    const slotPressed = () => {
        // Clicking on the hotbar slots while the inventory is open should clear the slot.
        if (inventoryPanelOpen) {
            // If the item in this slot is equipped, unequip it first.
            if (itemState === InventoryState.holding
            || itemState === InventoryState.ammunition
            || itemState === InventoryState.clothing) {
                UseItem(itemState);
            }
            InventoryState.removeFromHotbar(itemState);
        }
        // Use the item.
        else {
            // Tell the game server this player wants to use this item.
            UseItem(itemState);
        }
    };

    return (
        <div
            className={`slot hand-cursor ${inventoryPanelOpen ? 'remove' : ''} ${isHolding ? 'holding' : ''} ${isAmmunition ? 'ammunition' : ''} ${isClothing ? 'clothing' : ''}`}
            draggable={false}
            onMouseEnter={() => {
                GUIState.setTooltipContent(
                    ItemTooltip(itemState),
                );
                Global.gameScene.soundManager.effects.playGUITick();
            }}
            onMouseLeave={() => {
                GUIState.setTooltipContent(null);
            }}
            onClick={slotPressed}
        >
            {isHolding && <img src={holdingIcon} className="equipped-icon" />}
            {isAmmunition && <img src={ammunitionIcon} className="equipped-icon" />}
            {isClothing && <img src={clothingIcon} className="equipped-icon" />}
            <img
                src={ItemIconsList[Config.ItemTypes[itemState.typeCode].iconSource]}
                draggable={false}
            />
            <div
                className={`high-contrast-text ${(itemState.quantity > 999 || itemState.durability > 999) ? 'small' : ''}`}
            >
                {formatItemValue(itemState.quantity) || formatItemValue(itemState.durability) || '???'}
            </div>
        </div>
    );
}

function Hotbar() {
    const [ hotbarItems, setHotbarItems ] = useState<Array<ItemState>>([]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(HOTBAR_ITEM, () => {
                setHotbarItems([ ...InventoryState.hotbar ]);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_ITEM, () => {
                setHotbarItems([ ...InventoryState.hotbar ]);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="hotbar gui-scalable">
            {hotbarItems.map((item) => (
                <HotbarSlot
                    key={item.id}
                    itemState={item}
                />
            ))}
        </div>
    );
}

export default Hotbar;
