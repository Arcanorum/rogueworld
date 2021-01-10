import Application from "./Application";
import Player from "./Player";
import Inventory from "./Inventory";

export const ApplicationState = new Application();
export const PlayerState = new Player();
export const InventoryState = new Inventory();

export default {
    ApplicationState,
    PlayerState,
    InventoryState,
};
