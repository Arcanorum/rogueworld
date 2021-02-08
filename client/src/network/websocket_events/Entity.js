import gameConfig from "../../shared/GameConfig";
import { PlayerState } from "../../shared/state/States";
import eventResponses from "./EventResponses";

const tweenCompleteLeft = () => {
    window.gameScene.tilemap.shiftMapLeft();
    window.gameScene.playerTween = null;
};

const tweenCompleteRight = () => {
    window.gameScene.tilemap.shiftMapRight();
    window.gameScene.playerTween = null;
};

const tweenCompleteUp = () => {
    window.gameScene.tilemap.shiftMapUp();
    window.gameScene.playerTween = null;
};

const tweenCompleteDown = () => {
    window.gameScene.tilemap.shiftMapDown();
    window.gameScene.playerTween = null;
};

export default () => {
    eventResponses.add_entity = (data) => {
        // console.log("add entity event:", data);
        if (window.gameScene.addEntity === undefined) return;
        window.gameScene.addEntity(data);
    };

    eventResponses.remove_entity = (data) => {
        // console.log("remove entity event:", data);
        window.gameScene.removeDynamic(data);
    };

    eventResponses.add_entities = (data) => {
        // console.log("add entities event");
        for (let i = 0; i < data.length; i += 1) {
            window.gameScene.addEntity(data[i]);
        }
    };

    eventResponses.moved = (data) => {
        // console.log("moved: ", data);

        if (window.gameScene.dynamics === undefined) {
            // Something went wrong... Reload the page.
            // location.reload();
            return;
        }

        // Get the dynamic that moved.
        const dynamic = window.gameScene.dynamics[data.id];

        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const dynamicSpriteContainer = dynamic.spriteContainer;

        // The client player moved.
        if (data.id === PlayerState.entityID) {
            const origRow = PlayerState.row;
            const origCol = PlayerState.col;

            // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
            if (window.gameScene.playerTween !== null) {
                window.gameScene.playerTween.stop();
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

            window.gameScene.checkDynamicsInViewRange();
            window.gameScene.tilemap.updateDarknessGrid();
            window.gameScene.tilemap.updateDarknessGridPosition();

            // Tween the player sprite to the target row/col.
            window.gameScene.playerTween = window.gameScene.tweens.add({
                targets: dynamicSpriteContainer,
                duration: window.gameScene.moveDelay,
                x: data.col * gameConfig.SCALED_TILE_SIZE,
                y: data.row * gameConfig.SCALED_TILE_SIZE,
                onComplete: tweenOnCompleteFunction,
                // Need to do stop callback too in case the tween hasn't finished
                // yet, as calling Tween.stop() then doesn't call onComplete.
                onStop: tweenOnCompleteFunction,
            });

            // Check for any interactables that are now in range to be interacted with.
            const
                { interactables } = window.gameScene;
            const interactionRange = 4;

            Object.values(interactables).forEach((interactable) => {
                const distFromPlayer = Math.abs(interactable.row - dynamic.row)
                    + Math.abs(interactable.col - dynamic.col);

                if (distFromPlayer <= interactionRange) {
                    interactable.highlightSprite.setVisible(true);

                    if (interactable.isWithinPressableRange()) {
                        interactable.highlightSprite.setAlpha(1);
                        interactable.highlightSprite.setScale(1.2);
                    }
                    else {
                        interactable.highlightSprite.setAlpha(0.6);
                        interactable.highlightSprite.setScale(1);
                    }
                }
                else {
                    interactable.highlightSprite.setVisible(false);
                }
            });

            window.gameScene.soundManager.player.playFootstep();
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
                delete window.gameScene.dynamics[dynamic.id];
                return;
            }

            // Tween to the new location.
            window.gameScene.tweens.add({
                targets: dynamicSpriteContainer,
                duration: dynamicSpriteContainer.moveRate || 250,
                x: data.col * gameConfig.SCALED_TILE_SIZE,
                y: data.row * gameConfig.SCALED_TILE_SIZE,
            });
        }

        // If the dynamic does something extra when it moves, do it.
        if (dynamicSpriteContainer.onMove) dynamicSpriteContainer.onMove(true);

        // Move sprites further down the screen above ones further up.
        window.gameScene.dynamicSpritesContainer.list.forEach((each) => {
            const otherDynamicSpriteContainer = each;
            otherDynamicSpriteContainer.z = otherDynamicSpriteContainer.y;
        });
    };

    eventResponses.heal = (data) => {
        window.gameScene.dynamics[data.id].spriteContainer.onHitPointsModified(data.amount);
    };

    eventResponses.damage = (data) => {
        const { spriteContainer } = window.gameScene.dynamics[data.id];
        spriteContainer.onHitPointsModified(data.amount);
        // Squirt some juice.
        window.gameScene.damageParticleEmitter.emitParticleAt(
            spriteContainer.x,
            spriteContainer.y,
        );
    };

    eventResponses.active_state = (data) => {
        // console.log("active state change:", data);
        window.gameScene.tilemap.updateStaticTile(data, true);
    };

    eventResponses.inactive_state = (data) => {
        // console.log("inactive state change:", data);
        window.gameScene.tilemap.updateStaticTile(data, false);
    };

    eventResponses.change_direction = (data) => {
        // console.log("change_direction:", data);
        // Check the entity id is valid.
        const dynamic = window.gameScene.dynamics[data.id];
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
