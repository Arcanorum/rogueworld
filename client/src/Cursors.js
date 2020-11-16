let previosCursor;

export const setDefaultCursor = () => {
    previosCursor = _this.sys.canvas.style.cursor;
    _this.sys.canvas.style.cursor = "url(./assets/img/gui/hud/normal-cursor.png), auto";
};

export const setHandCursor = () => {
    previosCursor = _this.sys.canvas.style.cursor;
    _this.sys.canvas.style.cursor = "url(./assets/img/gui/hud/hand-cursor.png) 8 0, auto";
};

export const setAttackCursor = () => {
    previosCursor = _this.sys.canvas.style.cursor;
    _this.sys.canvas.style.cursor = "url(./assets/img/gui/hud/attack-cursor.png), auto";
};

export const setPreviousCursor = () => {
    _this.sys.canvas.style.cursor = previosCursor;
};