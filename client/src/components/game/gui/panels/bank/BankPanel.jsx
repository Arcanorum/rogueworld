import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import AnimatedNumber from "animated-number-react";
import Utils from "../../../../../shared/Utils";
import PanelTemplate from "../panel_template/PanelTemplate";
import {
    ApplicationState, BankState, GUIState, InventoryState, PlayerState,
} from "../../../../../shared/state/States";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import bankIcon from "../../../../../assets/images/gui/panels/bank/bank-chest.png";
import depositIcon from "../../../../../assets/images/gui/panels/bank/deposit-all-icon.png";
import buyIcon from "../../../../../assets/images/gui/panels/bank/buy-storage-icon.png";
import gloryIcon from "../../../../../assets/images/gui/hud/glory-icon.png";
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
    MODIFY_BANK_MAX_WEIGHT,
} from "../../../../../shared/EventTypes";
import dungeonz from "../../../../../shared/Global";
import Panels from "../PanelsEnum";

const canTransferItem = (FromState, itemConfig, quantity) => {
    if (!itemConfig) return false;

    // Check the other state, or it will be checking if it can move from
    // the same side into the same side, instead of into the other side.
    let ToState = null;
    if (FromState === InventoryState) {
        ToState = BankState;
    }
    else if (FromState === BankState) {
        ToState = InventoryState;
    }

    // Allow depositting weightless items no matter what.
    if (itemConfig.totalWeight <= 0) return true;

    // For stackables, check if at least one unit of the stack can fit, or a specific amount if given.
    if (itemConfig.quantity) {
        // Allow 0.
        if (!Number.isFinite(quantity)) quantity = 1;
        return (
            (itemConfig.totalWeight / itemConfig.quantity) * quantity
        ) <= (
            ToState.maxWeight - ToState.weight
        );
    }

    return itemConfig.totalWeight <= (ToState.maxWeight - ToState.weight);
};

function UpgradeOptions({
    onCursorLeave, panelBounds,
}) {
    const [styleTop] = useState(GUIState.cursorY - panelBounds.y);
    const [styleLeft] = useState(GUIState.cursorX - panelBounds.x);

    useEffect(() => {

    }, []);

    const upgradePressed = () => {
        ApplicationState.connection.sendEvent("bank_buy_upgrade");

        onCursorLeave();
    };

    return (
        <div
          className="item-options upgrade"
          style={{ top: styleTop, left: styleLeft }}
          onMouseLeave={() => onCursorLeave()}
        >
            {ApplicationState.loggedIn && (
            <div className="upgrade">
                <div className="cost">
                    <img src={weightIcon} draggable={false} />
                    <div className="high-contrast-text">{`+${BankState.additionalMaxBankWeightPerUpgrade}`}</div>
                </div>
                <div className="cost">
                    <img src={gloryIcon} draggable={false} />
                    <div className={`high-contrast-text ${PlayerState.glory < BankState.maxWeightUpgradeCost ? "warning" : ""}`}>{BankState.maxWeightUpgradeCost}</div>
                </div>
                {PlayerState.glory >= BankState.maxWeightUpgradeCost && <div className="button accept" onClick={upgradePressed}>{Utils.getTextDef("Buy")}</div>}
                {PlayerState.glory < BankState.maxWeightUpgradeCost && <div className="button warning">{Utils.getTextDef("Not enough glory")}</div>}
            </div>
            )}
            {!ApplicationState.loggedIn && (
            <div className="upgrade">
                <div className="create-account">
                    {Utils.getTextDef("Bank upgrade account needed")}
                </div>
                <div
                  className="button accept"
                  onClick={() => {
                      GUIState.setActivePanel(Panels.CreateAccount);
                  }}
                >
                    {Utils.getTextDef("Create account")}
                </div>
            </div>
            )}
        </div>
    );
}

UpgradeOptions.propTypes = {
    onCursorLeave: PropTypes.func.isRequired,
    panelBounds: PropTypes.object.isRequired,
};

