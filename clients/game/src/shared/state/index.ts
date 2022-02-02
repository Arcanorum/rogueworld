import Application from './Application';
import Bank from './Bank';
import GUI from './GUI';
import Inventory from './Inventory';
import Player from './Player';
import Chat from './Chat';

export const ApplicationState = new Application();
export const BankState = new Bank();
export const GUIState = new GUI();
export const InventoryState = new Inventory();
export const PlayerState = new Player();
export const ChatState = new Chat();

export const resetStates = () => {
    ApplicationState.init();
    BankState.init();
    GUIState.init();
    InventoryState.init();
    PlayerState.init();
    ChatState.init();
};
