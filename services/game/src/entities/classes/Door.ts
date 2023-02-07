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

        const tileEntities = Object.values(boardTile.entities);

        // Check there are no other entities on this tile.
        if (tileEntities.length === 1) {
            this.isBlocking = true;
            // Tell any nearby players that this entity is now active.
            this.board?.emitToNearbyPlayers(this.row, this.col, 'active_state', this.id);
        }
        // If the other entity is just a piece of flooring, ignore it and close anyway.
        else if (tileEntities.length === 2) {
            const otherEntity = tileEntities[0] === this ? tileEntities[1] : tileEntities[0];
            if ((otherEntity.constructor as typeof Entity).isFlooring) {
                this.isBlocking = true;
                // Tell any nearby players that this entity is now active.
                this.board?.emitToNearbyPlayers(this.row, this.col, 'active_state', this.id);
            }
            // Not flooring.
            else {
                // Try to close again later.
                this.startCloseTimeout();
            }
        }
        // Too much stuff in the way.
        else {
            // Try to close again later.
            this.startCloseTimeout();
        }
    }

    startCloseTimeout() {
        this.closeTimeout = setTimeout(this.close.bind(this), closeRate);
    }
}

export default Door;
