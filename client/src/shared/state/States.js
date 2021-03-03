import Application from "./Application";
import Player from "./Player";
import Inventory from "./Inventory";
import GUI from "./GUI";
import dungeonz from "../Global";

export const ApplicationState = new Application();
export const PlayerState = new Player();
export const InventoryState = new Inventory();
export const GUIState = new GUI();

export const resetStates = () => {
    ApplicationState.init();
    PlayerState.init();
    InventoryState.init();
    GUIState.init();
};

dungeonz.states = {
    ApplicationState,
    PlayerState,
    InventoryState,
    GUIState,
    resetStates,
};

export default dungeonz.states;
