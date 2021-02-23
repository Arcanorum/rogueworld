import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import ItemIconsList from "../../../../shared/ItemIconsList";
import ItemTypes from "../../../../catalogues/ItemTypes.json";
import { HOTBAR_ITEM } from "../../../../shared/EventTypes";
import { GUIState, InventoryState } from "../../../../shared/state/States";
import "./Hotbar.scss";
import Utils from "../../../../shared/Utils";

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
    return (
        <div
          className="slot"
          draggable={false}
          onMouseEnter={() => {
              GUIState.setTooltipContent(
                  ItemTooltip(itemConfig),
              );
          }}
          onMouseLeave={() => {
              GUIState.setTooltipContent(null);
          }}
        //   onClick={() => { onClick(itemConfig); }}
        >
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

function Hotbar(params) {
    const [hotbarItems, setHotbarItems] = useState([]);
    const [inventoryPanelOpen, setInventoryPanelOpen] = useState(false);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(HOTBAR_ITEM, () => {
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
                  key={item.slotIndex}
                  itemConfig={item}
                />
            ))}
        </div>
    );
}

export default Hotbar;
