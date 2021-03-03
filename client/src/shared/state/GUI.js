import PubSub from "pubsub-js";
import { CURSOR_MOVE, TOOLTIP_CONTENT, PANEL_CHANGE } from "../EventTypes";

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

    setTooltipContent(content) {
        this.tooltipContent = content;

        PubSub.publish(TOOLTIP_CONTENT, content);
    }
}

export default GUI;
