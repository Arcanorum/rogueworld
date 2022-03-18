import PlayerWebSocket from './PlayerWebSocket';

const EventResponses: { [key: string]: (clientSocket: PlayerWebSocket, data?: any) => void } = {};

export default EventResponses;
