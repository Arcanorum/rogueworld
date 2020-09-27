import Utils from './Utils';
import addStaticTile from './Statics'

class Tilemap {

    constructor(scene) {
        this.scene = scene;
        // The frame on the ground tileset that is all black.
        this.blackFrame = 4;

        this.mapRows = 0;
        this.mapCols = 0;

        //this.pendingStaticTileChanges = [];

        this.createGroundGrid();
        this.createStaticsGrid();
        //this.createDarknessGrid();

        //this.createTestDarkness(); // Testing with new darkness methods.

        //this.createBorders();
    }

    createGroundGrid() {
        const
            viewDiameter = dungeonz.VIEW_DIAMETER,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            scene = this.scene;

        this.groundSpritesGrid = [];

        for (let row = 0; row < viewDiameter; row += 1) {
            this.groundSpritesGrid[row] = [];
            for (let col = 0; col < viewDiameter; col += 1) {
                const sprite = scene.add.sprite(col * scaledTileSize, row * scaledTileSize, "ground-tileset", 1);
                sprite.setScale(GAME_SCALE);
                sprite.setOrigin(0.5);
                this.groundSpritesGrid[row][col] = sprite;
            }
        }
    }

    createStaticsGrid() {
        const
            viewDiameter = dungeonz.VIEW_DIAMETER;

        this.staticsSpritesGrid = [];

        for (let row = 0; row < viewDiameter; row += 1) {
            this.staticsSpritesGrid[row] = [];
            for (let col = 0; col < viewDiameter; col += 1) {
                this.staticsSpritesGrid[row][col] = null;
            }
        }
    }

    createDarknessGrid() {
        this.darknessGrid = [];
        this.darknessGridGroup = this.scene.add.group();

        //this.darknessGridGroup.fixedToCamera = true;

        let row,
            col,
            tile,
            darknessValue = 1;

        if (this.scene.boardAlwaysNight === false) {
            if (this.scene.dayPhase === this.scene.DayPhases.Day) darknessValue = 0;
            if (this.scene.dayPhase === this.scene.DayPhases.Dawn) darknessValue = 0.5;
            if (this.scene.dayPhase === this.scene.DayPhases.Dusk) darknessValue = 0.5;
        }

        for (row = 0; row < dungeonz.VIEW_DIAMETER; row += 1) {
            this.darknessGrid.push([]);
            for (col = 0; col < dungeonz.VIEW_DIAMETER; col += 1) {
                tile = this.scene.add.sprite(16 * GAME_SCALE * col, 16 * GAME_SCALE * row, 'ground-tileset', this.blackFrame);
                tile.setScale(GAME_SCALE);
                tile.alpha = darknessValue;
                this.darknessGrid[row][col] = tile;
                this.darknessGridGroup.add(tile);
            }
        }

        this.darknessGridGroup.x = (this.scene.player.col * dungeonz.SCALED_TILE_SIZE + (dungeonz.SCALED_TILE_SIZE * 0.5)) - (this.darknessGridGroup.width * 0.5);
        this.darknessGridGroup.y = (this.scene.player.row * dungeonz.SCALED_TILE_SIZE + (dungeonz.SCALED_TILE_SIZE * 0.5)) - (this.darknessGridGroup.height * 0.5);
    }

    /**
     * Creates a sprite for each edge of the screen that covers that edge.
     * Used to hide the ugly transition pop-in of new tiles/entities during the player move tween.
     */
    createBorders() {
        this.bordersGroup = this.scene.add.group();

        const gridSize = dungeonz.SCALED_TILE_SIZE * dungeonz.VIEW_DIAMETER + (dungeonz.SCALED_TILE_SIZE * 2);
        const thickness = (dungeonz.SCALED_TILE_SIZE * 2) + 32;
        // Top.
        this.topBorderSprite = this.scene.add.sprite(0, 0, 'ground-tileset', this.blackFrame, this.bordersGroup);
        this.topBorderSprite.width = gridSize;
        this.topBorderSprite.height = thickness;
        this.topBorderSprite.setOrigin(0.5);
        this.topBorderSprite.fixedToCamera = true;
        // Bottom.
        this.bottomBorderSprite = this.scene.add.sprite(0, 0, 'ground-tileset', this.blackFrame, this.bordersGroup);
        this.bottomBorderSprite.width = gridSize;
        this.bottomBorderSprite.height = thickness;
        this.bottomBorderSprite.setOrigin(0.5);
        this.bottomBorderSprite.fixedToCamera = true;
        // Left.
        this.leftBorderSprite = this.scene.add.sprite(0, 0, 'ground-tileset', this.blackFrame, this.bordersGroup);
        this.leftBorderSprite.height = gridSize;
        this.leftBorderSprite.width = thickness;
        this.leftBorderSprite.setOrigin(0.5);
        this.leftBorderSprite.fixedToCamera = true;
        // Right.
        this.rightBorderSprite = this.scene.add.sprite(0, 0, 'ground-tileset', this.blackFrame, this.bordersGroup);
        this.rightBorderSprite.height = gridSize;
        this.rightBorderSprite.width = thickness;
        this.rightBorderSprite.setOrigin(0.5);
        this.rightBorderSprite.fixedToCamera = true;

        this.updateBorders();
    }

