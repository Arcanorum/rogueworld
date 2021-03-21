import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import Utils from "../../../../../shared/Utils";
import PanelTemplate from "../panel_template/PanelTemplate";
import {
    ApplicationState, BankState, GUIState, InventoryState,
} from "../../../../../shared/state/States";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import bankIcon from "../../../../../assets/images/gui/panels/bank/bank-chest.png";
import depositIcon from "../../../../../assets/images/gui/panels/bank/deposit-all-icon.png";
import buyIcon from "../../../../../assets/images/gui/panels/bank/buy-storage-icon.png";
import "./BankPanel.scss";
import ItemTooltip from "../../item_tooltip/ItemTooltip";
import {
    ADD_INVENTORY_ITEM,
    MODIFY_INVENTORY_ITEM,
    REMOVE_INVENTORY_ITEM,
    MODIFY_INVENTORY_WEIGHT,
    ADD_BANK_ITEM,
    MODIFY_BANK_ITEM,
    REMOVE_BANK_ITEM,
    MODIFY_BANK_WEIGHT,
} from "../../../../../shared/EventTypes";

const canDepositItem = (itemConfig) => {
    if (!itemConfig) return false;

    // For stackables, check if at least one unit of the stack can fit.
    if (itemConfig.quantity) {
        return (
            itemConfig.totalWeight / itemConfig.quantity
        ) <= (
            BankState.maxWeight - BankState.weight
        );
    }

    return itemConfig.totalWeight <= (BankState.maxWeight - BankState.weight);
};

