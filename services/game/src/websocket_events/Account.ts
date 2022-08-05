import { Settings } from '@rogueworld/configs';
import { message, warning } from '@rogueworld/utils';
import { isDisplayNameValid } from '.';
import { changePassword, createAccount } from '../database';
import EventResponses from './EventResponses';

EventResponses.create_account = (clientSocket, data: { username: string; password: string }) => {
    if (!data) return;
    if (!data.username) {
        clientSocket.sendEvent('create_account_failure', { messageId: 'No username' });
        return;
    }
    if (!data.password) {
        clientSocket.sendEvent('create_account_failure', { messageId: 'No password' });
        return;
    }
    // Limit the username length. Also limited on client, but check here too.
    // Don't check password length, as it will be encrypted and potentially very long.
    if (data.username.length > (Settings.MAX_ACCOUNT_USERNAME_LENGTH || 50)) {
        clientSocket.sendEvent('create_account_failure', { messageId: 'Username too long' });
        return;
    }

    if (!clientSocket.entity) {
        clientSocket.sendEvent('something_went_wrong');
        return;
    }

    createAccount(
        data.username,
        data.password,
        clientSocket.entity,
        () => {
            message('Create account success:', data.username);
            clientSocket.sendEvent('create_account_success');
        },
        (err) => {
            if (err) {
                // An index with this key (the username) already exists. Must be unique.
                if (`${err.code}` === '11000') {
                    // Username already taken.
                    clientSocket.sendEvent('create_account_failure', { messageId: 'Username taken' });
                }
                else {
                    warning('Create account, DB error:', err);
                    clientSocket.sendEvent('create_account_failure', { messageId: 'Database error' });
                }
            }
        },
    );
};

EventResponses.change_password = (clientSocket, data) => {
    if (!data) return;
    if (!data.currentPassword) return;
    if (!data.newPassword) return;

    changePassword(clientSocket, data.currentPassword, data.newPassword);
};

EventResponses.change_display_name = (clientSocket, data) => {
    if (!data) return;
    if (clientSocket.inGame === false) return;

    // Prevent invlaid names.
    if (!isDisplayNameValid(data)) return;

    if (!clientSocket.entity) return;

    // Check they have enough glory.
    if (clientSocket.entity.glory < (Settings.DISPLAY_NAME_CHANGE_COST || 1000)) return;

    clientSocket.entity.modGlory(-(Settings.DISPLAY_NAME_CHANGE_COST || 1000));

    clientSocket.entity.setDisplayName(data);
};
