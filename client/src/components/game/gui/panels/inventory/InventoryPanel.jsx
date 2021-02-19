import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import inventoryIcon from "../../../../../assets/images/gui/hud/inventory-icon.png";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import "./InventoryPanel.scss";
import { InventoryState } from "../../../../../shared/state/States";
import { ADD_ITEM, MODIFY_ITEM } from "../../../../../shared/EventTypes";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import Utils from "../../../../../shared/Utils";

function InventoryPanel({ onCloseCallback }) {
    const [items, setItems] = useState(InventoryState.items);

    const formatItemValue = (value) => {
        if (!value) return 0;
        if (value > 999) return "+999";
        return value;
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(ADD_ITEM, (msd, data) => {
                setItems([...InventoryState.items]);
            }),
            PubSub.subscribe(MODIFY_ITEM, (msd, data) => {
                setItems([...InventoryState.items]);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="inventory-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="50vw"
              height="80vh"
              panelName={Utils.getTextDef("Inventory panel: name")}
              icon={inventoryIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="top-bar">
                        <div className="weight">
                            <img
                              src={weightIcon}
                              width="32px"
                              height="32px"
                            />
                            <span className="high-contrast-text">456/1000</span>
                        </div>
                        <div className="search">
                            <input placeholder={Utils.getTextDef("Item search")} />
                        </div>
                    </div>
                    <div className="list">
                        {items.map((item) => (
                            <div
                              key={item.slotIndex}
                              className="item-slot"
                            >
                                <img
                                  src={ItemIconsList[ItemTypes[item.typeCode].iconSource]}
                                />
                                <div
                                  className={`high-contrast-text ${(item.quantity > 999 || item.durability > 999) ? "small" : ""}`}
                                >
                                    {formatItemValue(item.quantity) || formatItemValue(item.durability) || "???"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

InventoryPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default InventoryPanel;
