import mongoose from 'mongoose';
import { error, message, warning } from '@rogueworld/utils';
import { Settings } from '@rogueworld/configs';
import { AccountModel } from './account';

export * from './account';
export * from './entity';

export function isDBConnected() {
    return mongoose.connection.readyState === mongoose.STATES.connected;
}

export async function connect() {
    try {
        await mongoose.connect('mongodb://localhost/rogueworldDB', {
            serverSelectionTimeoutMS: 2000,
        });

        message('Connected to database.');

        try {
            // Log out all of the accounts, in case they were logged in the last time the server shut down,
            // otherwise some players will not be able to log in as their accounts are already logged in.
            await AccountModel.updateMany({}, { isLoggedIn: false });
        }
        catch (err) {
            error('Error while logging out all player accounts:', err);
        }

        mongoose.connection.on('error', (err) => {
            // DB connection issue after connection established.
            error('DB connection error:', err);
        });
    }
    catch (err) {
        // Allow starting the server without a DB connection in dev mode.
        if (Settings.DEV_MODE) {
            warning('Cannot connect to database. Starting without persistent features. Account creation/saving will not work!');
        }
        else {
            // In prod mode. Fail here to figure out what is wrong with the DB connection.
            error('Cannot connect to database:', err);
        }
    }
}
