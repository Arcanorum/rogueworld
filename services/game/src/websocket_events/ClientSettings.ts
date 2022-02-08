import { Settings } from '@dungeonz/configs';

/**
 * Any settings that a game client needs, to be sent as soon as it connects to the server.
 */
const ClientSettings = {
    maxDisplayNameLength: Settings.MAX_CHARACTER_DISPLAY_NAME_LENGTH,
    maxUsernameLength: Settings.MAX_ACCOUNT_USERNAME_LENGTH,
    displayNameChangeCost: Settings.DISPLAY_NAME_CHANGE_COST,
};

export default ClientSettings;
