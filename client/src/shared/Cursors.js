import dungeonz from "./Global";
import normalCursor from "../assets/images/gui/cursors/normal-cursor.png";
import handCursor from "../assets/images/gui/cursors/hand-cursor.png";
import attackCursor from "../assets/images/gui/cursors/attack-cursor.png";

export const setDefaultCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${normalCursor}), auto`;
};

export const setHandCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${handCursor}) 8 0, auto`;
};

export const setAttackCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${attackCursor}), auto`;
};
