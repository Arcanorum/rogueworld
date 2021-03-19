import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import Utils from "../../../../../shared/Utils";
import PanelTemplate from "../panel_template/PanelTemplate";
import { GUIState, InventoryState } from "../../../../../shared/state/States";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import bankIcon from "../../../../../assets/images/gui/panels/bank/bank-chest.png";
import depositIcon from "../../../../../assets/images/gui/panels/bank/deposit-all-icon.png";
import buyIcon from "../../../../../assets/images/gui/panels/bank/buy-storage-icon.png";
import "./BankPanel.scss";

function ItemSlot({ itemConfig, onClick }) {
    // const [inHotbar, setInHotbar] = useState(isItemInHotbar(itemConfig));

    useEffect(() => {
        const subs = [
            // PubSub.subscribe(MODIFY_ITEM, () => {
            //     // setInHotbar(isItemInHotbar(itemConfig));
            // }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="item-slot">
            <div
              className="details"
              draggable={false}
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      //   <ItemTooltip itemTypeCode={itemConfig.typeCode} />,
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
                    {Utils.formatItemValue(itemConfig.quantity) || Utils.formatItemValue(itemConfig.durability) || "???"}
                </div>
            </div>
        </div>
    );
}

ItemSlot.propTypes = {
    itemConfig: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

function BankPanel({ onCloseCallback }) {
    const [inventoryItems, setInventoryItems] = useState(InventoryState.items);
    const [storageItems, setStorageItems] = useState(InventoryState.items);
    const [searchInventoryItems, setSearchInventoryItems] = useState([]);
    const [searchStorageItems, setSearchStorageItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
    const [inventoryMaxWeight, setInventoryMaxWeight] = useState(InventoryState.maxWeight);
    const [selectedItem, setSelectedItem] = useState(null);

    const onItemPressed = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        const filteredInventoryItems = inventoryItems.filter((item) => Utils
            .getTextDef(`Item name: ${ItemTypes[item.typeCode].translationID}`)
            .toLowerCase()
            .includes(searchText));

        const filteredStorageItems = storageItems.filter((item) => Utils
            .getTextDef(`Item name: ${ItemTypes[item.typeCode].translationID}`)
            .toLowerCase()
            .includes(searchText));

        setSearchInventoryItems(filteredInventoryItems);
        setSearchStorageItems(filteredStorageItems);

        // Also hide the tooltip, as onMouseLeave doesn't get fired when an element is removed, so
        // if the cursor is over one of the items and showing the tooltip when someone searches, if
        // the item gets filtered out the tooltip for it will remain visible.
        GUIState.setTooltipContent(null);
    }, [searchText, inventoryItems, storageItems]);

    return (
        <div className="bank-panel centered panel-template-cont gui-zoomable">
            <PanelTemplate
              width="70vw"
              height="60vh"
              panelName={Utils.getTextDef("Bank panel: name")}
              icon={bankIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="top-bar">
                        <img src={depositIcon} className="button deposit" />
                        <div className="search">
                            <input
                              placeholder={Utils.getTextDef("Item search")}
                              onChange={(event) => {
                                  setSearchText(event.target.value.toLowerCase());
                              }}
                              autoFocus
                            />
                        </div>
                        <img src={buyIcon} className="button buy" />
                    </div>
                    <div className="headers">
                        <div className="header inventory">
                            <div className="col-name high-contrast-text">Inventory</div>
                            <div
                              className="weight"
                              onMouseEnter={() => {
                                  GUIState.setTooltipContent(Utils.getTextDef("Inventory weight"));
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
                        </div>
                        <div className="header storage">
                            <div className="col-name high-contrast-text">Storage</div>
                            <div
                              className="weight"
                              onMouseEnter={() => {
                                  GUIState.setTooltipContent(Utils.getTextDef("Storage weight"));
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
                        </div>
                    </div>
                    <div className="cols">
                        <div className="list inventory">
                            {searchText && searchInventoryItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {searchText && !searchInventoryItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                            {!searchText && inventoryItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {!searchText && !inventoryItems.length && <div className="warning">{Utils.getTextDef("Empty inventory")}</div>}
                        </div>
                        <div className="list storage">
                            {searchText && searchInventoryItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {searchText && !searchInventoryItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                            {!searchText && inventoryItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {!searchText && !inventoryItems.length && <div className="warning">{Utils.getTextDef("Empty storage")}</div>}
                        </div>

                    </div>
                </div>
            </PanelTemplate>
        </div>
    );
}

BankPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default BankPanel;
