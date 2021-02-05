class GUI {
    cursorX = 0;

    cursorY = 0;

    cursorInLeftSide = false;

    cursorInTopSide = false;

    chatInputStatus = false;

    constructor() {
        document.onmousemove = (event) => {
            this.setCursorX(event.clientX);
            this.cursorY = event.clientY;
        };
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

    getChatInputStatus() {
        return this.chatInputStatus;
    }
}

export default GUI;
