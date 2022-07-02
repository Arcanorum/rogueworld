import { ObjectOfUnknown } from '@rogueworld/types';
import { Action } from '../../gameplay/actions';
import Dynamic from './Dynamic';
import Entity from './Entity';

const closeRate = 2000;

class Door extends Dynamic {
    static abstract = true;

    closeTimeout?: NodeJS.Timeout;

    getEmittableProperties(properties: ObjectOfUnknown) {
        properties.isBlocking = this.isBlocking;
        return super.getEmittableProperties(properties);
    }

    onMovedInto(otherEntity: Entity) {
        // Don't bother if they are already doing something.
        if (otherEntity.actionTimeout) return;

        // Start an action to open the door.
        const action: Action = { name: 'open-door', duration: 1000 };
        otherEntity.performAction(
            action,
            this,
            undefined,
            undefined,
            () => {
                this.open();
            },
        );
    }

    open() {
        this.isBlocking = false;

        // Start a timer to close the door.
        this.startCloseTimeout();

        // Tell any nearby players that this entity is now inactive.
        this.board?.emitToNearbyPlayers(this.row, this.col, 'inactive_state', this.id);
    }

    close() {
        const boardTile = this.getBoardTile();
        if (!boardTile) return;

        // Check there are no other entities on this tile.
        if (Object.keys(boardTile.entities).length === 1) {
            this.isBlocking = true;
            // Tell any nearby players that this entity is now active.
            this.board?.emitToNearbyPlayers(this.row, this.col, 'active_state', this.id);
        }
        // Something in the way, try to close again later.
        else {
            this.startCloseTimeout();
        }
    }

    startCloseTimeout() {
        this.closeTimeout = setTimeout(this.close.bind(this), closeRate);
    }
}

export default Door;
