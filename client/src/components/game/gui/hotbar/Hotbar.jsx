import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import ItemIconsList from "../../../../shared/ItemIconsList";
import ItemTypes from "../../../../catalogues/ItemTypes.json";
import {
    HOLDING_ITEM, HOTBAR_ITEM, MODIFY_ITEM, PANEL_CHANGE,
} from "../../../../shared/EventTypes";
import { ApplicationState, GUIState, InventoryState } from "../../../../shared/state/States";
import "./Hotbar.scss";
import Utils from "../../../../shared/Utils";
import Panels from "../panels/PanelsEnum";
import holdingIcon from "../../../../assets/images/gui/hud/hotbar/holding-icon.png";
import ammunitionIcon from "../../../../assets/images/gui/hud/hotbar/ammunition-icon.png";
import clothingIcon from "../../../../assets/images/gui/hud/hotbar/clothing-icon.png";

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
    const [isHolding, setIsHolding] = useState(false);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(PANEL_CHANGE, () => {
                setInventoryPanelOpen(GUIState.activePanel === Panels.Inventory);
            }),
            PubSub.subscribe(HOLDING_ITEM, () => {
                setIsHolding(itemConfig.slotIndex === InventoryState.holding);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    const slotPressed = () => {
        // Clicking on the hotbar slots while the inventory is open should clear the slot.
        if (inventoryPanelOpen) {
            InventoryState.removeFromHotbar(itemConfig);
        }
        // Use the item.
        else {
            // Tell the game server this player wants to use this item.
            ApplicationState.connection.sendEvent("use_item", itemConfig.slotIndex);
        }
    };

    return (
        <div
          className={`slot ${inventoryPanelOpen ? "remove" : ""} ${isHolding ? "holding" : ""}`}
          draggable={false}
          onMouseEnter={() => {
              GUIState.setTooltipContent(
                  ItemTooltip(itemConfig),
              );
          }}
          onMouseLeave={() => {
              GUIState.setTooltipContent(null);
          }}
          onClick={slotPressed}
        >
            {isHolding && <img src={holdingIcon} className="holding-icon" />}
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
            PubSub.subscribe(MODIFY_ITEM, () => {
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
        <div className="hotbar">
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
