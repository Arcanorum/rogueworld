import { Settings } from '@dungeonz/configs';
import ChatScopes from '@dungeonz/types/src/ChatScopes';
import { message, warning } from '@dungeonz/utils';
import Commands from '../commands/Commands';
import { webSocketServer as wss } from '../Server';
import EventResponses from './EventResponses';

EventResponses.chat = (clientSocket, data: {scope: ChatScopes; content: string}) => {
    // Can't use ChatState here 'cause it's located outside module.
    const { CHAT_SCOPES } = Settings;

    if (!data || !data.scope || !data.content) return;
    if (data.content.length > 255) return;
    if (clientSocket.inGame === false) return;

    const { content, scope } = data;
    const { entity } = clientSocket;

    if(!entity) return;

    // Ignore this event if they are dead.
    if (entity.hitPoints <= 0) return;

    const { cooldown } = CHAT_SCOPES[scope];

    // If no cooldown is found it means the client is passing some strange values.
    if (cooldown === undefined) return;

    const nextMessageTime = Date.now();
    const dataToBroadCast = {
        id: entity.id,
        displayName: entity.displayName,
        scope,
        content,
        nextAvailableDate: nextMessageTime + cooldown,
    };

    // Send global chats.
    if (data.scope !== CHAT_SCOPES.LOCAL.value) {
        if (clientSocket.nextMessageTimes[data.scope] > Date.now()) {
            // Message too soon, ignore it.
            return;
        }

        wss.broadcastToInGame(
            'chat',
            dataToBroadCast,
        );

        if (cooldown === 0) return;

        // Track the time they will be able to send a message in this scope again.
        clientSocket.nextMessageTimes[data.scope] = nextMessageTime;

        return;
    }

    // Send local chats.
    entity.board?.emitToNearbyPlayers(
        entity.row,
        entity.col,
        'chat',
        dataToBroadCast,
    );

    // Handle chat commands when in development mode (or a test environment).
    if (Settings.DEV_MODE) {
        try {
            // All chat commands start with a forward slash.
            if (content[0] === '/') {
                message('Running chat command:', content);
                // Separate the command (first word) from the arguments (everything after).
                const parts = content.split(' ');
                const commandName = parts.shift()?.substring(1);
                if(!commandName) return;

                let response;
                // Check the command is valid.
                if (Commands[commandName]) {
                    response = Commands[commandName].run(entity, ...parts);
                }
                else {
                    // Send invalid command warning.
                    response = 'Invalid command. Use /help for more info.';
                }

                if (response) {
                    entity.board?.emitToNearbyPlayers(
                        entity.row,
                        entity.col,
                        'chat',
                        {
                            ...dataToBroadCast,
                            content: response,
                            discreet: true,
                        },
                    );
                }
            }
        }
        catch (error) {
            warning('Error during chat command:', error);
        }
    }
};
