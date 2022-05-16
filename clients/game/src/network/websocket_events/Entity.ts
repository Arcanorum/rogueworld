import { tileDistanceBetween } from '@rogueworld/utils';
import Player from '../../game/entities/characters/Player';
import Pickup from '../../game/entities/pickups/Pickup';
import Config from '../../shared/Config';
import getTextDef from '../../shared/GetTextDef';
import Global from '../../shared/Global';
import { PlayerState } from '../../shared/state';
import { DynamicEntityData } from '../../shared/types';
import eventResponses from './EventResponses';

const tweenCompleteLeft = () => {
    Global.gameScene.tilemap.shiftMapLeft();
    Global.gameScene.playerTween = null;
};

const tweenCompleteRight = () => {
    Global.gameScene.tilemap.shiftMapRight();
    Global.gameScene.playerTween = null;
};

const tweenCompleteUp = () => {
    Global.gameScene.tilemap.shiftMapUp();
    Global.gameScene.playerTween = null;
};

const tweenCompleteDown = () => {
    Global.gameScene.tilemap.shiftMapDown();
    Global.gameScene.playerTween = null;
};

const Entity = () => {
    eventResponses.add_entity = (data: DynamicEntityData) => {
        // console.log("add entity event:", data);
        if (Global.gameScene.addEntity === undefined) return;
        Global.gameScene.addEntity(data);
    };

    eventResponses.remove_entity = (data: string) => {
        // console.log("remove entity event:", data);
        Global.gameScene.removeDynamic(data);
    };

    eventResponses.add_entities = (data: Array<DynamicEntityData>) => {
        // console.log("add entities event");
        for (let i = 0; i < data.length; i += 1) {
            Global.gameScene.addEntity(data[i]);
        }
    };

    eventResponses.moved = (data: {id: string; row: number; col: number; moveRate: number}) => {
        if (Global.gameScene.dynamics === undefined) {
            // Something went wrong... Reload the page.
            // location.reload();
            return;
        }

        // Get the dynamic that moved.
        const dynamic = Global.gameScene.dynamics[data.id];

        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const dynamicSpriteContainer = dynamic.spriteContainer;

        let direction = '';
        if (dynamic.col > data.col) {
            direction = 'l';
        }
        else if (dynamic.col < data.col) {
            direction = 'r';
        }

        // The client player moved.
        if (data.id === PlayerState.entityId) {
            const playerContainer: Player = dynamicSpriteContainer;

            const origRow = PlayerState.row;
            const origCol = PlayerState.col;

            // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
            if (Global.gameScene.playerTween !== null) {
                Global.gameScene.playerTween.stop();
            }

            // Do this AFTER stopping the current player tween, so it can finish with the
            // previous position (the one that matches the state the tween starts in).
            PlayerState.setRow(data.row);
            PlayerState.setCol(data.col);

            dynamic.row = data.row;
            dynamic.col = data.col;

            let tweenOnCompleteFunction: () => void;

            // Right.
            if (data.col > origCol) {
                tweenOnCompleteFunction = tweenCompleteRight;
            }
            // Left.
            else if (data.col < origCol) {
                tweenOnCompleteFunction = tweenCompleteLeft;
            }
            // Down.
            else if (data.row > origRow) {
                tweenOnCompleteFunction = tweenCompleteDown;
            }
            // Up.
            else if (data.row < origRow) {
                tweenOnCompleteFunction = tweenCompleteUp;
            }
            // No movement (somehow).
            else {
                tweenOnCompleteFunction = () => { return; };
            }

            Global.gameScene.checkDynamicsInViewRange();

            // Tween the player sprite to the target row/col.
            Global.gameScene.playerTween = Global.gameScene.tweens.add({
                targets: playerContainer,
                duration: data.moveRate || 100,
                x: data.col * Config.SCALED_TILE_SIZE,
                y: data.row * Config.SCALED_TILE_SIZE,
                onComplete: () => {
                    tweenOnCompleteFunction();

                    // Move sprites further down the screen above ones further up.
                    Global.gameScene.dynamicSpritesContainer.sort('y');
                },
                // Need to do stop callback too in case the tween hasn't finished
                // yet, as calling Tween.stop() then doesn't call onComplete.
                onStop: tweenOnCompleteFunction,
            });

            // Update the move rate on the client, so they can still send the move events at the right rate,
            Global.gameScene.moveRate = data.moveRate || 100;

            // Check for any interactables that are now in range to be interacted with.
            const { interactables } = Global.gameScene;

            // Don't need to go through the entire list, as there can be quite a lot in some areas
            // (i.e. forests), so just check the tiles within an area around the player.
            const maxInteractionRange = 4;
            const startRow = dynamic.row - maxInteractionRange;
            const startCol = dynamic.col - maxInteractionRange;
            const endRow = dynamic.row + maxInteractionRange;
            const endCol = dynamic.col + maxInteractionRange;
            const interactablesInRange = [];

            for (let targetRow = startRow; targetRow < endRow; targetRow += 1) {
                for (let targetCol = startCol; targetCol < endCol; targetCol += 1) {
                    if (interactables[`${targetRow}-${targetCol}`]) {
                        interactablesInRange.push(interactables[`${targetRow}-${targetCol}`]);
                    }
                }
            }

            // Show the pickup keybind if they are now standing on a pickup.
            const standingOnPickup = Object
                .values(Global.gameScene.dynamics)
                .some((eachDynamic) => (
                    (eachDynamic.spriteContainer instanceof Pickup)
                    && (tileDistanceBetween(eachDynamic, dynamic) === 0)
                ));

            if (standingOnPickup) {
                playerContainer.warningText?.setText(`${getTextDef('Pick up item')}\n( E )`);
                playerContainer.warningText?.setVisible(true);
            }
            else {
                playerContainer.warningText?.setVisible(false);
            }

            Global.gameScene.soundManager.effects.playFootstep();
        }
        // Another entity moved.
        else {
            // Get the boundaries of the player view range.
            const playerRowTopViewRange = PlayerState.row - Config.VIEW_RANGE;
            const playerColLeftViewRange = PlayerState.col - Config.VIEW_RANGE;
            const playerRowBotViewRange = PlayerState.row + Config.VIEW_RANGE;
            const playerColRightViewRange = PlayerState.col + Config.VIEW_RANGE;

            dynamic.row = data.row;
            dynamic.col = data.col;

            // Check if it is still within the player view range.
            if (dynamic.row < playerRowTopViewRange
                || dynamic.row > playerRowBotViewRange
                || dynamic.col < playerColLeftViewRange
                || dynamic.col > playerColRightViewRange) {
                // Out of view range. Remove it.
                dynamicSpriteContainer.destroy();
                // Remove the reference to it.
                delete Global.gameScene.dynamics[dynamic.id];
                return;
            }

            // Tween to the new location.
            Global.gameScene.tweens.add({
                targets: dynamicSpriteContainer,
                duration: data.moveRate || dynamicSpriteContainer.moveRate || 100,
                x: data.col * Config.SCALED_TILE_SIZE,
                y: data.row * Config.SCALED_TILE_SIZE,
            });

            // Move sprites further down the screen above ones further up.
            Global.gameScene.dynamicSpritesContainer.sort('y');
        }

        // If the dynamic does something extra when it moves, do it.
        if (dynamicSpriteContainer.onMove) dynamicSpriteContainer.onMove(true, data.moveRate);

        if (direction && dynamicSpriteContainer.flipHorizontally) {
            dynamicSpriteContainer.flipHorizontally(direction);
        }
    };

    eventResponses.heal = (data: {id: string; amount: string}) => {
        Global.gameScene.dynamics[data.id].spriteContainer.onHitPointsModified(data.amount);
    };

    eventResponses.damage = (data: {id: string; amount: string}) => {
        const { spriteContainer } = Global.gameScene.dynamics[data.id];
        spriteContainer.onHitPointsModified(data.amount);
        // Squirt some juice.
        Global.gameScene.damageParticleEmitter.emitParticleAt(
            spriteContainer.x,
            spriteContainer.y,
        );
    };

    eventResponses.change_direction = (data: {id: string}) => {
        // console.log("change_direction:", data);
        // Check the entity id is valid.
        const dynamic = Global.gameScene.dynamics[data.id];
        if (dynamic === undefined) return;

        const { spriteContainer } = dynamic;

        // TODO: maybe still need this in case want to tell other players when someone clicks in a direction, i.e. side to side, but without moving.
    };

    eventResponses.start_action = (data: {id: string; actionName: string; duration: number}) => {
        // console.log('start action:', data);
        const dynamic = Global.gameScene.dynamics[data.id];
        if (dynamic === undefined) return;

        dynamic.spriteContainer.startAction(data.actionName, data.duration);
    };
};

export default Entity;
