// import { useEffect, useRef, useState } from 'react';
// import PubSub from 'pubsub-js';
// import AnimatedNumber from 'animated-number-react';
// import PanelTemplate from '../panel_template/PanelTemplate';
// import shopIcon from '../../../../../assets/images/gui/panels/shop/shop-icon.png';
// import weightIcon from '../../../../../assets/images/gui/hud/weight-icon.png';
// import gloryIcon from '../../../../../assets/images/gui/hud/glory-icon.png';
// import styles from './ShopPanel.module.scss';
// import {
//     InventoryState, GUIState, ApplicationState, PlayerState,
// } from '../../../../../shared/state';
// import {
//     MODIFY_INVENTORY_WEIGHT,
//     SHOP,
//     STOCK_PRICES,
// } from '../../../../../shared/EventTypes';
// import ItemIconsList from '../../../../../shared/ItemIconsList';
// import ItemTooltip from '../../item_tooltip/ItemTooltip';
// import Global from '../../../../../shared/Global';
// import getTextDef from '../../../../../shared/GetTextDef';
// import { formatItemValue } from '@rogueworld/utils';
// import Config from '../../../../../shared/Config';
// import { ShopItemState } from '../../../../../shared/types';

// const canItemFit = (shopItem: ShopItemState) => (
//     (InventoryState.maxWeight - InventoryState.weight) >= shopItem.totalWeight
// );

// const canAfford = (price: number) => (PlayerState.glory >= price);

// function BuyOptions({
//     shopItem,
//     price,
//     onCursorLeave,
//     panelBounds,
// }: {
//     shopItem: ShopItemState;
//     price: number;
//     onCursorLeave: () => void;
//     panelBounds: DOMRect;
// }) {
//     const buyPressed = () => {
//         if(GUIState.shop) {
//             ApplicationState.connection?.sendEvent('shop_buy_item', {
//                 merchantId: GUIState.shop.merchantId,
//                 row: Global.gameScene.dynamics[GUIState.shop.merchantId].row,
//                 col: Global.gameScene.dynamics[GUIState.shop.merchantId].col,
//                 index: shopItem.index,
//             });
//         }

//         onCursorLeave();
//     };

//     return (
//         <div
//             className="item-options"
//             style={{
//                 top: GUIState.cursorY - panelBounds.y,
//                 left: GUIState.cursorX - panelBounds.x,
//             }}
//             onMouseLeave={() => onCursorLeave()}
//         >
//             <div className={`info ${GUIState.cursorInTopSide ? 'top' : 'bottom'} ${GUIState.cursorInLeftSide ? 'left' : 'right'}`}>
//                 <div className="name">
//                     {getTextDef(`Item name: ${Config.ItemTypes[shopItem.typeCode].translationId}`)}
//                 </div>
//                 {shopItem.quantity && <div className="detail">{`x${shopItem.quantity}`}</div>}
//                 <div className={`detail ${canItemFit(shopItem) ? '' : 'no-space'}`}>{`${getTextDef('Weight')}: ${shopItem.totalWeight}`}</div>
//                 <div className="description">
//                     {getTextDef(`Item description: ${Config.ItemTypes[shopItem.typeCode].translationId}`)}
//                 </div>
//             </div>
//             <div className="buttons">
//                 <div className="price">
//                     <img src={gloryIcon.src} draggable={false} />
//                     <span className={`high-contrast-text ${canAfford(price) ? '' : 'cannot-afford'}`}>{price}</span>
//                 </div>
//                 {!canAfford(price) && <div className="button cannot-afford">{getTextDef('Not enough glory')}</div>}
//                 {!canItemFit(shopItem) && <div className="button no-space">{getTextDef('Not enough free space')}</div>}
//                 {canAfford(price) && canItemFit(shopItem) && <div className="button buy hand-cursor" onClick={buyPressed}>{getTextDef('Buy')}</div>}
//             </div>
//         </div>
//     );
// }

// function ItemSlot({
//     shopItem,
//     price,
//     onClick,
// }: {
//     shopItem: ShopItemState;
//     price: number;
//     onClick: (shopItem: ShopItemState) => void;
// }) {
//     const [canFitThis, setCanFitThis] = useState(canItemFit(shopItem));

//     useEffect(() => {
//         const subs = [
//             PubSub.subscribe(MODIFY_INVENTORY_WEIGHT, () => {
//                 setCanFitThis(canItemFit(shopItem));
//             }),
//         ];

//         return () => {
//             subs.forEach((sub) => {
//                 PubSub.unsubscribe(sub);
//             });
//         };
//     }, []);

//     return (
//         <div className="item-slot hand-cursor">
//             <div
//                 className={`details ${(canAfford(price) && canFitThis) ? '' : 'cannot-buy'}`}
//                 draggable={false}
//                 onMouseEnter={() => {
//                     GUIState.setTooltipContent(
//                         <ItemTooltip itemTypeCode={shopItem.typeCode} />,
//                     );
//                     Global.gameScene.soundManager.effects.playGUITick();
//                 }}
//                 onMouseLeave={() => {
//                     GUIState.setTooltipContent(null);
//                 }}
//                 onClick={() => {
//                     onClick(shopItem);
//                 }}
//             >
//                 <div className="item-cont">
//                     <div className="item">
//                         <img
//                             src={ItemIconsList[Config.ItemTypes[shopItem.typeCode].iconSource]}
//                             draggable={false}
//                             className="icon"
//                         />
//                         <div
//                             className={`high-contrast-text amount ${(shopItem.quantity > 999) ? 'small' : ''}`}
//                         >
//                             {formatItemValue(shopItem.quantity) || '???'}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="price">
//                     <img src={gloryIcon.src} draggable={false} />
//                     <div className={`high-contrast-text ${canAfford(price) ? '' : 'cannot-afford'}`}>
//                         <AnimatedNumber
//                             value={price}
//                             duration={Config.NUMBER_ANIMATION_DURATION}
//                             formatValue={Config.ANIMATED_NUMBER_FORMAT}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function ShopPanel({ onCloseCallback }: { onCloseCallback: () => void }) {
//     const [items, setItems] = useState<Array<ShopItemState>>(
//         GUIState.shop?.shopType.stock || [],
//     );
//     const [prices, setPrices] = useState<Array<number>>(GUIState.shop?.prices || []);
//     const [searchItems, setSearchItems] = useState<Array<ShopItemState>>([]);
//     const [searchText, setSearchText] = useState('');
//     const [inventoryWeight, setInventoryWeight] = useState(InventoryState.weight);
//     const [inventoryMaxWeight] = useState(InventoryState.maxWeight);
//     const [selectedItem, setSelectedItem] = useState<ShopItemState | null>(null);
//     const panelRef = useRef<HTMLDivElement>(null);