function ItemOptions({ itemConfig, onCursorLeave, panelBounds }) {
    const [depositQuantity, setDepositQuantity] = useState(1);
    const [styleTop] = useState(GUIState.cursorY - panelBounds.y);
    const [styleLeft] = useState(GUIState.cursorX - panelBounds.x);

    useEffect(() => {
        // Prevent the deposit amount going over the actual quantity.
        if (depositQuantity > itemConfig.quantity) {
            setDepositQuantity(itemConfig.quantity);
        }
        // Prevent negative deposit amount. They will want to deposit at least 1.
        if (depositQuantity < 1) {
            setDepositQuantity(1);
        }
    }, [depositQuantity]);

    const modDepositQuantity = (amount) => {
        setDepositQuantity(depositQuantity + amount);
    };

    const inputChanged = (event) => {
        setDepositQuantity(parseInt(event.target.value || 0, 10));
    };

    const depositPressed = () => {
        console.log("depositPressed");

        if (itemConfig.quantity) {
            ApplicationState.connection.sendEvent("bank_deposit_item", {
                slotIndex: itemConfig.slotIndex,
                quantity: depositQuantity,
            });
        }
        else {
            ApplicationState.connection.sendEvent("bank_deposit_item", {
                slotIndex: itemConfig.slotIndex,
            });
        }

        onCursorLeave();
    };

    return (
        <div
          className="item-options"
          style={{ top: styleTop, left: styleLeft }}
          onMouseLeave={() => onCursorLeave()}
        >
            <div className={`info ${GUIState.cursorInTopSide ? "top" : "bottom"} ${GUIState.cursorInLeftSide ? "left" : "right"}`}>
                <div className="name">
                    {Utils.getTextDef(`Item name: ${ItemTypes[itemConfig.typeCode].translationID}`)}
                </div>
                {itemConfig.durability && <div className="detail">{`${itemConfig.durability}/${itemConfig.maxDurability}`}</div>}
                {itemConfig.quantity && <div className="detail">{`x${itemConfig.quantity}`}</div>}
                <div className={`detail ${canDepositItem(itemConfig) ? "" : "no-space"}`}>{`Weight: ${itemConfig.totalWeight}`}</div>
                <div className="description">
                    {Utils.getTextDef(`Item description: ${ItemTypes[itemConfig.typeCode].translationID}`)}
                </div>
            </div>
            <div className="buttons">
                {itemConfig.durability && canDepositItem(itemConfig) && <div className="button options-deposit" onClick={depositPressed}>{Utils.getTextDef("Deposit")}</div>}
                {itemConfig.quantity && canDepositItem(itemConfig) && (
                    <>
                        <div className="number-buttons">
                            <div className="number-button options-add-1" onClick={() => { modDepositQuantity(1); }}>+1</div>
                            <div className="number-button options-add-10" onClick={() => { modDepositQuantity(10); }}>+10</div>
                            <div className="number-button options-add-100" onClick={() => { modDepositQuantity(100); }}>+100</div>
                        </div>
                        <div className="number-buttons">
                            <div className="number-button options-remove-1" onClick={() => { modDepositQuantity(-1); }}>-1</div>
                            <div className="number-button options-remove-10" onClick={() => { modDepositQuantity(-10); }}>-10</div>
                            <div className="number-button options-remove-100" onClick={() => { modDepositQuantity(-100); }}>-100</div>
                        </div>
                        <div className="input-bar">
                            <div className="button clear" onClick={() => { setDepositQuantity(1); }}>x</div>
                            <input className="button" type="number" min="1" value={depositQuantity} onChange={inputChanged} />
                        </div>
                        <div className="button options-deposit" onClick={depositPressed}>{Utils.getTextDef("Deposit")}</div>
                    </>
                )}
                {!canDepositItem(itemConfig) && <div className="button options-no-space" onClick={depositPressed}>?Not enough free space</div>}
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
                      <ItemTooltip itemTypeCode={itemConfig.typeCode} />,
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
    const [storageItems, setStorageItems] = useState(BankState.items);
    const [searchInventoryItems, setSearchInventoryItems] = useState([]);
    const [searchStorageItems, setSearchStorageItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
    const [inventoryMaxWeight, setInventoryMaxWeight] = useState(InventoryState.maxWeight);
    const [storageWeight, setStorageWeight] = useState(BankState.weight);
    const [storageMaxWeight, setStorageMaxWeight] = useState(BankState.maxWeight);
    const [selectedItem, setSelectedItem] = useState(null);
    const panelRef = useRef();

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

    useEffect(() => {
        const subs = [
            PubSub.subscribe(ADD_INVENTORY_ITEM, () => {
                setInventoryItems([...InventoryState.items]);
            }),
            PubSub.subscribe(REMOVE_INVENTORY_ITEM, () => {
                setInventoryItems([...InventoryState.items]);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_ITEM, () => {
                setInventoryItems([...InventoryState.items]);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_WEIGHT, (msg, data) => {
                setInventoryWeight(data.new);
            }),
            PubSub.subscribe(ADD_BANK_ITEM, () => {
                setStorageItems([...BankState.items]);
            }),
            PubSub.subscribe(REMOVE_BANK_ITEM, () => {
                setStorageItems([...BankState.items]);
            }),
            PubSub.subscribe(MODIFY_BANK_ITEM, () => {
                setStorageItems([...BankState.items]);
            }),
            PubSub.subscribe(MODIFY_BANK_WEIGHT, (msg, data) => {
                setStorageWeight(data.new);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="bank-panel centered panel-template-cont gui-zoomable" ref={panelRef}>
            <PanelTemplate
              width="70vw"
              height="60vh"
              panelName={Utils.getTextDef("Bank panel: name")}
              icon={bankIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="top-bar">
                        <img
                          src={depositIcon}
                          className="button deposit"
                          draggable={false}
                          onMouseEnter={() => {
                              GUIState.setTooltipContent(
                                  Utils.getTextDef("Deposit all items"),
                              );
                          }}
                          onMouseLeave={() => {
                              GUIState.setTooltipContent(null);
                          }}
                        />
                        <div className="search">
                            <input
                              placeholder={Utils.getTextDef("Item search")}
                              onChange={(event) => {
                                  setSearchText(event.target.value.toLowerCase());
                              }}
                              autoFocus
                            />
                        </div>
                        <img
                          src={buyIcon}
                          className="button buy"
                          draggable={false}
                          onMouseEnter={() => {
                              GUIState.setTooltipContent(
                                  Utils.getTextDef("Buy bank space"),
                              );
                          }}
                          onMouseLeave={() => {
                              GUIState.setTooltipContent(null);
                          }}
                        />
                    </div>
                    <div className="headers">
                        <div className="header inventory">
                            <div className="col-name high-contrast-text">{Utils.getTextDef("Inventory")}</div>
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
                            <div className="col-name high-contrast-text">{Utils.getTextDef("Storage")}</div>
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
                                {selectedItem
                                && (
                                <span className={`high-contrast-text ${canDepositItem(selectedItem) ? "" : "no-space"}`}>
                                    {`${storageWeight}/${storageMaxWeight}`}
                                </span>
                                )}
                                {!selectedItem
                                && (
                                <span className="high-contrast-text">
                                    {`${storageWeight}/${storageMaxWeight}`}
                                </span>
                                )}
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
                            {searchText && searchStorageItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {searchText && !searchStorageItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                            {!searchText && storageItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {!searchText && !storageItems.length && <div className="warning">{Utils.getTextDef("Empty storage")}</div>}
                        </div>
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

BankPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default BankPanel;
