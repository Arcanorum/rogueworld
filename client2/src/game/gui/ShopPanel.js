import ItemTypes from "../../catalogues/ItemTypes";
import PanelTemplate from "./PanelTemplate";

class StockSlot {
    constructor(panel, slotNumber) {
        this.container = document.createElement("div");
        this.container.className = "shop_item_cont";

        this.itemIcon = document.createElement("img");
        this.itemIcon.className = "shop_item";
        this.itemIcon.src = "assets/img/gui/items/icon-iron-hatchet.png";

        this.priceContainer = document.createElement("div");
        this.priceContainer.className = "shop_price_cont";

        this.gloryIcon = document.createElement("img");
        this.gloryIcon.className = "shop_glory_icon";
        this.gloryIcon.src = "assets/img/gui/hud/glory-icon.png";

        this.price = document.createElement("p");
        this.price.className = "shop_price";

        this.priceContainer.appendChild(this.gloryIcon);
        this.priceContainer.appendChild(this.price);

        this.container.onclick = panel.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover = panel.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout = panel.slotMouseOut;
        // Drag and drop.
        // this.container.ondragstart =    panel.slotDragStart;
        // this.container.ondragenter =    panel.slotDragEnter;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute("slotIndex", slotNumber);

        this.container.appendChild(this.itemIcon);
        this.container.appendChild(this.priceContainer);

        panel.shopContents.appendChild(this.container);

        // The item name for when it is hovered over.
        this.itemName = "";
    }
}

class ShopPanel extends PanelTemplate {
    constructor() {
        super(document.getElementById("shop_panel"), 440, 384, "Shop", "gui/panels/shop-icon");

        this.shopContents = document.createElement("div");
        this.shopContents.id = "shop_contents";
        this.contentsContainer.appendChild(this.shopContents);

        const bottomContainer = document.createElement("div");
        bottomContainer.id = "shop_bottom_cont";
        this.contentsContainer.appendChild(bottomContainer);

        // Add a container for the 'Buy' text and the image button.
        const buyButtonContainer = document.createElement("div");
        buyButtonContainer.className = "centered shop_buy_button_cont";
        buyButtonContainer.onclick = this.buyPressed;
        bottomContainer.appendChild(buyButtonContainer);

        this.buyButton = document.createElement("img");
        this.buyButton.className = "centered shop_buy_button";
        this.buyButton.src = "assets/img/gui/panels/buy-button-border-valid.png";
        this.buyButton.draggable = false;
        buyButtonContainer.appendChild(this.buyButton);

        const buyText = document.createElement("div");
        buyText.innerText = window.dungeonz.getTextDef("Buy");
        buyText.className = "centered shop_buy_text";
        buyButtonContainer.appendChild(buyText);

        this.tooltip = document.createElement("div");
        this.tooltip.id = "shop_tooltip";
        this.topContainer.appendChild(this.tooltip);

        this.stockSlots = [];
        this.maxStock = 100;
        for (let i = 0; i < this.maxStock; i += 1) {
            this.stockSlots.push(new StockSlot(this, i));
        }

        // Keep the currently shown shop stock, so the item type numbers can be found to be sent when buying.
        this.shopStock = [];

        // The merchant entity that this player is trading with, to send when buying something so the server knowindow.ws.who to buy from.
        this.merchantID = null;

        // The currently selected slot.
        this.selectedSlot = null;

        // When the panel is open, periodically check the shown prices are correct.
        this.getPricesLoop = null;
    }

    show(merchantID, shopName, shopStock) {
        super.show();

        window.gameScene.GUI.isAnyPanelOpen = true;
        // Show the panel and change the shop name.
        // this.container.style.visibility = "visible";
        this.changeName(shopName);
        // this.name.innerText = shopName;

        // Request the prices of items in this shop.
        window.ws.sendEvent("get_shop_prices", {
            merchantID,
            row: window.gameScene.dynamics[merchantID].row,
            col: window.gameScene.dynamics[merchantID].col,
        });

        this.getPricesLoop = setInterval(() => {
            window.ws.sendEvent("get_shop_prices", {
                merchantID,
                row: window.gameScene.dynamics[merchantID].row,
                col: window.gameScene.dynamics[merchantID].col,
            });
        }, 5000);

        for (let i = 0; i < shopStock.length; i += 1) {
            this.stockSlots[i].itemIcon.src = `assets/img/gui/items/${
                ItemTypes[shopStock[i]].iconSource}.png`;

            // And the item name for when it is hovered over.
            this.stockSlots[i].itemName = window.dungeonz.getTextDef(
                `Item name: ${ItemTypes[shopStock[i]].translationID}`,
            );

            this.stockSlots[i].container.style.display = "block";
        }

        this.shopStock = shopStock;
        this.merchantID = merchantID;
    }

