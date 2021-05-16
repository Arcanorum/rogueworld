import dungeonz from "./Global";
import normalCursor from "../assets/images/gui/cursors/normal-cursor.png";
import handCursor from "../assets/images/gui/cursors/hand-cursor.png";
import attackCursor from "../assets/images/gui/cursors/attack-cursor.png";
import hatchetCursor from "../assets/images/gui/cursors/hatchet-cursor.png";
import pickaxeCursor from "../assets/images/gui/cursors/pickaxe-cursor.png";
import sickleCursor from "../assets/images/gui/cursors/sickle-cursor.png";

export const setDefaultCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${normalCursor}), auto`;
};

export const setHandCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${handCursor}) 8 0, auto`;
};

export const setAttackCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${attackCursor}), auto`;
};

export const setHatchetCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${hatchetCursor}), auto`;
};

export const setPickaxeCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${pickaxeCursor}), auto`;
};

export const setSickleCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = `url(${sickleCursor}), auto`;
};
