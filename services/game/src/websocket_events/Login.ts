import { isDisplayNameValid } from '.';
import { AccountManager } from '../account';
import { World } from '../space';
import EventResponses from './EventResponses';

/**
 * When a user tries to log in to an existing account.
 */
EventResponses.log_in = (clientSocket, data: {username: string; password: string}) => {
    // console.log("log in:", data);
    if (!data) return;
    if (!data.username) return;
    if (!data.password) return;
    // Don't check username length, so they can still log in even if the max username length
    // setting has been lowered since they made the account.

    AccountManager.logIn(clientSocket, data.username, data.password, (account) => {
        World.addExistingPlayer(clientSocket, account);
    });
};

/**
 * Create a new character to use, but that is NOT an account yet.
 */
EventResponses.new_char = (clientSocket, data: {displayName: string}) => {
    // console.log("new char:", data);
    if (!data) return;
    // Don't let them join a world if they are already in one.
    if (clientSocket.inGame === true) return;

    let displayName = 'Savage';

    if (isDisplayNameValid(data.displayName)) {
        displayName = data.displayName;
    }

    World.addNewPlayer(clientSocket, displayName);
};
