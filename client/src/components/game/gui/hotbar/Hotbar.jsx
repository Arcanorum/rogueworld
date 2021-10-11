import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import ItemIconsList from "../../../../shared/ItemIconsList";
import ItemTypes from "../../../../catalogues/ItemTypes.json";
import {
    AMMUNITION_ITEM,
    CLOTHING_ITEM,
    HOLDING_ITEM,
    HOTBAR_ITEM,
    MODIFY_INVENTORY_ITEM,
    PANEL_CHANGE,
} from "../../../../shared/EventTypes";
import { GUIState, InventoryState } from "../../../../shared/state/States";
import "./Hotbar.scss";
import Utils from "../../../../shared/Utils";
import UseItem from "../../../../shared/UseItem";
import Panels from "../panels/PanelsEnum";
import holdingIcon from "../../../../assets/images/gui/hud/hotbar/holding-icon.png";
import ammunitionIcon from "../../../../assets/images/gui/hud/hotbar/ammunition-icon.png";
import clothingIcon from "../../../../assets/images/gui/hud/hotbar/clothing-icon.png";
import dungeonz from "../../../../shared/Global";

const ItemTooltip = (itemConfig) => (
    <div>
        <div>{Utils.getTextDef(`Item name: ${ItemTypes[itemConfig.typeCode].translationID}`)}</div>
        <div>
            {itemConfig.durability && <div className="detail">{`${itemConfig.durability}/${itemConfig.maxDurability}`}</div>}
            {itemConfig.quantity && <div className="detail">{`x${itemConfig.quantity}`}</div>}
        </div>
    </div>
);

function HotbarSlot({ itemConfig }) {
    const [inventoryPanelOpen, setInventoryPanelOpen] = useState(
        GUIState.activePanel === Panels.Inventory,
    );
    const [isHolding, setIsHolding] = useState(itemConfig === InventoryState.holding);
    const [isAmmunition, setIsAmmunition] = useState(
        itemConfig === InventoryState.ammunition,
    );
    const [isClothing, setIsClothing] = useState(itemConfig === InventoryState.clothing);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(PANEL_CHANGE, () => {
                setInventoryPanelOpen(GUIState.activePanel === Panels.Inventory);
            }),
            PubSub.subscribe(HOLDING_ITEM, () => {
                setIsHolding(itemConfig === InventoryState.holding);
            }),
            PubSub.subscribe(AMMUNITION_ITEM, () => {
                setIsAmmunition(itemConfig === InventoryState.ammunition);
            }),
            PubSub.subscribe(CLOTHING_ITEM, () => {
                setIsClothing(itemConfig === InventoryState.clothing);
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
            if (itemConfig === InventoryState.holding
            || itemConfig === InventoryState.ammunition
            || itemConfig === InventoryState.clothing) {
                UseItem(itemConfig);
            }
            InventoryState.removeFromHotbar(itemConfig);
        }
        // Use the item.
        else {
            // Tell the game server this player wants to use this item.
            UseItem(itemConfig);
        }
    };

    return (
        <div
          className={`slot hand-cursor ${inventoryPanelOpen ? "remove" : ""} ${isHolding ? "holding" : ""} ${isAmmunition ? "ammunition" : ""} ${isClothing ? "clothing" : ""}`}
          draggable={false}
          onMouseEnter={() => {
              GUIState.setTooltipContent(
                  ItemTooltip(itemConfig),
              );
              dungeonz.gameScene.soundManager.effects.playGUITick();
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
              src={ItemIconsList[ItemTypes[itemConfig.typeCode].iconSource]}
              draggable={false}
            />
            <div
              className={`high-contrast-text ${(itemConfig.quantity > 999 || itemConfig.durability > 999) ? "small" : ""}`}
            >
                {Utils.formatItemValue(itemConfig.quantity) || Utils.formatItemValue(itemConfig.durability) || "???"}
            </div>
        </div>
    );
}

HotbarSlot.propTypes = {
    itemConfig: PropTypes.object.isRequired,
};

function Hotbar() {
    const [hotbarItems, setHotbarItems] = useState([]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(HOTBAR_ITEM, () => {
                setHotbarItems([...InventoryState.hotbar]);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_ITEM, () => {
                setHotbarItems([...InventoryState.hotbar]);
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
                  itemConfig={item}
                />
            ))}
        </div>
    );
}

export default Hotbar;
