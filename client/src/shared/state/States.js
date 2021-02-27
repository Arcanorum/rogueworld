import Application from "./Application";
import Player from "./Player";
import Inventory from "./Inventory";
import GUI from "./GUI";
import dungeonz from "../Global";

export const ApplicationState = new Application();
export const PlayerState = new Player();
export const InventoryState = new Inventory();
export const GUIState = new GUI();

dungeonz.states = {
    ApplicationState,
    PlayerState,
    InventoryState,
    GUIState,
};

export default {
    ApplicationState,
    PlayerState,
    InventoryState,
    GUIState,
};
