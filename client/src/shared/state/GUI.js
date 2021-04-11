import PubSub from "pubsub-js";
import {
    CURSOR_MOVE, TOOLTIP_CONTENT, CRAFTING_STATION, SHOP, STOCK_PRICES, PANEL_CHANGE,
} from "../EventTypes";

class GUI {
    constructor() {
        this.init();

        document.onmousemove = (event) => {
            this.setCursorX(event.clientX);
            this.setCursorY(event.clientY);

            PubSub.publish(CURSOR_MOVE, {
                new: {
                    cursorX: this.cursorX,
                    cursorY: this.cursorY,
                },
            });
        };
    }

    init() {
        this.cursorX = 0;

        this.cursorY = 0;

        this.cursorInLeftSide = false;

        this.cursorInTopSide = false;

        this.chatInputStatus = false;

        this.tooltipContent = null;

        this.activePanel = null;

        this.craftingStation = null;

        this.shop = null;

        /**
         * The current percent zoom level for all elements with the 'gui-scalable' style class.
         * @type {Number}
         */
        this.guiScale = 100;

        /**
         * The volume of the music. 0 is no music, 100 is full volume. Can't use floats due to imperfect decimal precision.
         * @todo find somewhere else for this, doesn't really belong with this GUI stuff
         * @type {Number}
         */
        this.musicVolume = 50;

        /**
         * The volume of the sound effects. 0 is no effects, 100 is full volume. Can't use floats due to imperfect decimal precision.
         * @todo find somewhere else for this, doesn't really belong with this GUI stuff
         * @type {Number}
         */
        this.effectsVolume = 50;

        /**
         * Whether the FPS counter should be shown.
         * @type {Boolean}
         */
        this.showFPS = false;

        /**
         * Whether tiles on the darkness layer of the tilemap should flicker when affected by a light source.
         * @type {Boolean}
         */
        this.lightFlickerEnabled = true;

        /**
         * Whether the virtual D-pad is enabled.
         * @type {Boolean}
         */
        this.virtualDPadEnabled = false;
    }

    setCursorX(value) {
        this.cursorX = value;
        if (this.cursorX < (window.innerWidth / 2)) {
            this.cursorInLeftSide = true;
        }
        else {
            this.cursorInLeftSide = false;
        }
    }

    setCursorY(value) {
        this.cursorY = value;
        if (this.cursorY < (window.innerHeight / 2)) {
            this.cursorInTopSide = true;
        }
        else {
            this.cursorInTopSide = false;
        }
    }

    setChatInputStatus(value) {
        this.chatInputStatus = value;
    }

    setActivePanel(value) {
        this.activePanel = value;

        PubSub.publish(PANEL_CHANGE, { new: value });
    }

    setCraftingStation(typeNumber, name, icon) {
        this.craftingStation = {
            typeNumber,
            name,
            icon,
        };

        PubSub.publish(CRAFTING_STATION, this.craftingStation);
    }

    setShop(merchantId, name, shopType) {
        this.shop = {
            // The merchant entity that this player is trading with, to send when buying something so the server knows who to buy from.
            merchantId,
            name,
            shopType,
        };

        PubSub.publish(SHOP, this.shop);
    }

    setStockPrices(value) {
        this.shop.prices = value;

        PubSub.publish(STOCK_PRICES, this.shop.prices);
    }

    setTooltipContent(content) {
        this.tooltipContent = content;

        PubSub.publish(TOOLTIP_CONTENT, content);
    }
}

export default GUI;