    /**
     * Sets the black border sprites (that hide the move transition pop-in) to be at the edges of the screen.
     */
    updateBorders() {
        const halfWindowWidth = window.innerWidth / 2;
        const halfWindowHeight = window.innerHeight / 2;
        const gridRangeSize = dungeonz.SCALED_TILE_SIZE * (dungeonz.VIEW_RANGE + 1);
        const halfTileScale = dungeonz.SCALED_TILE_SIZE / 2;
        // When the window resized, set the border covers to be the width/height of the window.
        // Also move them along to be at the edge of the view range to put them to the edge of the tiled area.
        // this.topBorderSprite.cameraOffset.x = halfWindowWidth;
        // this.topBorderSprite.cameraOffset.y = halfWindowHeight - gridRangeSize + halfTileScale;

        // this.bottomBorderSprite.cameraOffset.x = halfWindowWidth;
        // this.bottomBorderSprite.cameraOffset.y = halfWindowHeight + gridRangeSize - halfTileScale;

        // this.leftBorderSprite.cameraOffset.x = halfWindowWidth - gridRangeSize + halfTileScale;
        // this.leftBorderSprite.cameraOffset.y = halfWindowHeight;

        // this.rightBorderSprite.cameraOffset.x = halfWindowWidth + gridRangeSize - halfTileScale;
        // this.rightBorderSprite.cameraOffset.y = halfWindowHeight;
    }

    /**
     * Updates the whole ground grid. Used at init and board change. Use the edge ones for player movement.
     */
    updateGroundGrid() {
        const
            playerRow = this.scene.player.row,
            playerCol = this.scene.player.col,
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            viewDiameter = dungeonz.VIEW_DIAMETER;
        let row,
            col,
            targetRow,
            targetCol;

        // Change the frame in use by each tile sprite of the ground grid for each tile within the player's view range.
        for (row = 0; row < viewDiameter; row += 1) {
            targetRow = playerRow + row - viewRange;
            for (col = 0; col < viewDiameter; col += 1) {
                targetCol = playerCol + col - viewRange;
                // Check the cell to view is in the current map bounds.
                if (currentMapGroundGrid[targetRow] !== undefined) {
                    if (currentMapGroundGrid[targetRow][targetCol] !== undefined) {
                        groundSpritesGrid[row][col].setFrame(currentMapGroundGrid[targetRow][targetCol]);
                        continue;
                    }
                }
                // If the cell to view is out of the current map bounds, show a black frame for that tile.
                groundSpritesGrid[row][col].setFrame(this.blackFrame);
            }
        }

        // Reposition to around where the player is now.
        const
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerX = this.scene.player.col * scaledTileSize + halfScaledTileSize - viewRangePixels,
            playerY = this.scene.player.row * scaledTileSize + halfScaledTileSize - viewRangePixels;

        groundSpritesGrid.forEach((row, rowIndex) => {
            row.forEach((tileSprite, colIndex) => {
                tileSprite.x = playerX + (colIndex * scaledTileSize);
                tileSprite.y = playerY + (rowIndex * scaledTileSize);
            });
        });
    }

    /**
     * Updates the sprites around the edge in the direction that was moved in, as the rest of the data is just shifted and wraps back around.
     */
    updateGroundGridEdgeTop() {
        const
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            playerRow = this.scene.player.row,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerY = this.scene.player.row * scaledTileSize + halfScaledTileSize,
            topRow = groundSpritesGrid[0],
            mapRow = currentMapGroundGrid[playerRow - viewRange];
        let
            targetCol;

        topRow.forEach((tileSprite, colIndex) => {
            targetCol = this.scene.player.col + colIndex - viewRange;
            // Move this tile sprite position to the other end of the grid.
            tileSprite.y = playerY - viewRangePixels;
            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Update the sprite frame.
                    tileSprite.setFrame(mapRow[targetCol]);
                    return;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileSprite.setFrame(this.blackFrame);
        });
    }

