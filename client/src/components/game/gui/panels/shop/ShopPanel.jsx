import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import AnimatedNumber from "animated-number-react";
import PanelTemplate from "../panel_template/PanelTemplate";
import shopIcon from "../../../../../assets/images/gui/panels/shop/shop-icon.png";
import weightIcon from "../../../../../assets/images/gui/hud/weight-icon.png";
import gloryIcon from "../../../../../assets/images/gui/hud/glory-icon.png";
import "./ShopPanel.scss";
import {
    InventoryState, GUIState, ApplicationState, PlayerState,
} from "../../../../../shared/state/States";
import {
    GLORY_VALUE,
    MODIFY_INVENTORY_WEIGHT,
    SHOP,
    STOCK_PRICES,
} from "../../../../../shared/EventTypes";
import ItemIconsList from "../../../../../shared/ItemIconsList";
import ItemTypes from "../../../../../catalogues/ItemTypes.json";
import Utils from "../../../../../shared/Utils";
import ItemTooltip from "../../item_tooltip/ItemTooltip";
import dungeonz from "../../../../../shared/Global";

const canItemFit = (shopItem) => (
    (InventoryState.maxWeight - InventoryState.weight) > shopItem.totalWeight
);

const canAfford = (price) => (PlayerState.glory >= price);

function BuyOptions({
    shopItem, price, onCursorLeave, panelBounds,
}) {
    console.log("buyopts:", shopItem);

    const buyPressed = () => {
        ApplicationState.connection.sendEvent("shop_buy_item", {
            merchantId: GUIState.shop.merchantId,
            row: dungeonz.gameScene.dynamics[GUIState.shop.merchantId].row,
            col: dungeonz.gameScene.dynamics[GUIState.shop.merchantId].col,
            index: shopItem.index,
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
                    {Utils.getTextDef(`Item name: ${ItemTypes[shopItem.typeCode].translationID}`)}
                </div>
                {shopItem.durability && <div className="detail">{`${shopItem.durability}/${shopItem.durability}`}</div>}
                {shopItem.quantity && <div className="detail">{`x${shopItem.quantity}`}</div>}
                <div className="detail">{`Weight: ${shopItem.totalWeight}`}</div>
                <div className="description">
                    {Utils.getTextDef(`Item description: ${ItemTypes[shopItem.typeCode].translationID}`)}
                </div>
            </div>
            <div className="buttons">
                <div className="price">
                    <img src={gloryIcon} />
                    <span className={`high-contrast-text ${canAfford(price) ? "" : "cannot-afford"}`}>{price}</span>
                </div>
                {!canAfford(price) && <div className="button cannot-afford">{Utils.getTextDef("Not enough glory")}</div>}
                {!canItemFit(shopItem) && <div className="button no-space">{Utils.getTextDef("Not enough free space")}</div>}
                {canAfford(price) && canItemFit(shopItem) && <div className="button buy" onClick={buyPressed}>{Utils.getTextDef("Buy")}</div>}
            </div>
        </div>
    );
}

BuyOptions.propTypes = {
    shopItem: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    onCursorLeave: PropTypes.func.isRequired,
    panelBounds: PropTypes.object.isRequired,
};

function ItemSlot({ shopItem, price, onClick }) {
    useEffect(() => {
        const subs = [
            // PubSub.subscribe(MODIFY_INVENTORY_ITEM, () => {
            //     setInHotbar(isItemInHotbar(shopItem));
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
              className={`details ${canAfford(price) ? "affordable" : ""}`}
              draggable={false}
              onMouseEnter={() => {
                  GUIState.setTooltipContent(
                      <ItemTooltip itemTypeCode={shopItem.typeCode} />,
                  );
              }}
              onMouseLeave={() => {
                  GUIState.setTooltipContent(null);
              }}
              onClick={() => { onClick(shopItem); }}
            >
                <div className="item-cont">
                    <div className="item">
                        <img
                          src={ItemIconsList[ItemTypes[shopItem.typeCode].iconSource]}
                          draggable={false}
                          className="icon"
                        />
                        <div
                          className={`high-contrast-text amount ${(shopItem.quantity > 999 || shopItem.durability > 999) ? "small" : ""}`}
                        >
                            {Utils.formatItemValue(shopItem.quantity) || Utils.formatItemValue(shopItem.durability) || "???"}
                        </div>
                    </div>
                </div>
                <div className="price">
                    <img src={gloryIcon} />
                    <div className="high-contrast-text">
                        <AnimatedNumber
                          value={price}
                          duration={dungeonz.gameConfig.NUMBER_ANIMATION_DURATION}
                          formatValue={dungeonz.gameConfig.ANIMATED_NUMBER_FORMAT}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

ItemSlot.propTypes = {
    shopItem: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

function ShopPanel({ onCloseCallback }) {
    const [items, setItems] = useState(GUIState.shop.shopType.stock || []);
    const [prices, setPrices] = useState(GUIState.shop.prices || []);
    const [searchItems, setSearchItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
    const [inventoryMaxWeight, setInventoryMaxWeight] = useState(InventoryState.maxWeight);
    const [glory, setGlory] = useState(PlayerState.glory);
    const [selectedItem, setSelectedItem] = useState(null);
    const panelRef = useRef();

    const onItemPressed = (item) => {
        setSelectedItem(item);
    };

    const getShopPrices = () => {
        console.log("getShopPrices");
        // Request the prices of items in this shop.
        ApplicationState.connection.sendEvent("get_shop_prices", {
            merchantId: GUIState.shop.merchantId,
            row: dungeonz.gameScene.dynamics[GUIState.shop.merchantId].row,
            col: dungeonz.gameScene.dynamics[GUIState.shop.merchantId].col,
        });
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
        getShopPrices();

        const getPricesLoop = setInterval(getShopPrices, 5000);

        const subs = [
            PubSub.subscribe(GLORY_VALUE, () => {
                setGlory(PlayerState.glory);
            }),
            PubSub.subscribe(MODIFY_INVENTORY_WEIGHT, (msg, data) => {
                setInventoryWeight(data.new);
            }),
            PubSub.subscribe(SHOP, (msg, data) => {
                console.log("shop changed:", data);

                // Load the stock for this shop type.
                setItems(data.shopType.stock);
            }),
            PubSub.subscribe(STOCK_PRICES, (msg, data) => {
                console.log("stock prices changed:", data);

                setPrices(data);
            }),
        ];

        return () => {
            clearInterval(getPricesLoop);

            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <div className="shop-panel centered panel-template-cont gui-zoomable" ref={panelRef}>
            <PanelTemplate
              width="50vw"
              height="80vh"
              panelName={GUIState.shop.name}
              icon={shopIcon}
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
                              shopItem={item}
                              price={prices[item.index] || 0}
                              onClick={onItemPressed}
                            />
                        ))}
                        {searchText && !searchItems.length && <div className="warning">{Utils.getTextDef("No items found")}</div>}
                        {!searchText && items.map((item) => (
                            <ItemSlot
                              key={item.id}
                              shopItem={item}
                              price={prices[item.index] || 0}
                              onClick={onItemPressed}
                            />
                        ))}
                        {!searchText && !items.length && <div className="warning">{Utils.getTextDef("Empty shop")}</div>}
                    </div>
                </div>
            </PanelTemplate>
            {selectedItem && (
                <BuyOptions
                  shopItem={selectedItem}
                  price={prices[selectedItem.index] || 0}
                  onCursorLeave={() => {
                      setSelectedItem(null);
                  }}
                  panelBounds={panelRef.current.getBoundingClientRect()}
                />
            )}
        </div>
    );
}

ShopPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default ShopPanel;