//     const onItemPressed = (item: ShopItemState) => {
//         setSelectedItem(item);
//     };

//     const getShopPrices = () => {
//         if(GUIState.shop) {
//             // Request the prices of items in this shop.
//             ApplicationState.connection?.sendEvent('get_shop_prices', {
//                 merchantId: GUIState.shop.merchantId,
//                 row: Global.gameScene.dynamics[GUIState.shop.merchantId].row,
//                 col: Global.gameScene.dynamics[GUIState.shop.merchantId].col,
//             });
//         }
//     };

//     useEffect(() => {
//         const filteredItems = items.filter((item: ShopItemState) =>
//             getTextDef(`Item name: ${Config.ItemTypes[item.typeCode].translationId}`)
//                 .toLowerCase()
//                 .includes(searchText));

//         setSearchItems(filteredItems);

//         // Also hide the tooltip, as onMouseLeave doesn't get fired when an element is removed, so
//         // if the cursor is over one of the items and showing the tooltip when someone searches, if
//         // the item gets filtered out the tooltip for it will remain visible.
//         GUIState.setTooltipContent(null);
//     }, [searchText, items]);

//     useEffect(() => {
//         getShopPrices();

//         const getPricesLoop = setInterval(getShopPrices, 5000);

//         const subs = [
//             PubSub.subscribe(MODIFY_INVENTORY_WEIGHT, (msg, data) => {
//                 setInventoryWeight(data.new);
//             }),
//             PubSub.subscribe(SHOP, (msg, data) => {
//                 // Load the stock for this shop type.
//                 setItems(data.shopType.stock);
//             }),
//             PubSub.subscribe(STOCK_PRICES, (msg, data) => {
//                 setPrices(data);
//             }),
//         ];

//         return () => {
//             clearInterval(getPricesLoop);

//             subs.forEach((sub) => {
//                 PubSub.unsubscribe(sub);
//             });
//         };
//     }, []);

//     return (
//         <div className="shop-panel centered panel-template-cont" ref={panelRef}>
//             <PanelTemplate
//                 width="50vw"
//                 height="80vh"
//                 panelName={GUIState.shop?.name}
//                 icon={shopIcon.src}
//                 onCloseCallback={onCloseCallback}
//             >
//                 <div className="inner-cont">
//                     <div className="top-bar">
//                         <div
//                             className="weight"
//                             onMouseEnter={() => {
//                                 GUIState.setTooltipContent(getTextDef('Inventory weight'));
//                             }}
//                             onMouseLeave={() => {
//                                 GUIState.setTooltipContent(null);
//                             }}
//                         >
//                             <img
//                                 src={weightIcon.src}
//                                 width="32px"
//                                 height="32px"
//                             />
//                             <span className="high-contrast-text">
//                                 <AnimatedNumber
//                                     value={inventoryWeight}
//                                     duration={Config.NUMBER_ANIMATION_DURATION}
//                                     formatValue={Config.ANIMATED_NUMBER_FORMAT}
//                                 />
//                                 /
//                                 <AnimatedNumber
//                                     value={inventoryMaxWeight}
//                                     duration={Config.NUMBER_ANIMATION_DURATION}
//                                     formatValue={Config.ANIMATED_NUMBER_FORMAT}
//                                 />
//                             </span>
//                         </div>
//                         <div className="search">
//                             <input
//                                 placeholder={getTextDef('Item search')}
//                                 onChange={(event) => {
//                                     setSearchText(event.target.value.toLowerCase());
//                                 }}
//                                 autoFocus
//                             />
//                         </div>
//                     </div>
//                     <div className="list">
//                         {searchText && searchItems.map((item) => (
//                             <ItemSlot
//                                 key={item.id}
//                                 shopItem={item}
//                                 price={prices[item.index] || 0}
//                                 onClick={onItemPressed}
//                             />
//                         ))}
//                         {searchText && !searchItems.length && <div className="warning">{getTextDef('No items found')}</div>}
//                         {!searchText && items.map((item) => (
//                             <ItemSlot
//                                 key={item.id}
//                                 shopItem={item}
//                                 price={prices[item.index] || 0}
//                                 onClick={onItemPressed}
//                             />
//                         ))}
//                         {!searchText && !items.length && <div className="warning">{getTextDef('Empty shop')}</div>}
//                     </div>
//                 </div>
//             </PanelTemplate>
//             {selectedItem && (
//                 <BuyOptions
//                     shopItem={selectedItem}
//                     price={prices[selectedItem.index] || 0}
//                     onCursorLeave={() => {
//                         setSelectedItem(null);
//                     }}
//                     panelBounds={panelRef.current!.getBoundingClientRect()}
//                 />
//             )}
//         </div>
//     );
// }

function ShopPanel() { return; }

export default ShopPanel;
