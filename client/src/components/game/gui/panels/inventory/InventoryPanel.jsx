import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import AnimatedNumber from "animated-number-react";
import PanelTemplate from "../panel_template/PanelTemplate";
import inventoryIcon from "../../../../../assets/images/gui/hud/inventory-icon.png";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import "./InventoryPanel.scss";
import { InventoryState, GUIState, ApplicationState } from "../../../../../shared/state/States";
import {
    ADD_INVENTORY_ITEM,
    MODIFY_INVENTORY_ITEM,
    MODIFY_INVENTORY_WEIGHT,
    REMOVE_INVENTORY_ITEM,
    REMOVE_ALL_INVENTORY_ITEMS,
} from "../../../../../shared/EventTypes";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import Utils from "../../../../../shared/Utils";
import UseItem from "../../../../../shared/UseItem";
import ItemTooltip from "../../item_tooltip/ItemTooltip";
import dungeonz from "../../../../../shared/Global";

const isItemInHotbar = (itemConfig) => InventoryState.hotbar
    .some((eachItem) => eachItem === itemConfig);
function DropOptions({ itemConfig, onCursorLeave }) {
    const [dropQuantity, setDropQuantity] = useState(1);

    useEffect(() => {
        // Prevent the drop amount going over the actual quantity.
        if (dropQuantity > itemConfig.quantity) {
            setDropQuantity(itemConfig.quantity);
        }
        // Prevent negative drop amount.
        if (dropQuantity < 0) {
            setDropQuantity(0);
        }
    }, [dropQuantity]);

    const modDropQuantity = (amount) => {
        setDropQuantity(dropQuantity + amount);
    };

    const inputChanged = (event) => {
        setDropQuantity(parseInt(event.target.value || 0, 10));
    };

    /**
     * @param {Boolean} all - Whether the entire stack should be moved.
     */
    const dropPressed = (all) => {
        ApplicationState.connection.sendEvent("drop_item", {
            slotIndex: itemConfig.slotIndex,
            quantity: (all === true) ? itemConfig.quantity : dropQuantity,
        });

        onCursorLeave();
    };

    return (
        <div className="buttons">
            <div className="number-buttons">
                <div className="number-button options-add-1" onClick={() => { modDropQuantity(1); }}>+1</div>
                <div className="number-button options-add-10" onClick={() => { modDropQuantity(10); }}>+10</div>
                <div className="number-button options-add-100" onClick={() => { modDropQuantity(100); }}>+100</div>
            </div>
            <div className="number-buttons">
                <div className="number-button options-remove-1" onClick={() => { modDropQuantity(-1); }}>-1</div>
                <div className="number-button options-remove-10" onClick={() => { modDropQuantity(-10); }}>-10</div>
                <div className="number-button options-remove-100" onClick={() => { modDropQuantity(-100); }}>-100</div>
            </div>
            <div className="input-bar">
                <div className="button clear" onClick={() => { setDropQuantity(0); }}>x</div>
                <input className="button" type="number" min="0" value={dropQuantity} onChange={inputChanged} />
            </div>
            {dropQuantity > 0 && (
                <>
                    <div className="button options-drop" onClick={dropPressed}>{Utils.getTextDef("Drop")}</div>
                    <div className="button options-drop-all" onClick={() => { dropPressed(true); }}>{Utils.getTextDef("Drop entire stack")}</div>
                </>
            )}
            {dropQuantity <= 0 && <div className="button options-full-hotbar">{Utils.getTextDef("Drop")}</div>}
        </div>
    );
}

DropOptions.propTypes = {
    itemConfig: PropTypes.object.isRequired,
    onCursorLeave: PropTypes.func.isRequired,
};