    hide() {
        // Hide the panel.
        super.hide();

        window.gameScene.GUI.isAnyPanelOpen = false;

        // Hide all of the stock items, so they don't show in the next shop visited.
        for (let i = 0; i < this.maxStock; i += 1) {
            this.stockSlots[i].container.style.display = "none";
            this.stockSlots[i].itemName = "";
        }

        // If a slot is selected, deselect it.
        if (this.selectedSlot !== null) {
            this.selectedSlot.container.style.backgroundColor = window.gameScene.GUI.GUIColours.white80Percent;
            this.selectedSlot = null;
        }

        // Reset the buy button.
        this.buyButton.src = "assets/img/gui/panels/buy-button-border-invalid.png";

        clearInterval(this.getPricesLoop);
    }

    buyPressed() {
        const { shopPanel } = window.gameScene.GUI;

        // Check a slot is actually selected.
        if (shopPanel.selectedSlot === null) return;

        // Get the selected slot index.
        const slotIndex = shopPanel.selectedSlot.container.getAttribute("slotIndex");

        window.ws.sendEvent("shop_buy_item", {
            merchantID: shopPanel.merchantID,
            row: window.gameScene.dynamics[shopPanel.merchantID].row,
            col: window.gameScene.dynamics[shopPanel.merchantID].col,
            index: slotIndex,
            itemTypeNumber: shopPanel.shopStock[slotIndex],
            price: shopPanel.selectedSlot.price.innerText,
        });
    }

    updatePrices(prices) {
        for (let i = 0; i < this.maxStock; i += 1) {
            this.stockSlots[i].price.innerText = prices[i];
        }
    }

    slotClick() {
        const { shopPanel } = window.gameScene.GUI;
        // If nothing is selected, select this slot.
        if (shopPanel.selectedSlot === null) {
            /** @type {StockSlot} */
            const slot = shopPanel.stockSlots[this.getAttribute("slotIndex")];
            shopPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = window.gameScene.GUI.GUIColours.shopSelected;

            // If the player has enough glory for that item, make the buy button green.
            if (slot.price.innerText
                > window.gameScene.player.glory) {
                shopPanel.buyButton.src = "assets/img/gui/panels/buy-button-border-invalid.png";
            }
            else {
                shopPanel.buyButton.src = "assets/img/gui/panels/buy-button-border-valid.png";
            }
        }
        // The selected slot was selected again, deselect it.
        else if (shopPanel.selectedSlot.container === this) {
            shopPanel.selectedSlot.container.style.backgroundColor = window.gameScene.GUI.GUIColours.white80Percent;
            shopPanel.selectedSlot = null;

            shopPanel.buyButton.src = "assets/img/gui/panels/buy-button-border-invalid.png";
        }
        // A slot is already selected, deselect it and select this one.
        else {
            shopPanel.selectedSlot.container.style.backgroundColor = window.gameScene.GUI.GUIColours.white80Percent;
            const slot = shopPanel.stockSlots[this.getAttribute("slotIndex")];
            shopPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = window.gameScene.GUI.GUIColours.shopSelected;
            // If the player has enough glory for that item, make the buy button green.
            if (slot.price.innerText
                > window.gameScene.player.glory) {
                shopPanel.buyButton.src = "assets/img/gui/panels/buy-button-border-invalid.png";
            }
            else {
                shopPanel.buyButton.src = "assets/img/gui/panels/buy-button-border-valid.png";
            }
        }
    }

    slotMouseOver() {
        const { shopPanel } = window.gameScene.GUI;
        /** @type {StockSlot} */
        const slot = shopPanel.stockSlots[this.getAttribute("slotIndex")];
        // If the slot is empty, don't show the tooltip.
        if (slot.itemName === null) return;
        shopPanel.tooltip.innerText = slot.itemName;
        shopPanel.tooltip.style.visibility = "visible";

        slot.container.appendChild(shopPanel.tooltip);

        // Get the col of the selected slot.
        // If the slot is in the first or second (left half) of shop contents grid, then show the tooltip on the right of the item.
        if ((this.getAttribute("slotIndex") % 4)
            > 1) {
            shopPanel.tooltip.className = "shop_tooltip_right";
        }// Otherwise, show it to the left of the item.
        else {
            shopPanel.tooltip.className = "shop_tooltip_left";
        }
    }

    slotMouseOut() {
        window.gameScene.GUI.shopPanel.tooltip.style.visibility = "hidden";
    }
}

export default ShopPanel;
