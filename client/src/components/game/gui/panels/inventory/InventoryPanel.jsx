import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import PanelTemplate from "../panel_template/PanelTemplate";
import inventoryIcon from "../../../../../assets/images/gui/hud/inventory-icon.png";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import "./InventoryPanel.scss";
import { InventoryState, GUIState } from "../../../../../shared/state/States";
import { ADD_ITEM, MODIFY_ITEM, MODIFY_INVENTORY_WEIGHT } from "../../../../../shared/EventTypes";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import Utils from "../../../../../shared/Utils";

const formatItemValue = (value) => {
    if (!value) return 0;
    if (value > 999) return "+999";
    return value;
};

const ItemTooltip = (itemConfig) => (
    <div>
        {Utils.getTextDef(`Item name: ${ItemTypes[itemConfig.typeCode].translationID}`)}
    </div>
);

function ItemOptions({ itemConfig, onCursorLeave, panelBounds }) {
    return (
        <div
          className="item-options"
          style={{ top: GUIState.cursorY - panelBounds.y, left: GUIState.cursorX - panelBounds.x }}
          onMouseLeave={() => onCursorLeave()}
        >
            <div className={`info ${GUIState.cursorInTopSide ? "top" : "bottom"} ${GUIState.cursorInLeftSide ? "left" : "right"}`}>
                <div className="name">
                    {Utils.getTextDef(`Item name: ${ItemTypes[itemConfig.typeCode].translationID}`)}
                </div>
                {itemConfig.durability && <div className="detail">{`(${itemConfig.durability}/${itemConfig.maxDurability})`}</div>}
                {itemConfig.quantity && <div className="detail">{`(x${itemConfig.quantity})`}</div>}
                <div className="detail">{`Weight: ${itemConfig.totalWeight}`}</div>
                <div className="description">
                    {Utils.getTextDef(`Item description: ${ItemTypes[itemConfig.typeCode].translationID}`)}
                </div>
            </div>
            <div className="buttons">
                <div className="button hotbar">Add to hotbar</div>
                <div className="button equip">Quick equip</div>
                <div className="button drop">Drop</div>
            </div>
        </div>
    );
}
ItemOptions.propTypes = {
    itemConfig: PropTypes.object.isRequired,
    onCursorLeave: PropTypes.func.isRequired,
    panelBounds: PropTypes.object.isRequired,
};

function ItemSlot({ itemConfig, onClick }) {
    return (
        <div className="item-slot">
            <div
              className="details"
              draggable={false}
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      ItemTooltip(itemConfig),
                  );
              }}
              onMouseLeave={() => {
                  GUIState.setTooltipContent(null);
              }}
              onClick={() => { onClick(itemConfig); }}
            >
                <img
                  src={ItemIconsList[ItemTypes[itemConfig.typeCode].iconSource]}
                  draggable={false}
                />
                <div
                  className={`high-contrast-text ${(itemConfig.quantity > 999 || itemConfig.durability > 999) ? "small" : ""}`}
                >
                    {formatItemValue(itemConfig.quantity) || formatItemValue(itemConfig.durability) || "???"}
                </div>
            </div>
        </div>
    );
}

ItemSlot.propTypes = {
    itemConfig: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

function InventoryPanel({ onCloseCallback }) {
    const [items, setItems] = useState(InventoryState.items);
    const [searchItems, setSearchItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
    const [inventoryMaxWeight, setInventoryMaxWeight] = useState(InventoryState.maxWeight);
    const [selectedItem, setSelectedItem] = useState(null);
    const panelRef = useRef();

    const onItemPressed = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        const filteredItems = items.filter((item) => Utils
            .getTextDef(`Item name: ${ItemTypes[item.typeCode].translationID}`)
            .toLowerCase()
            .includes(searchText));

        setSearchItems(filteredItems);
    }, [searchText, items]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(ADD_ITEM, () => {
                setItems([...InventoryState.items]);
            }),
            PubSub.subscribe(MODIFY_ITEM, () => {
                setItems([...InventoryState.items]);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_WEIGHT, (msg, data) => {
                setInventoryWeight(data.new);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="inventory-panel centered panel-template-cont gui-zoomable" ref={panelRef}>
            <PanelTemplate
              width="50vw"
              height="80vh"
              panelName={Utils.getTextDef("Inventory panel: name")}
              icon={inventoryIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="top-bar">
                        <div
                          className="weight"
                          onMouseEnter={() => {
                              GUIState.setTooltipContent(Utils.getTextDef("Total inventory weight"));
                          }}
                          onMouseLeave={() => {
                              GUIState.setTooltipContent(null);
                          }}
                        >
                            <img
                              src={weightIcon}
                              width="32px"
                              height="32px"
                            />
                            <span className="high-contrast-text">
                                {`${inventoryWeight}/${inventoryMaxWeight}`}
                            </span>
                        </div>
                        <div className="search">
                            <input
                              placeholder={Utils.getTextDef("Item search")}
                              onChange={(event) => {
                                  setSearchText(event.target.value.toLowerCase());
                              }}
                            />
                        </div>
                    </div>
                    <div className="list">
                        {searchText && searchItems.map((item) => (
                            <ItemSlot
                              key={item.slotIndex}
                              itemConfig={item}
                              onClick={onItemPressed}
                            />
                        ))}
                        {searchText && !searchItems.length && <div className="warning">No items found.</div>}
                        {!searchText && items.map((item) => (
                            <ItemSlot
                              key={item.slotIndex}
                              itemConfig={item}
                              onClick={onItemPressed}
                            />
                        ))}
                        {!searchText && !items.length && <div className="warning">Inventory is empty.</div>}
                    </div>
                </div>
            </PanelTemplate>
            {selectedItem && (
                <ItemOptions
                  itemConfig={selectedItem}
                  onCursorLeave={() => {
                      setSelectedItem(null);
                  }}
                  panelBounds={panelRef.current.getBoundingClientRect()}
                />
            )}
        </div>
    );
}

InventoryPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default InventoryPanel;
