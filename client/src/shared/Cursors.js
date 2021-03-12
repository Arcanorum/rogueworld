import dungeonz from "./Global";

export const setDefaultCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = "url(./assets/img/gui/hud/normal-cursor.png), auto";
};

export const setHandCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = "url(./assets/img/gui/hud/hand-cursor.png) 8 0, auto";
};

export const setAttackCursor = () => {
    dungeonz.gameScene.sys.canvas.style.cursor = "url(./assets/img/gui/hud/attack-cursor.png), auto";
};