function ItemOptions({ itemConfig, onCursorLeave, panelBounds }) {
    const [inHotbar] = useState(isItemInHotbar(itemConfig));
    const [hotbarFull] = useState(InventoryState.hotbar.length >= InventoryState.MAX_HOTBAR_SLOTS);
    const [hasUseEffect] = useState(ItemTypes[itemConfig.typeCode].hasUseEffect);
    const [isEquippable] = useState(ItemTypes[itemConfig.typeCode].equippable);
    const [showDropOptions, setShowDropOptions] = useState(false);

    const addToHotbarPressed = () => {
        InventoryState.addToHotbar(itemConfig);

        onCursorLeave();
    };

    const removeFromHotbarPressed = () => {
        InventoryState.removeFromHotbar(itemConfig);

        // Unequip it if it was equipped, otherwise it will
        // still be usable even though not on the hotbar.
        if (InventoryState.holding === itemConfig
            || InventoryState.ammunition === itemConfig
            || InventoryState.clothing === itemConfig) {
            // Immediately use the item, which for an equippable, will equip it.
            UseItem(itemConfig);
        }

        onCursorLeave();
    };

    const quickEquipPressed = () => {
        InventoryState.addToHotbar(itemConfig);
        // Immediately use the item, which for an equippable, will equip it.
        UseItem(itemConfig);

        onCursorLeave();
    };

    const quickUsePressed = () => {
        // Immediately use the item.
        UseItem(itemConfig);

        onCursorLeave();
    };

    const dropPressed = () => {
        ApplicationState.connection.sendEvent("drop_item", {
            slotIndex: itemConfig.slotIndex,
            quantity: itemConfig.quantity,
        });

        onCursorLeave();
    };

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
                {itemConfig.durability && <div className="detail">{`${itemConfig.durability}/${itemConfig.maxDurability}`}</div>}
                {itemConfig.quantity && <div className="detail">{`x${itemConfig.quantity}`}</div>}
                <div className="detail">{`${Utils.getTextDef("Weight")}: ${itemConfig.totalWeight}`}</div>
                <div className="description">
                    {Utils.getTextDef(`Item description: ${ItemTypes[itemConfig.typeCode].translationID}`)}
                </div>
            </div>
            {!showDropOptions && (
            <div className="buttons">
                {hasUseEffect && inHotbar && <div className="button options-remove-hotbar" onClick={removeFromHotbarPressed}>{Utils.getTextDef("Remove from hotbar")}</div>}
                {hasUseEffect && hotbarFull && !inHotbar && <div className="button options-full-hotbar">{Utils.getTextDef("Hotbar full")}</div>}
                {hasUseEffect && !hotbarFull && !inHotbar && <div className="button options-add-hotbar" onClick={addToHotbarPressed}>{Utils.getTextDef("Add to hotbar")}</div>}
                {hasUseEffect && !hotbarFull && isEquippable && !inHotbar && <div className="button options-equip" onClick={quickEquipPressed}>{Utils.getTextDef("Quick equip")}</div>}
                {hasUseEffect && !isEquippable && <div className="button options-equip" onClick={quickUsePressed}>{Utils.getTextDef("Quick use")}</div>}
                {itemConfig.durability && <div className="button options-drop" onClick={dropPressed}>{Utils.getTextDef("Drop")}</div>}
                {itemConfig.quantity > 1 && <div className="button options-drop" onClick={() => { setShowDropOptions(true); }}>{Utils.getTextDef("Drop")}</div>}
                {itemConfig.quantity === 1 && <div className="button options-drop" onClick={dropPressed}>{Utils.getTextDef("Drop")}</div>}
            </div>
            )}
            {showDropOptions && (
            <DropOptions
              itemConfig={itemConfig}
              onCursorLeave={onCursorLeave}
            />
            )}
        </div>
    );
}

ItemOptions.propTypes = {
    itemConfig: PropTypes.object.isRequired,
    onCursorLeave: PropTypes.func.isRequired,
    panelBounds: PropTypes.object.isRequired,
};

function ItemSlot({ itemConfig, onClick }) {
    const [inHotbar, setInHotbar] = useState(isItemInHotbar(itemConfig));

    useEffect(() => {
        const subs = [
            PubSub.subscribe(MODIFY_INVENTORY_ITEM, () => {
                setInHotbar(isItemInHotbar(itemConfig));
            }),
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
              className={`details ${inHotbar ? "in-hotbar" : ""}`}
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
              onClick={(e) => {
                  // Drop item (all quantity) if shift clicked
                  if (e.shiftKey) {
                      ApplicationState.connection.sendEvent("drop_item", {
                          slotIndex: itemConfig.slotIndex,
                          quantity: itemConfig.quantity,
                      });
                  } else {
                      onClick(itemConfig);
                  }
              }}
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

function InventoryPanel({ onCloseCallback }) {
    const [items, setItems] = useState(InventoryState.items);
    const [searchItems, setSearchItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
    const [inventoryMaxWeight] = useState(InventoryState.maxWeight);
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

        // Also hide the tooltip, as onMouseLeave doesn't get fired when an element is removed, so
        // if the cursor is over one of the items and showing the tooltip when someone searches, if
        // the item gets filtered out the tooltip for it will remain visible.
        GUIState.setTooltipContent(null);
    }, [searchText, items]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(ADD_INVENTORY_ITEM, () => {
                setItems([...InventoryState.items]);
            }),
            PubSub.subscribe(REMOVE_INVENTORY_ITEM, () => {
                setItems([...InventoryState.items]);
            }),
            PubSub.subscribe(REMOVE_ALL_INVENTORY_ITEMS, () => {
                setItems([...InventoryState.items]);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_ITEM, () => {
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
        <div className="inventory-panel centered panel-template-cont" ref={panelRef}>
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
                        </div>
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
                    <div className="list">
                        {searchText && searchItems.map((item) => (
                            <ItemSlot
                              key={item.id}
                              itemConfig={item}
                              onClick={onItemPressed}
                            />
                        ))}
                        {searchText && !searchItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                        {!searchText && items.map((item) => (
                            <ItemSlot
                              key={item.id}
                              itemConfig={item}
                              onClick={onItemPressed}
                            />
                        ))}
                        {!searchText && !items.length && <div className="warning">{Utils.getTextDef("Empty inventory")}</div>}
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