    updateGroundGridEdgeBottom() {
        const
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            playerRow = this.scene.player.row,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerY = this.scene.player.row * scaledTileSize + halfScaledTileSize,
            bottomRow = groundSpritesGrid[groundSpritesGrid.length - 1],
            mapRow = currentMapGroundGrid[playerRow + viewRange];
        let
            targetCol;

        bottomRow.forEach((tileSprite, colIndex) => {
            targetCol = this.scene.player.col + colIndex - viewRange;
            // Move this tile sprite position to the other end of the grid.
            tileSprite.y = playerY + viewRangePixels;
            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Update the sprite frame.
                    tileSprite.setFrame(mapRow[targetCol]);
                    return;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileSprite.setFrame(this.blackFrame);
        });
    }

    updateGroundGridEdgeLeft() {
        const
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            startColIndex = 0,
            playerRow = this.scene.player.row,
            targetCol = this.scene.player.col - viewRange,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerX = this.scene.player.col * scaledTileSize + halfScaledTileSize;
        let
            mapRow,
            tileSprite;

        groundSpritesGrid.forEach((row, rowIndex) => {
            mapRow = currentMapGroundGrid[playerRow + rowIndex - viewRange];
            tileSprite = row[startColIndex];
            // Move this tile sprite position to the other end of the grid.
            tileSprite.x = playerX - viewRangePixels;
            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Update the sprite frame.
                    tileSprite.setFrame(mapRow[targetCol]);
                    return;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileSprite.setFrame(this.blackFrame);
        });
    }

    updateGroundGridEdgeRight() {
        const
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            endColIndex = groundSpritesGrid[0].length - 1,
            playerRow = this.scene.player.row,
            targetCol = this.scene.player.col + endColIndex - viewRange,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerX = this.scene.player.col * scaledTileSize + halfScaledTileSize;
        let
            mapRow,
            tileSprite;

        groundSpritesGrid.forEach((row, rowIndex) => {
            mapRow = currentMapGroundGrid[playerRow + rowIndex - viewRange];
            tileSprite = row[endColIndex];
            // Move this tile sprite position to the other end of the grid.
            tileSprite.x = playerX + viewRangePixels;
            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Update the sprite frame.
                    tileSprite.setFrame(mapRow[targetCol]);
                    return;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileSprite.setFrame(this.blackFrame);
        });
    }

