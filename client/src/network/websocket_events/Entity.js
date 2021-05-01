import Pickup from "../../game/entities/pickups/Pickup";
import gameConfig from "../../shared/GameConfig";
import dungeonz from "../../shared/Global";
import { PlayerState } from "../../shared/state/States";
import Utils from "../../shared/Utils";
import eventResponses from "./EventResponses";

const tweenCompleteLeft = () => {
    dungeonz.gameScene.tilemap.shiftMapLeft();
    dungeonz.gameScene.playerTween = null;
};

const tweenCompleteRight = () => {
    dungeonz.gameScene.tilemap.shiftMapRight();
    dungeonz.gameScene.playerTween = null;
};

const tweenCompleteUp = () => {
    dungeonz.gameScene.tilemap.shiftMapUp();
    dungeonz.gameScene.playerTween = null;
};

const tweenCompleteDown = () => {
    dungeonz.gameScene.tilemap.shiftMapDown();
    dungeonz.gameScene.playerTween = null;
};

export default () => {
    eventResponses.add_entity = (data) => {
        // console.log("add entity event:", data);
        if (dungeonz.gameScene.addEntity === undefined) return;
        dungeonz.gameScene.addEntity(data);
    };

    eventResponses.remove_entity = (data) => {
        // console.log("remove entity event:", data);
        dungeonz.gameScene.removeDynamic(data);
    };

    eventResponses.add_entities = (data) => {
        // console.log("add entities event");
        for (let i = 0; i < data.length; i += 1) {
            dungeonz.gameScene.addEntity(data[i]);
        }
    };

    eventResponses.moved = (data) => {
        // console.log("moved: ", data);

        if (dungeonz.gameScene.dynamics === undefined) {
            // Something went wrong... Reload the page.
            // location.reload();
            return;
        }

        // Get the dynamic that moved.
        const dynamic = dungeonz.gameScene.dynamics[data.id];

        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const dynamicSpriteContainer = dynamic.spriteContainer;

        // The client player moved.
        if (data.id === PlayerState.entityID) {
            const origRow = PlayerState.row;
            const origCol = PlayerState.col;

            // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
            if (dungeonz.gameScene.playerTween !== null) {
                dungeonz.gameScene.playerTween.stop();
            }

            // Do this AFTER stopping the current player tween, so it can finish with the
            // previous position (the one that matches the state the tween starts in).
            PlayerState.setRow(data.row);
            PlayerState.setCol(data.col);

            dynamic.row = data.row;
            dynamic.col = data.col;

            let tweenOnCompleteFunction;

            // Right.
            if (data.col > origCol) {
                tweenOnCompleteFunction = tweenCompleteRight;
            }
            // Left.
            else if (data.col < origCol) {
                tweenOnCompleteFunction = tweenCompleteLeft;
            }
            // Down.
            if (data.row > origRow) {
                tweenOnCompleteFunction = tweenCompleteDown;
            }
            // Up.
            else if (data.row < origRow) {
                tweenOnCompleteFunction = tweenCompleteUp;
            }

            dungeonz.gameScene.checkDynamicsInViewRange();
            dungeonz.gameScene.tilemap.updateDarknessGrid();
            dungeonz.gameScene.tilemap.updateDarknessGridPosition();

            // Tween the player sprite to the target row/col.
            dungeonz.gameScene.playerTween = dungeonz.gameScene.tweens.add({
                targets: dynamicSpriteContainer,
                duration: dungeonz.gameScene.moveDelay,
                x: data.col * gameConfig.SCALED_TILE_SIZE,
                y: data.row * gameConfig.SCALED_TILE_SIZE,
                onComplete: tweenOnCompleteFunction,
                // Need to do stop callback too in case the tween hasn't finished
                // yet, as calling Tween.stop() then doesn't call onComplete.
                onStop: tweenOnCompleteFunction,
            });

            // Check for any interactables that are now in range to be interacted with.
            const { interactables } = dungeonz.gameScene;

            Object.values(interactables).forEach((interactable) => {
                interactable.shouldShowHighlight();
                // If it has some kind of timer (i.e. gathering progress) then hide it.
                if (interactable.hideTimer) {
                    interactable.hideTimer();
                }
            });

            // Show the pickup keybind if they are now standing on a pickup.
            const standingOnPickup = Object
                .values(dungeonz.gameScene.dynamics)
                .some((eachDynamic) => (
                    (eachDynamic.spriteContainer instanceof Pickup)
                    && (Utils.tileDistanceBetween(eachDynamic, dynamic) === 0)
                ));

            if (standingOnPickup) {
                dynamicSpriteContainer.warningText.setText(`${Utils.getTextDef("Pick up item")}\n( E )`);
                dynamicSpriteContainer.warningText.setVisible(true);
            }
            else {
                dynamicSpriteContainer.warningText.setVisible(false);
            }

            dungeonz.gameScene.soundManager.effects.playFootstep();
        }
        // Another entity moved.
        else {
            // Get the boundaries of the player view range.
            const playerRowTopViewRange = PlayerState.row - gameConfig.VIEW_RANGE;
            const playerColLeftViewRange = PlayerState.col - gameConfig.VIEW_RANGE;
            const playerRowBotViewRange = PlayerState.row + gameConfig.VIEW_RANGE;
            const playerColRightViewRange = PlayerState.col + gameConfig.VIEW_RANGE;

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
                delete dungeonz.gameScene.dynamics[dynamic.id];
                return;
            }

            // Tween to the new location.
            dungeonz.gameScene.tweens.add({
                targets: dynamicSpriteContainer,
                duration: dynamicSpriteContainer.moveRate || 250,
                x: data.col * gameConfig.SCALED_TILE_SIZE,
                y: data.row * gameConfig.SCALED_TILE_SIZE,
            });
        }

        // If the dynamic does something extra when it moves, do it.
        if (dynamicSpriteContainer.onMove) dynamicSpriteContainer.onMove(true);

        // Move sprites further down the screen above ones further up.
        dungeonz.gameScene.dynamicSpritesContainer.list.forEach((each) => {
            const otherDynamicSpriteContainer = each;
            otherDynamicSpriteContainer.z = otherDynamicSpriteContainer.y;
        });
    };

    eventResponses.heal = (data) => {
        dungeonz.gameScene.dynamics[data.id].spriteContainer.onHitPointsModified(data.amount);
    };

    eventResponses.damage = (data) => {
        const { spriteContainer } = dungeonz.gameScene.dynamics[data.id];
        spriteContainer.onHitPointsModified(data.amount);
        // Squirt some juice.
        dungeonz.gameScene.damageParticleEmitter.emitParticleAt(
            spriteContainer.x,
            spriteContainer.y,
        );
    };

    eventResponses.active_state = (data) => {
        // console.log("active state change:", data);
        dungeonz.gameScene.tilemap.updateStaticTile(data, true);
    };

    eventResponses.inactive_state = (data) => {
        // console.log("inactive state change:", data);
        dungeonz.gameScene.tilemap.updateStaticTile(data, false);
    };

    eventResponses.change_direction = (data) => {
        // console.log("change_direction:", data);
        // Check the entity id is valid.
        const dynamic = dungeonz.gameScene.dynamics[data.id];
        if (dynamic === undefined) return;

        const { spriteContainer } = dynamic;

        spriteContainer.setDirection(data.direction);

        // Some sprites show their direction by having different frames, others by rotating.
        if (spriteContainer.baseFrames !== undefined) {
            spriteContainer.baseSprite.setFrame(
                spriteContainer.baseFrames[spriteContainer.direction],
            );
        }
        if (spriteContainer.directionAngles !== undefined) {
            spriteContainer.angle = spriteContainer.directionAngles[spriteContainer.direction];
        }
        if (spriteContainer.clothes !== undefined) {
            spriteContainer.clothes.setFrame(
                spriteContainer
                    .clothes
                    .clothesFrames[spriteContainer.clothes.clothesName][spriteContainer.direction],
            );
            spriteContainer.clothes.anims.stop();
        }

        spriteContainer.onChangeDirection();
    };
};