function ItemOptions({
    State, itemConfig, onCursorLeave, onTransferQuantityChanged, panelBounds,
}) {
    const [transferQuantity, setTransferQuantity] = useState(1);
    const [styleTop] = useState(GUIState.cursorY - panelBounds.y);
    const [styleLeft] = useState(GUIState.cursorX - panelBounds.x);

    useEffect(() => {
        // Prevent the deposit amount going over the actual quantity.
        if (transferQuantity > itemConfig.quantity) {
            setTransferQuantity(itemConfig.quantity);
        }
        // Prevent negative deposit amount.
        if (transferQuantity < 0) {
            setTransferQuantity(0);
        }

        onTransferQuantityChanged(transferQuantity);
    }, [transferQuantity]);

    const modTransferQuantity = (amount) => {
        setTransferQuantity(transferQuantity + amount);
    };

    const inputChanged = (event) => {
        setTransferQuantity(parseInt(event.target.value || 0, 10));
    };

    const getTransferButtonText = () => {
        if (State === InventoryState) {
            return Utils.getTextDef("Deposit");
        }

        return Utils.getTextDef("Withdraw");
    };

    const getTransferAllButtonText = () => {
        if (State === InventoryState) {
            return Utils.getTextDef("Deposit entire stack");
        }

        return Utils.getTextDef("Withdraw entire stack");
    };

    /**
     * @param {Boolean} all - For stackables, whether the entire stack should be moved.
     */
    const transferPressed = (all) => {
        if (State === InventoryState) {
            if (itemConfig.quantity) {
                ApplicationState.connection.sendEvent("bank_deposit_item", {
                    slotIndex: itemConfig.slotIndex,
                    quantity: (all === true) ? itemConfig.quantity : transferQuantity,
                });
            }
            else {
                ApplicationState.connection.sendEvent("bank_deposit_item", {
                    slotIndex: itemConfig.slotIndex,
                });
            }
        }
        else if (State === BankState) {
            if (itemConfig.quantity) {
                ApplicationState.connection.sendEvent("bank_withdraw_item", {
                    slotIndex: itemConfig.slotIndex,
                    quantity: (all === true) ? itemConfig.quantity : transferQuantity,
                });
            }
            else {
                ApplicationState.connection.sendEvent("bank_withdraw_item", {
                    slotIndex: itemConfig.slotIndex,
                });
            }
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
                {itemConfig.quantity && <div className="detail">{`x${transferQuantity}`}</div>}
                {itemConfig.durability && <div className={`detail ${canTransferItem(State, itemConfig) ? "" : "no-space"}`}>{`${Utils.getTextDef("Weight")}: ${itemConfig.totalWeight}`}</div>}
                {itemConfig.quantity && <div className={`detail ${canTransferItem(State, itemConfig, transferQuantity) ? "" : "no-space"}`}>{`${Utils.getTextDef("Weight")}: ${transferQuantity * (itemConfig.totalWeight / itemConfig.quantity)}`}</div>}
                <div className="description">
                    {Utils.getTextDef(`Item description: ${ItemTypes[itemConfig.typeCode].translationID}`)}
                </div>
            </div>
            <div className="buttons">
                {itemConfig.durability && canTransferItem(State, itemConfig) && <div className="button options-transfer" onClick={transferPressed}>{getTransferButtonText()}</div>}
                {itemConfig.quantity && canTransferItem(State, itemConfig) && (
                    <>
                        <div className="number-buttons">
                            <div className="number-button options-add-1" onClick={() => { modTransferQuantity(1); }}>+1</div>
                            <div className="number-button options-add-10" onClick={() => { modTransferQuantity(10); }}>+10</div>
                            <div className="number-button options-add-100" onClick={() => { modTransferQuantity(100); }}>+100</div>
                        </div>
                        <div className="number-buttons">
                            <div className="number-button options-remove-1" onClick={() => { modTransferQuantity(-1); }}>-1</div>
                            <div className="number-button options-remove-10" onClick={() => { modTransferQuantity(-10); }}>-10</div>
                            <div className="number-button options-remove-100" onClick={() => { modTransferQuantity(-100); }}>-100</div>
                        </div>
                        <div className="input-bar">
                            <div className="button clear" onClick={() => { setTransferQuantity(0); }}>x</div>
                            <input className="button" type="number" min="0" value={transferQuantity} onChange={inputChanged} />
                        </div>
                        {transferQuantity > 0
                        && canTransferItem(State, itemConfig, transferQuantity) && (
                            <>
                                <div className="button options-transfer" onClick={transferPressed}>{getTransferButtonText()}</div>
                                <div className="button options-transfer-all" onClick={() => { transferPressed(true); }}>{getTransferAllButtonText()}</div>
                            </>
                        )}
                        {transferQuantity <= 0 && canTransferItem(State, itemConfig, transferQuantity) && <div className="button options-no-space">{getTransferButtonText()}</div>}
                    </>
                )}
                {!canTransferItem(State, itemConfig, transferQuantity) && <div className="button options-no-space" onClick={transferPressed}>{Utils.getTextDef("Not enough free space")}</div>}
            </div>
        </div>
    );
}

ItemOptions.propTypes = {
    State: PropTypes.object.isRequired,
    itemConfig: PropTypes.object.isRequired,
    onCursorLeave: PropTypes.func.isRequired,
    onTransferQuantityChanged: PropTypes.func.isRequired,
    panelBounds: PropTypes.object.isRequired,
};

function ItemSlot({ State, itemConfig, onClick }) {
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
                  dungeonz.gameScene.soundManager.effects.playGUITick();
              }}
              onMouseLeave={() => {
                  GUIState.setTooltipContent(null);
              }}
              onClick={() => { onClick(itemConfig, State); }}
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
    State: PropTypes.object.isRequired,
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
    const [inventoryMaxWeight] = useState(InventoryState.maxWeight);
    const [storageWeight, setStorageWeight] = useState(BankState.weight);
    const [storageMaxWeight, setStorageMaxWeight] = useState(BankState.maxWeight);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemTransferQuantity, setSelectedItemTransferQuantity] = useState(0);
    const [TargetState, setTargetState] = useState(InventoryState);
    const [showUpgradeBankOptions, setShowUpgradeBankOptions] = useState(false);
    const [highlightStorageWeight, setHighlightStorageWeight] = useState(false);
    const [highlightInventoryWeight, setHighlightInventoryWeight] = useState(false);
    const panelRef = useRef();

    const onItemPressed = (item, State) => {
        setSelectedItem(item);
        setTargetState(State);
    };

    const useNotEnoughSpaceStyle = (FromState) => {
        if (FromState === TargetState) {
            return false;
        }

        if (selectedItem.quantity) {
            return !canTransferItem(TargetState, selectedItem, selectedItemTransferQuantity);
        }

        return !canTransferItem(TargetState, selectedItem);
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
            PubSub.subscribe(MODIFY_BANK_MAX_WEIGHT, (msg, data) => {
                setStorageMaxWeight(data.new);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="bank-panel centered panel-template-cont" ref={panelRef}>
            <PanelTemplate
              width="70vw"
              height="60vh"
              panelName={Utils.getTextDef("Bank panel: name")}
              icon={bankIcon}
              onCloseCallback={onCloseCallback}
            >
                <div className="inner-cont">
                    <div className="top-bar">
                        <div className="search">
                            <input
                              placeholder={Utils.getTextDef("Item search")}
                              onChange={(event) => {
                                  setSearchText(event.target.value.toLowerCase());
                              }}
                              autoFocus
                            />
                        </div>
                    </div>
                    <div className="headers">
                        <div className="header inventory">
                            <div className="col-name high-contrast-text">{Utils.getTextDef("Inventory panel: name")}</div>
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
                                  className="icon"
                                />
                                <span className={`high-contrast-text ${selectedItem ? `${useNotEnoughSpaceStyle(InventoryState) ? "no-space" : ""}` : ""}`}>
                                    <AnimatedNumber
                                      value={inventoryWeight}
                                      duration={dungeonz.gameConfig.NUMBER_ANIMATION_DURATION}
                                      formatValue={dungeonz.gameConfig.ANIMATED_NUMBER_FORMAT}
                                    />
                                    /
                                    <AnimatedNumber
                                      value={inventoryMaxWeight}
                                      duration={dungeonz.gameConfig.NUMBER_ANIMATION_DURATION}
                                      formatValue={dungeonz.gameConfig.ANIMATED_NUMBER_FORMAT}
                                    />
                                </span>
                                <img
                                  src={depositIcon}
                                  className="icon button"
                                  draggable={false}
                                  onClick={() => {
                                      ApplicationState.connection.sendEvent("bank_deposit_all_items");
                                  }}
                                  onMouseEnter={() => {
                                      GUIState.setTooltipContent(
                                          Utils.getTextDef("Deposit all"),
                                      );
                                      setHighlightInventoryWeight(true);
                                      dungeonz.gameScene.soundManager.effects.playGUITick();
                                  }}
                                  onMouseLeave={() => {
                                      GUIState.setTooltipContent(null);
                                      setHighlightInventoryWeight(false);
                                  }}
                                />
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
                                  className="icon"
                                />
                                <span className={`
                                    high-contrast-text
                                    ${selectedItem ? `${useNotEnoughSpaceStyle(BankState) ? "no-space" : ""}` : ""}
                                `}
                                >
                                    <AnimatedNumber
                                      value={storageWeight}
                                      duration={dungeonz.gameConfig.NUMBER_ANIMATION_DURATION}
                                      formatValue={dungeonz.gameConfig.ANIMATED_NUMBER_FORMAT}
                                    />
                                    /
                                    <AnimatedNumber
                                      value={storageMaxWeight}
                                      duration={dungeonz.gameConfig.NUMBER_ANIMATION_DURATION}
                                      formatValue={dungeonz.gameConfig.ANIMATED_NUMBER_FORMAT}
                                      className={`${highlightStorageWeight ? "highlight" : ""}`}
                                    />
                                </span>
                                <img
                                  src={buyIcon}
                                  className="icon button"
                                  draggable={false}
                                  onClick={() => { setShowUpgradeBankOptions(true); }}
                                  onMouseEnter={() => {
                                      GUIState.setTooltipContent(
                                          Utils.getTextDef("Upgrade bank"),
                                      );
                                      setHighlightStorageWeight(true);
                                      dungeonz.gameScene.soundManager.effects.playGUITick();
                                  }}
                                  onMouseLeave={() => {
                                      GUIState.setTooltipContent(null);
                                      setHighlightStorageWeight(false);
                                  }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="cols">
                        <div className={`list inventory ${highlightInventoryWeight ? "highlight" : ""}`}>
                            {searchText && searchInventoryItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  State={InventoryState}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {searchText && !searchInventoryItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                            {!searchText && inventoryItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  State={InventoryState}
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
                                  State={BankState}
                                  itemConfig={item}
                                  onClick={onItemPressed}
                                />
                            ))}
                            {searchText && !searchStorageItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                            {!searchText && storageItems.map((item) => (
                                <ItemSlot
                                  key={item.id}
                                  State={BankState}
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
                  State={TargetState}
                  itemConfig={selectedItem}
                  onCursorLeave={() => {
                      setSelectedItem(null);
                  }}
                  onTransferQuantityChanged={setSelectedItemTransferQuantity}
                  panelBounds={panelRef.current.getBoundingClientRect()}
                />
            )}
            {showUpgradeBankOptions && (
                <UpgradeOptions
                  onCursorLeave={() => {
                      setShowUpgradeBankOptions(false);
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