    /**
     * Updates the whole statics grid. Used at init and board change. Use the edge ones for player movement.
     */
    updateStaticsGrid() {
        //console.log("update statics grid: ", this.currentMapStaticsGrid);
        // const playerRow = this.scene.player.row,
        //     playerCol = this.scene.player.col,
        //     staticsSpritesGrid = this.staticsSpritesGrid,
        //     currentMapStaticsGrid = this.currentMapStaticsGrid,
        //     tileSize = dungeonz.TILE_SIZE,
        //     viewRange = dungeonz.VIEW_RANGE,
        //     viewDiameter = dungeonz.VIEW_DIAMETER;
        // let row,
        //     col,
        //     targetRow,
        //     targetCol,
        //     staticTile;

        // // Change the frames of the static entities for each tile within the player's view diameter.
        // for (row = 0; row < viewDiameter; row += 1) {
        //     targetRow = playerRow + row - viewRange;
        //     for (col = 0; col < viewDiameter; col += 1) {
        //         targetCol = playerCol + col - viewRange;
        //         const tileSprite = staticsSpritesGrid[row][col];
        //         // Clear the previous tile sprite where a static might go, so there isn't a previous one still shown there.
        //         tileSprite.setVisible(false);
        //         // Check the cell row to view is in the current map bounds. Do this after clear otherwise previous statics won't be cleared.
        //         if (currentMapStaticsGrid[targetRow] === undefined) continue;
        //         // Check the cell column to view is in the current map bounds.
        //         if (currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
        //         // Check it isn't an empty tile. i.e. no static entity there.
        //         if (currentMapStaticsGrid[targetRow][targetCol][0] === 0) continue;
        //         // Add a static entity to the statics list, so it can have state changes applied.
        //         staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
        //         // Show the sprite with this tile frame.
        //         tileSprite.setFrame(staticTile.tileID);
        //         tileSprite.setVisible(true);
        //     }
        // }

        // ***************************************************

        // Need to remove all existing sprites, and rebuild the sprites grid.
        // It doesn't work the same here as the ground grid, as statics are 
        // more complex with interactivity and custom data, so they need to
        // be instances of the appropriate static tile sprite class.

        const
            playerRow = this.scene.player.row,
            playerCol = this.scene.player.col,
            staticsSpritesGrid = this.staticsSpritesGrid,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            viewRange = dungeonz.VIEW_RANGE,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            viewDiameter = dungeonz.VIEW_DIAMETER;
        let row,
            col,
            targetRow,
            targetCol;

        // Remove.
        staticsSpritesGrid.forEach((row) => {
            row.forEach((tileSprite, tileIndex, rowArray) => {
                if (tileSprite) {
                    tileSprite.destroy();
                    // Also remove the reference to the sprite from the grid.
                    rowArray[tileIndex] = null;
                }
            });
        });

        // Add.
        for (row = 0; row < viewDiameter; row += 1) {
            targetRow = playerRow + row - viewRange;
            for (col = 0; col < viewDiameter; col += 1) {
                targetCol = playerCol + col - viewRange;
                // Check the cell to view is in the current map bounds.
                if (currentMapStaticsGrid[targetRow] !== undefined) {
                    if (currentMapStaticsGrid[targetRow][targetCol] !== undefined) {
                        // Empty static grid spaces in the map data are represented as [0].
                        if (currentMapStaticsGrid[targetRow][targetCol][0] === 0) {
                            staticsSpritesGrid[row][col] = null;
                        }
                        else {
                            staticsSpritesGrid[row][col] = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                        }
                    }
                }
            }
        }

        // Reposition to around where the player is now.
        const
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerX = (this.scene.player.col * scaledTileSize) + halfScaledTileSize - viewRangePixels,
            playerY = (this.scene.player.row * scaledTileSize) + halfScaledTileSize - viewRangePixels;

        staticsSpritesGrid.forEach((row, rowIndex) => {
            row.forEach((tileSprite, colIndex) => {
                if (tileSprite) {
                    tileSprite.x = playerX + (colIndex * scaledTileSize);
                    tileSprite.y = playerY + (rowIndex * scaledTileSize);
                }
            });
        });
    }

