import Application from "./Application";
import Bank from "./Bank";
import GUI from "./GUI";
import Inventory from "./Inventory";
import Player from "./Player";
import dungeonz from "../Global";

export const ApplicationState = new Application();
export const BankState = new Bank();
export const GUIState = new GUI();
export const InventoryState = new Inventory();
export const PlayerState = new Player();

export const resetStates = () => {
    ApplicationState.init();
    BankState.init();
    GUIState.init();
    InventoryState.init();
    PlayerState.init();
};

dungeonz.states = {
    ApplicationState,
    BankState,
    GUIState,
    InventoryState,
    PlayerState,
    resetStates,
};

export default dungeonz.states;
