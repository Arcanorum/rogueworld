import { DayPhases } from '@rogueworld/types';
import PubSub from 'pubsub-js';
import { GameWebSocket } from '../../network/ConnectionManager';
import {
    CONNECTING, CONNECTED, JOINING, JOINED, LOADING, LOAD_ACCEPTED, WEBSOCKET_CLOSE, LOGGED_IN,
} from '../EventTypes';
import ItemState from '../ItemState';
import { DynamicEntityData } from '../types';

interface MissedWebsocketEvent {
    eventName: string;
    data?: number | string | object | Array<ItemState>;
}

export interface JoinWorldData {
    boardName: string;
    boardAlwaysNight: boolean;
    accountId: string;
    player: {
        id: string;
        row: number;
        col: number;
        displayName: string;
        hitPoints: number;
        maxHitPoints: number;
        food: number;
        maxFood: number;
        glory: number;
        defence: number;
        moveRate: number;
    };
    inventory: {
        items: Array<ItemState>;
        weight: number;
        maxWeight: number;
    };
    bank: {
        items: Array<ItemState>;
        weight: number;
        maxWeight: number;
        maxWeightUpgradeCost: number;
        additionalMaxBankWeightPerUpgrade: number;
    };
    dynamicsData: Array<DynamicEntityData>;
    dayPhase: DayPhases;
}

class Application {
    connection!: GameWebSocket | null;
    connecting!: boolean;
    connected!: boolean;
    joining!: boolean;
    joined!: boolean;
    joinWorldData!: JoinWorldData | null;
    loading!: boolean;
    loadAccepted!: boolean;
    loggedIn!: boolean;
    gameServiceHTTPServerURL!: string;
    gameServiceWebSocketServerURL!: string;
    mapServiceHTTPServerURL!: string;
    missedWebsocketEvents!: Array<MissedWebsocketEvent>;

    constructor() {
        this.init();

        PubSub.subscribe(WEBSOCKET_CLOSE, () => {
            this.setConnected(false);
            this.setConnecting(false);
            this.setJoined(false);
        });
    }

    init() {
        this.connection = null;

        this.connecting = false;

        this.connected = false;

        this.joining = false;

        this.joined = false;

        this.joinWorldData = null;

        this.loading = false;

        this.loadAccepted = true;

        this.loggedIn = false;

        this.gameServiceHTTPServerURL = '';

        this.gameServiceWebSocketServerURL = '';

        this.mapServiceHTTPServerURL = '';

        this.missedWebsocketEvents = [];
    }

    setConnecting(value: boolean) {
        const old = this.connecting;
        this.connecting = value;
        PubSub.publish(CONNECTING, { old, new: this.connecting });
    }

    setConnected(value: boolean) {
        const old = this.connected;
        this.connected = value;
        PubSub.publish(CONNECTED, { old, new: this.connected });

        if (value) {
            this.setConnecting(false);
        }
        else {
            this.setLoading(false);
            this.setLoadAccepted(true);
        }
    }

    setJoining(value: boolean) {
        const old = this.joining;
        this.joining = value;
        PubSub.publish(JOINING, { old, new: this.joining });
    }

    setJoined(value: boolean) {
        const old = this.joined;
        this.joined = value;
        PubSub.publish(JOINED, { old, new: this.joined });

        if (value) {
            this.setJoining(false);
        }
    }

    setLoading(value: boolean) {
        const old = this.loading;
        this.loading = value;
        PubSub.publish(LOADING, { old, new: this.loading });

        // When loading again, make sure the loading page gets shown.
        if (value) {
            this.setLoadAccepted(false);
        }
    }

    setLoadAccepted(value: boolean) {
        const old = this.loadAccepted;
        this.loadAccepted = value;
        PubSub.publish(LOAD_ACCEPTED, { old, new: this.loadAccepted });
    }

    setLoggedIn(value: boolean) {
        const old = this.loggedIn;
        this.loggedIn = value || false;
        PubSub.publish(LOGGED_IN, { old, new: this.loggedIn });
    }

    addMissedWebsocketEvent(event: MissedWebsocketEvent) {
        this.missedWebsocketEvents.push(event);
    }
}

export default Application;