    updateStaticsGridEdgeTop() {
        const row = 0,
            playerCol = this.scene.player.col,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = this.scene.player.row + row - dungeonz.VIEW_RANGE;
        let col,
            targetCol,
            staticTile;

        for (col = 0; col < dungeonz.VIEW_DIAMETER; col += 1) {
            targetCol = playerCol + col - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(col * tileSize, rowPosition, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if (currentMapStaticsGrid[targetRow][targetCol][0] !== 0) {
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
                staticsGridBitmapData.draw(staticsDrawingSprite, col * tileSize, rowPosition);
            }
        }
    }

    updateStaticsGridEdgeBottom() {
        const row = dungeonz.VIEW_DIAMETER - 1,
            playerCol = this.scene.player.col,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = this.scene.player.row + row - dungeonz.VIEW_RANGE;
        let col,
            targetCol,
            staticTile;

        for (col = 0; col < dungeonz.VIEW_DIAMETER; col += 1) {
            targetCol = playerCol + col - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(col * tileSize, rowPosition, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if (currentMapStaticsGrid[targetRow][targetCol][0] !== 0) {
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
                staticsGridBitmapData.draw(staticsDrawingSprite, col * tileSize, rowPosition);
            }
        }
    }

    updateStaticsGridEdgeLeft() {
        const col = 0,
            playerRow = this.scene.player.row,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            colPosition = col * tileSize,
            targetCol = this.scene.player.col + col - dungeonz.VIEW_RANGE;
        let row,
            targetRow,
            staticTile;

        for (row = 0; row < dungeonz.VIEW_DIAMETER; row += 1) {
            targetRow = playerRow + row - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(colPosition, row * tileSize, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if (currentMapStaticsGrid[targetRow][targetCol][0] !== 0) {
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
                staticsGridBitmapData.draw(staticsDrawingSprite, colPosition, row * tileSize);
            }
        }
    }

    updateStaticsGridEdgeRight() {
        const col = dungeonz.VIEW_DIAMETER - 1,
            playerRow = this.scene.player.row,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            colPosition = col * tileSize,
            targetCol = this.scene.player.col + col - dungeonz.VIEW_RANGE;
        let row,
            targetRow,
            staticTile;

        for (row = 0; row < dungeonz.VIEW_DIAMETER; row += 1) {
            targetRow = playerRow + row - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(colPosition, row * tileSize, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if (currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if (currentMapStaticsGrid[targetRow][targetCol][0] !== 0) {
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
                staticsGridBitmapData.draw(staticsDrawingSprite, colPosition, row * tileSize);
            }
        }
    }

    /**
     * Changes the frame displayed on the given existing static tile.
     * @param {String} tileID - The unique ID of the target tile. Looks like row-col, "147-258".
     * @param {Boolean} active - Whether the static tile is active. Some tiles can be inactive, such as interactables.
     */
    updateStaticTile(tileID, active) {
        /** @type {Static} */
        const staticTile = _this.statics[tileID];
        // Cannot update if it doesn't exist.
        if (staticTile === undefined) return;

        let staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            tileSize = dungeonz.TILE_SIZE,
            targetRow = staticTile.row - _this.player.row + dungeonz.VIEW_RANGE,
            targetCol = staticTile.col - _this.player.col + dungeonz.VIEW_RANGE;

        if (_this.playerTweenDirections.u === true) targetRow -= 1;
        if (_this.playerTweenDirections.d === true) targetRow += 1;
        if (_this.playerTweenDirections.l === true) targetCol -= 1;
        if (_this.playerTweenDirections.r === true) targetCol += 1;

        // Remove all pixel data from the target
        staticsGridBitmapData.clear(targetCol * tileSize, targetRow * tileSize, tileSize, tileSize);
        // Redraw the sprite inactive frame at this tile position.
        if (active === true) {
            staticsDrawingSprite.setFrame(staticTile.tileID);
        }
        else {
            staticsDrawingSprite.setFrame(staticTile.inactiveFrame);
        }
        // Draw the frame of the tile onto the statics bitmap data object.
        staticsGridBitmapData.draw(staticsDrawingSprite, targetCol * tileSize, targetRow * tileSize);
    }

    updateDarknessGrid() {
        //console.log("update darkness grid");

        // TODO add darkness back
        /*let player = this.scene.dynamics[this.scene.player.entityId],
            lightSources = this.scene.lightSources,
            darknessGrid = this.darknessGrid,
            darknessValue = 0,
            viewDiameter = dungeonz.VIEW_DIAMETER;

        if(this.scene.boardAlwaysNight === true){
            darknessValue = 1;
        }
        else {
            // Don't bother doing the rest if it is day.
            if(this.scene.dayPhase === this.scene.DayPhases.Day) return;
            else if(this.scene.dayPhase === this.scene.DayPhases.Dawn) darknessValue = 0.5;
            else if(this.scene.dayPhase === this.scene.DayPhases.Dusk) darknessValue = 0.5;
            else darknessValue = 1;
        }

        // Make the whole thing completely dark.
        let row,
            col;
        for(row=0; row<viewDiameter; row+=1){
            for(col=0; col<viewDiameter; col+=1){
                darknessGrid[row][col].alpha = darknessValue;
            }
        }

        if(player !== undefined){
            //this.revealDarkness(player.sprite.x, player.sprite.y, 10);
            this.revealDarkness(_this.player.row, _this.player.col, 5);
        }

        let key;
        let lightSource;
        // Lighten the area around each light source.
        for(key in lightSources){
            if(lightSources.hasOwnProperty(key)){
                lightSource = lightSources[key];
                //this.revealDarkness(lightSource.x, lightSource.y, lightSource.lightDistance);
                this.revealDarkness(lightSource.row, lightSource.col, lightSource.sprite.lightDistance);
            }
        }*/
    }

    /**
     * Reduces the darkness value of darkness tiles around a target position.
     * @param {Number} rowIn
     * @param {Number} colIn
     * @param {Number} radius - The radius of the light.
     */
    revealDarkness(rowIn, colIn, radius) {
        // TODO: figure out daytime darkness for dark areas, caves etc.
        // TODO add darkness back
        /*const radiusPlusOne = radius + 1;
        let rowOffset = -radius,
            colOffset = -radius,
            row = (Math.floor(rowIn) + dungeonz.VIEW_RANGE) - _this.player.row,
            col = (Math.floor(colIn) + dungeonz.VIEW_RANGE) - _this.player.col,
            darknessGrid = this.darknessGrid,
            tile,
            rowDist,
            colDist,
            targetRow,
            targetCol,
            distFromCenter;

        for(; rowOffset<radiusPlusOne; rowOffset+=1){
            for(colOffset=-radius; colOffset<radiusPlusOne; colOffset+=1){
                targetRow = row + rowOffset;
                targetCol = col + colOffset;

                if(darknessGrid[targetRow] ===  undefined) continue;
                tile = darknessGrid[targetRow][targetCol];
                if(tile ===  undefined) continue;

                rowDist = Math.abs(row - targetRow);
                colDist = Math.abs(col - targetCol);
                distFromCenter = rowDist + colDist;

                if(1 - (distFromCenter / radius) > 0){
                    tile.alpha -= 1 - (distFromCenter / radius);
                    if(tile.alpha < 0){
                        tile.alpha = 0;
                    }
                }
            }
        }*/
    }

    /**
     * Loads a new map. Updates the world display layers.
     * @param {String} boardName
     */
    loadMap(boardName) {
        Utils.message("Loading map:", boardName);

        this.scene.currentBoardName = boardName;

        // Clear the statics object. This is the only reference to the statics from the previous map, so now they can be GCed.
        _this.statics = {};

        // Select the map data grids of the new map.
        this.currentMapGroundGrid = dungeonz.mapsData[boardName].groundGrid;
        this.currentMapStaticsGrid = dungeonz.mapsData[boardName].staticsGrid;

        this.mapRows = this.currentMapGroundGrid.length;
        this.mapCols = this.currentMapGroundGrid[0].length;

        // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
        if (_this.playerTween !== null) {
            _this.playerTween.stop();
        }

        // Update the game world bounds. Affects how the camera bumps up against edges.
        this.scene.cameras.main.setBounds(
            -(dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE),
            -(dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE),
            this.mapCols * dungeonz.SCALED_TILE_SIZE + (dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE * 2),
            this.mapRows * dungeonz.SCALED_TILE_SIZE + (dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE * 2)
        );

        // Used to center on the player, as center is halfway across the player sprite, which is one tile wide/high.
        // const halfScaledTileSize = dungeonz.SCALED_TILE_SIZE * 0.5;
        // const viewRangePixels = dungeonz.VIEW_RANGE * dungeonz.SCALED_TILE_SIZE;
        // const playerX = this.scene.player.col * dungeonz.SCALED_TILE_SIZE + halfScaledTileSize - viewRangePixels;
        // const playerY = this.scene.player.row * dungeonz.SCALED_TILE_SIZE + halfScaledTileSize - viewRangePixels;

        //TODO: add darkness back this.darknessGridGroup.x = (playerX) - (this.darknessGridGroup.width * 0.5);
        //TODO: add darkness back this.darknessGridGroup.y = (playerY) - (this.darknessGridGroup.height * 0.5);

        this.updateGroundGrid();
        this.updateStaticsGrid();
    }

    shiftMapUp() {
        // Shift the matrices before redoing the edges.
        Utils.shiftMatrixDown(this.groundSpritesGrid);
        Utils.shiftMatrixDown(this.staticsSpritesGrid);

        this.updateGroundGridEdgeTop();
        // this.updateStaticsGridEdgeRight()
        // this.updateDarknessGrid();
    }

    shiftMapDown() {
        // Shift the matrices before redoing the edges.
        Utils.shiftMatrixUp(this.groundSpritesGrid);
        Utils.shiftMatrixUp(this.staticsSpritesGrid);

        this.updateGroundGridEdgeBottom();
        // this.updateStaticsGridEdgeRight()
        // this.updateDarknessGrid();
    }

    shiftMapLeft() {
        // Shift the matrices before redoing the edges.
        Utils.shiftMatrixRight(this.groundSpritesGrid);
        Utils.shiftMatrixRight(this.staticsSpritesGrid);

        this.updateGroundGridEdgeLeft();
        // this.updateStaticsGridEdgeRight()
        // this.updateDarknessGrid();
    }

    shiftMapRight() {
        // Shift the matrices before redoing the edges.
        Utils.shiftMatrixLeft(this.groundSpritesGrid);
        Utils.shiftMatrixLeft(this.staticsSpritesGrid);

        this.updateGroundGridEdgeRight();
        // this.updateStaticsGridEdgeRight()
        // this.updateDarknessGrid();
    }

}

export default Tilemap;