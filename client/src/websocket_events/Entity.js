import Utils from "../Utils";

const tweenCompleteLeft = () => {
    _this.tilemap.shiftMapLeft();
    _this.playerTween = null;
}

const tweenCompleteRight = () => {
    _this.tilemap.shiftMapRight();
    _this.playerTween = null;
}

const tweenCompleteUp = () => {
    _this.tilemap.shiftMapUp();
    _this.playerTween = null;
}

const tweenCompleteDown = () => {
    _this.tilemap.shiftMapDown();
    _this.playerTween = null;
}

export default (eventResponses) => {

    eventResponses.add_entity = (data) => {
        //console.log("add entity event:", data);
        if (_this.addEntity === undefined) return;
        _this.addEntity(data);
    };

    eventResponses.remove_entity = (data) => {
        //console.log("remove entity event:", data);
        _this.removeDynamic(data);
    };

    eventResponses.add_entities = (data) => {
        //console.log("add entities event");
        for (let i = 0; i < data.length; i += 1) {
            _this.addEntity(data[i]);
        }
    };

    eventResponses.moved = (data) => {
        // console.log("moved: ", data);

        if (_this.dynamics === undefined) {
            // Something went wrong... Reload the page.
            //location.reload();
            return;
        }

        // Get the dynamic that moved.
        const dynamic = _this.dynamics[data.id];

        // Check the entity id is valid.
        if (dynamic === undefined) return;

        const dynamicSpriteContainer = dynamic.spriteContainer;

        // The client player moved.
        if (data.id === _this.player.entityId) {
            let origRow = _this.player.row;
            let origCol = _this.player.col;

            // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
            if (_this.playerTween !== null) {
                _this.playerTween.stop();
            }

            // Do this AFTER stopping the current player tween, so it can finish with the
            // previous position (the one that matches the state the tween starts in).
            _this.player.row = data.row;
            _this.player.col = data.col;

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

            _this.checkDynamicsInViewRange();
            _this.tilemap.updateDarknessGrid();
            _this.tilemap.updateDarknessGridPosition();

            // Tween the player sprite to the target row/col.
            _this.playerTween = _this.tweens.add({
                targets: dynamicSpriteContainer,
                duration: _this.moveDelay,
                x: data.col * dungeonz.SCALED_TILE_SIZE,
                y: data.row * dungeonz.SCALED_TILE_SIZE,
                onComplete: tweenOnCompleteFunction,
                // Need to do stop callback too in case the tween hasn't finished
                // yet, as calling Tween.stop() then doesn't call onComplete.
                onStop: tweenOnCompleteFunction
            });

            // Check for any interactables that are now in range to be interacted with.
            const
                interactables = _this.interactables,
                interactionRange = 4;
            let interactable;

            for (let key in interactables) {
                if (interactables.hasOwnProperty(key) === false) continue;
                interactable = interactables[key];

                const distFromPlayer =
                    Math.abs(interactable.row - dynamic.row) +
                    Math.abs(interactable.col - dynamic.col);

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
            }

            _this.soundManager.player.playFootstep();
        }
        // Another entity moved.
        else {
            // Get the boundaries of the player view range.
            let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
            let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
            let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
            let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

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
                delete _this.dynamics[dynamic.id];
                return;
            }

            // Tween to the new location.
            _this.tweens.add({
                targets: dynamicSpriteContainer,
                duration: dynamicSpriteContainer.moveRate || 250,
                x: data.col * dungeonz.SCALED_TILE_SIZE,
                y: data.row * dungeonz.SCALED_TILE_SIZE
            });
        }

        // If the dynamic does something extra when it moves, do it.
        if (dynamicSpriteContainer.onMove) dynamicSpriteContainer.onMove(true);

        // Move sprites further down the screen above ones further up.
        _this.dynamicSpritesContainer.list.forEach((dynamicSpriteContainer) => {
            dynamicSpriteContainer.z = dynamicSpriteContainer.y;
        });
    };

    eventResponses.heal = (data) => {
        _this.dynamics[data.id].spriteContainer.onHitPointsModified(data.amount);
    };

    eventResponses.damage = (data) => {
        const spriteContainer = _this.dynamics[data.id].spriteContainer;
        spriteContainer.onHitPointsModified(data.amount);
        // Squirt some juice.
        _this.damageParticleEmitter.emitParticleAt(
            spriteContainer.x,
            spriteContainer.y
        );
    };

    eventResponses.active_state = (data) => {
        //console.log("active state change:", data);
        _this.tilemap.updateStaticTile(data, true);
    };

    eventResponses.inactive_state = (data) => {
        //console.log("inactive state change:", data);
        _this.tilemap.updateStaticTile(data, false);
    };

    eventResponses.change_direction = (data) => {
        //console.log("change_direction:", data);
        // Check the entity id is valid.
        const dynamic = _this.dynamics[data.id];
        if (dynamic === undefined) return;

        const spriteContainer = dynamic.spriteContainer;

        spriteContainer.setDirection(data.direction);

        // Some sprites show their direction by having different frames, others by rotating.
        if (spriteContainer.baseFrames !== undefined) {
            spriteContainer.baseSprite.setFrame(spriteContainer.baseFrames[spriteContainer.direction]);
        }
        if (spriteContainer.directionAngles !== undefined) {
            spriteContainer.angle = spriteContainer.directionAngles[spriteContainer.direction];
        }
        if (spriteContainer.clothes !== undefined) {
            spriteContainer.clothes.setFrame(spriteContainer.clothes.clothesFrames[spriteContainer.clothes.clothesName][spriteContainer.direction]);
            spriteContainer.clothes.anims.stop();
        }

        spriteContainer.onChangeDirection();
    };
};