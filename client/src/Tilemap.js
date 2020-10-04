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
        this.createDarknessGrid();

        //this.createTestDarkness(); // Testing with new darkness methods.

        //this.createBorders();
    }

    createGroundGrid() {
        const
            viewDiameter = dungeonz.VIEW_DIAMETER,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            scene = this.scene;

        this.groundSpritesGrid = [];
        this.groundSpritesContainer = this.scene.add.container();
        this.groundSpritesContainer.setDepth(this.scene.renderOrder.ground);

        for (let row = 0; row < viewDiameter; row += 1) {
            this.groundSpritesGrid[row] = [];
            for (let col = 0; col < viewDiameter; col += 1) {
                const sprite = scene.add.sprite(col * scaledTileSize, row * scaledTileSize, "ground-tileset", 1);
                sprite.setScale(GAME_SCALE);
                sprite.setOrigin(0.5);
                this.groundSpritesGrid[row][col] = sprite;
                this.groundSpritesContainer.add(sprite);
            }
        }
    }

    createStaticsGrid() {
        const
            viewDiameter = dungeonz.VIEW_DIAMETER;

        this.staticsSpritesGrid = [];
        this.staticsSpritesContainer = this.scene.add.container();
        this.staticsSpritesContainer.setDepth(this.scene.renderOrder.statics);

        // Just create the basic structure of the grid.
        // It gets populated during updateStaticsGrid.
        for (let row = 0; row < viewDiameter; row += 1) {
            this.staticsSpritesGrid[row] = [];
            for (let col = 0; col < viewDiameter; col += 1) {
                this.staticsSpritesGrid[row][col] = null;
            }
        }
    }

    flickerDarkness() {
        const
            darknessSprites = this.darknessSpritesContainer.list;

        darknessSprites.forEach((tile) => {
            if (tile.darknessValue < 1) {
                let newAlpha = tile.darknessValue + Phaser.Math.FloatBetween(-(tile.darknessValue * 0.05), tile.darknessValue * 0.05);
                if (newAlpha > 1) newAlpha = 1;
                else if (newAlpha < 0) newAlpha = 0;
                tile.alpha = newAlpha;
            }
        });
    }

    createDarknessGrid() {
        if (this.flickerLoop) clearInterval(this.flickerLoop);

        this.darknessSpritesGrid = [];
        this.darknessSpritesContainer = this.scene.add.container();
        this.darknessSpritesContainer.setDepth(this.scene.renderOrder.darkness);

        let row,
            col,
            darknessValue = 1,
            scene = this.scene,
            viewRange = dungeonz.VIEW_RANGE,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE;

        if (this.scene.boardAlwaysNight === false) {
            if (this.scene.dayPhase === this.scene.DayPhases.Day) darknessValue = 0;
            if (this.scene.dayPhase === this.scene.DayPhases.Dawn) darknessValue = 0.5;
            if (this.scene.dayPhase === this.scene.DayPhases.Dusk) darknessValue = 0.5;
        }

        for (row = 0; row < dungeonz.VIEW_DIAMETER; row += 1) {
            this.darknessSpritesGrid[row] = [];
            for (col = 0; col < dungeonz.VIEW_DIAMETER; col += 1) {
                const sprite = scene.add.sprite(col * scaledTileSize, row * scaledTileSize, "ground-tileset", this.blackFrame);
                sprite.setScale(GAME_SCALE);
                sprite.setOrigin(0.5);
                sprite.alpha = darknessValue;
                sprite.darknessValue = darknessValue;
                this.darknessSpritesGrid[row][col] = sprite;
                this.darknessSpritesContainer.add(sprite);
            }
        }

        // Reposition to around where the player is now.
        const
            viewRangePixels = viewRange * scaledTileSize,
            playerX = (this.scene.player.col * scaledTileSize) - viewRangePixels,
            playerY = (this.scene.player.row * scaledTileSize) - viewRangePixels;

        this.darknessSpritesGrid.forEach((row, rowIndex) => {
            row.forEach((tileSprite, colIndex) => {
                tileSprite.x = playerX + (colIndex * scaledTileSize);
                tileSprite.y = playerY + (rowIndex * scaledTileSize);
            });
        });

        this.flickerLoop = setInterval(this.flickerDarkness.bind(this), 500);
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
            targetRow = playerRow - viewRange + row;
            for (col = 0; col < viewDiameter; col += 1) {
                targetCol = playerCol - viewRange + col;
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
            viewRangePixels = viewRange * scaledTileSize,
            playerX = this.scene.player.col * scaledTileSize - viewRangePixels,
            playerY = this.scene.player.row * scaledTileSize - viewRangePixels;

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
        Utils.shiftMatrixDown(this.groundSpritesGrid);

        const
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            playerRow = this.scene.player.row,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerY = this.scene.player.row * scaledTileSize,
            topRow = groundSpritesGrid[0],
            mapRow = currentMapGroundGrid[playerRow - viewRange];
        let
            targetCol;

        topRow.forEach((tileSprite, colIndex) => {
            targetCol = this.scene.player.col - viewRange + colIndex;
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
        Utils.shiftMatrixUp(this.groundSpritesGrid);

        const
            groundSpritesGrid = this.groundSpritesGrid,
            currentMapGroundGrid = this.currentMapGroundGrid,
            viewRange = dungeonz.VIEW_RANGE,
            playerRow = this.scene.player.row,
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            halfScaledTileSize = scaledTileSize * 0.5,
            viewRangePixels = viewRange * scaledTileSize,
            playerY = this.scene.player.row * scaledTileSize,
            bottomRow = groundSpritesGrid[groundSpritesGrid.length - 1],
            mapRow = currentMapGroundGrid[playerRow + viewRange];
        let
            targetCol;

        bottomRow.forEach((tileSprite, colIndex) => {
            targetCol = this.scene.player.col - viewRange + colIndex;
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
        Utils.shiftMatrixRight(this.groundSpritesGrid);

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
            playerX = this.scene.player.col * scaledTileSize;
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
        Utils.shiftMatrixLeft(this.groundSpritesGrid);

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
            playerX = this.scene.player.col * scaledTileSize;
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
        // Need to remove all existing sprites, and rebuild the sprites grid.
        // It doesn't work the same here as the ground grid where it is just
        // changing the frame, as statics are more complex with interactivity
        // and custom data, so they need to be instances of the appropriate
        // static tile sprite class.
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
            targetCol,
            staticTile;

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
            targetRow = playerRow - viewRange + row;
            for (col = 0; col < viewDiameter; col += 1) {
                targetCol = playerCol - viewRange + col;
                // Check the cell to view is in the current map bounds.
                if (currentMapStaticsGrid[targetRow] !== undefined) {
                    if (currentMapStaticsGrid[targetRow][targetCol] !== undefined) {
                        // Empty static grid spaces in the map data are represented as [0].
                        if (currentMapStaticsGrid[targetRow][targetCol][0] !== 0) {
                            staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                            staticsSpritesGrid[row][col] = staticTile;
                            this.staticsSpritesContainer.add(staticTile);
                        }
                    }
                }
            }
        }

        // Reposition to around where the player is now.
        const
            viewRangePixels = viewRange * scaledTileSize,
            playerX = (this.scene.player.col * scaledTileSize) - viewRangePixels,
            playerY = (this.scene.player.row * scaledTileSize) - viewRangePixels;

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
        Utils.shiftMatrixDown(this.staticsSpritesGrid);

        const
            staticsSpritesGrid = this.staticsSpritesGrid,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            viewRange = dungeonz.VIEW_RANGE,
            topSpritesRow = staticsSpritesGrid[0],
            targetRow = this.scene.player.row - viewRange,
            playerCol = this.scene.player.col;
        let
            mapRow,
            targetCol,
            staticTile;

        // Remove top edge tile sprites.
        topSpritesRow.forEach((tileSprite, colIndex) => {
            if (tileSprite) {
                tileSprite.destroy();
                topSpritesRow[colIndex] = null;
            }
        });

        // Add top edge tile sprites.
        topSpritesRow.forEach((tileSprite, colIndex) => {
            targetCol = playerCol - viewRange + colIndex;
            mapRow = currentMapStaticsGrid[targetRow];

            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Empty static grid spaces in the map data are represented as [0].
                    if (mapRow[targetCol][0] !== 0) {
                        staticTile = addStaticTile(targetRow, targetCol, mapRow[targetCol]);
                        topSpritesRow[colIndex] = staticTile;
                        this.staticsSpritesContainer.add(staticTile);
                    }
                }
            }
        });
    }

    updateStaticsGridEdgeBottom() {
        Utils.shiftMatrixUp(this.staticsSpritesGrid);

        const
            staticsSpritesGrid = this.staticsSpritesGrid,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            viewRange = dungeonz.VIEW_RANGE,
            bottomSpritesRow = staticsSpritesGrid[staticsSpritesGrid.length - 1],
            targetRow = this.scene.player.row + viewRange,
            playerCol = this.scene.player.col;
        let
            mapRow,
            targetCol,
            staticTile;

        // Remove bottom edge tile sprites.
        bottomSpritesRow.forEach((tileSprite, colIndex) => {
            if (tileSprite) {
                tileSprite.destroy();
                bottomSpritesRow[colIndex] = null;
            }
        });

        // Add bottom edge tile sprites.
        bottomSpritesRow.forEach((tileSprite, colIndex) => {
            targetCol = playerCol - viewRange + colIndex;
            mapRow = currentMapStaticsGrid[targetRow];

            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Empty static grid spaces in the map data are represented as [0].
                    if (mapRow[targetCol][0] !== 0) {
                        staticTile = addStaticTile(targetRow, targetCol, mapRow[targetCol]);
                        bottomSpritesRow[colIndex] = staticTile;
                        this.staticsSpritesContainer.add(staticTile);
                    }
                }
            }
        });
    }

    updateStaticsGridEdgeLeft() {
        Utils.shiftMatrixRight(this.staticsSpritesGrid);

        const
            staticsSpritesGrid = this.staticsSpritesGrid,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            viewRange = dungeonz.VIEW_RANGE,
            startColIndex = 0,
            playerRow = this.scene.player.row,
            targetCol = this.scene.player.col - viewRange;
        let
            mapRow,
            targetRow,
            tileSprite,
            staticTile;

        // Remove right edge tile sprites.
        staticsSpritesGrid.forEach((row) => {
            tileSprite = row[startColIndex];
            if (tileSprite) {
                tileSprite.destroy();
                row[startColIndex] = null;
            }
        });

        // Add left edge tile sprites.
        staticsSpritesGrid.forEach((row, rowIndex) => {
            targetRow = playerRow - viewRange + rowIndex;
            mapRow = currentMapStaticsGrid[targetRow];

            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Empty static grid spaces in the map data are represented as [0].
                    if (mapRow[targetCol][0] !== 0) {
                        staticTile = addStaticTile(targetRow, targetCol, mapRow[targetCol]);
                        row[startColIndex] = staticTile;
                        this.staticsSpritesContainer.add(staticTile);
                    }
                }
            }
        });
    }

    updateStaticsGridEdgeRight() {
        Utils.shiftMatrixLeft(this.staticsSpritesGrid);

        const
            staticsSpritesGrid = this.staticsSpritesGrid,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            viewRange = dungeonz.VIEW_RANGE,
            endColIndex = staticsSpritesGrid[0].length - 1,
            playerRow = this.scene.player.row,
            targetCol = this.scene.player.col + viewRange;
        let
            mapRow,
            targetRow,
            tileSprite,
            staticTile;

        // Remove left edge tile sprites.
        // The grid has already been shifted, so they are now They are 
        staticsSpritesGrid.forEach((row) => {
            tileSprite = row[endColIndex];
            if (tileSprite) {
                tileSprite.destroy();
                row[endColIndex] = null;
            }
        });

        // Add right edge tile sprites.
        staticsSpritesGrid.forEach((row, rowIndex) => {
            targetRow = playerRow - viewRange + rowIndex;
            mapRow = currentMapStaticsGrid[targetRow];

            // Check the cell to view is in the current map bounds.
            if (mapRow !== undefined) {
                if (mapRow[targetCol] !== undefined) {
                    // Empty static grid spaces in the map data are represented as [0].
                    if (mapRow[targetCol][0] !== 0) {
                        staticTile = addStaticTile(targetRow, targetCol, mapRow[targetCol]);
                        row[endColIndex] = staticTile;
                        this.staticsSpritesContainer.add(staticTile);
                    }
                }
            }
        });
    }

    /**
     * Changes the frame displayed on the given existing static tile.
     * @param {String} tileID - The unique ID of the target tile. Looks like row-col, "147-258".
     * @param {Boolean} active - Whether the static tile is active. Some tiles can be inactive, such as interactables.
     */
    updateStaticTile(tileID, active) {
        /** @type {Static} */
        const staticTile = this.scene.statics[tileID];
        // Cannot update if it doesn't exist.
        if (staticTile === undefined) return;

        if (active === true) {
            staticTile.tileSprite.setFrame(staticTile.tileID);
        }
        else {
            staticTile.tileSprite.setFrame(staticTile.inactiveFrame);
        }
    }

    updateDarknessGrid() {
        let player = this.scene.dynamics[this.scene.player.entityId],
            lightSources = this.scene.lightSources,
            darknessSpritesGrid = this.darknessSpritesGrid,
            darknessValue = 0,
            viewDiameter = dungeonz.VIEW_DIAMETER;

        if (this.scene.boardAlwaysNight === true) {
            darknessValue = 1;
        }
        else {
            // Don't bother doing the rest if it is day.
            if (this.scene.dayPhase === this.scene.DayPhases.Day) return;
            else if (this.scene.dayPhase === this.scene.DayPhases.Dawn) darknessValue = 0.5;
            else if (this.scene.dayPhase === this.scene.DayPhases.Dusk) darknessValue = 0.5;
            else darknessValue = 1;
        }

        // Make the whole thing completely dark.
        let row,
            col,
            tile;
        for (row = 0; row < viewDiameter; row += 1) {
            for (col = 0; col < viewDiameter; col += 1) {
                tile = darknessSpritesGrid[row][col];
                tile.alpha = darknessValue;
                tile.darknessValue = darknessValue;
            }
        }

        if (player !== undefined) {
            //this.revealDarkness(player.sprite.x, player.sprite.y, 10);
            this.revealDarkness(this.scene.player.row, this.scene.player.col, 5);
        }

        let key;
        let lightSource;
        // Lighten the area around each light source.
        for (key in lightSources) {
            if (lightSources.hasOwnProperty(key)) {
                lightSource = lightSources[key];
                //this.revealDarkness(lightSource.x, lightSource.y, lightSource.lightDistance);
                this.revealDarkness(lightSource.row, lightSource.col, lightSource.sprite.lightDistance);
            }
        }
    }

    updateDarknessGridPosition() {
        // Reposition to around where the player is now.
        const
            scaledTileSize = dungeonz.SCALED_TILE_SIZE,
            viewRangePixels = dungeonz.VIEW_RANGE * scaledTileSize,
            playerX = (this.scene.player.col * scaledTileSize) - viewRangePixels,
            playerY = (this.scene.player.row * scaledTileSize) - viewRangePixels;

        this.darknessSpritesGrid.forEach((row, rowIndex) => {
            row.forEach((tileSprite, colIndex) => {
                tileSprite.x = playerX + (colIndex * scaledTileSize);
                tileSprite.y = playerY + (rowIndex * scaledTileSize);
            });
        });
    }

    /**
     * Reduces the darkness value of darkness tiles around a target position.
     * @param {Number} rowIn
     * @param {Number} colIn
     * @param {Number} radius - The radius of the light.
     */
    revealDarkness(rowIn, colIn, radius) {
        // TODO: figure out daytime darkness for dark areas, caves etc.
        const radiusPlusOne = radius + 1;
        let rowOffset = -radius,
            colOffset = -radius,
            row = (Math.floor(rowIn) + dungeonz.VIEW_RANGE) - this.scene.player.row,
            col = (Math.floor(colIn) + dungeonz.VIEW_RANGE) - this.scene.player.col,
            darknessSpritesGrid = this.darknessSpritesGrid,
            tile,
            rowDist,
            colDist,
            targetRow,
            targetCol,
            distFromCenter;

        for (; rowOffset < radiusPlusOne; rowOffset += 1) {
            for (colOffset = -radius; colOffset < radiusPlusOne; colOffset += 1) {
                targetRow = row + rowOffset;
                targetCol = col + colOffset;

                if (darknessSpritesGrid[targetRow] === undefined) continue;
                tile = darknessSpritesGrid[targetRow][targetCol];
                if (tile === undefined) continue;

                rowDist = Math.abs(row - targetRow);
                colDist = Math.abs(col - targetCol);
                distFromCenter = rowDist + colDist;

                if (1 - (distFromCenter / radius) > 0) {
                    tile.alpha -= 1 - (distFromCenter / radius);
                    if (tile.alpha < 0) {
                        tile.alpha = 0;
                    }
                    tile.darknessValue = tile.alpha;
                }
            }
        }
    }

    /**
     * Loads a new map. Updates the world display layers.
     * @param {String} boardName
     */
    loadMap(boardName) {
        Utils.message("Loading map:", boardName);

        this.scene.currentBoardName = boardName;

        // Clear the statics object. This is the only reference to the statics from the previous map, so now they can be GCed.
        this.scene.statics = {};

        // Select the map data grids of the new map.
        this.currentMapGroundGrid = dungeonz.mapsData[boardName].groundGrid;
        this.currentMapStaticsGrid = dungeonz.mapsData[boardName].staticsGrid;

        this.mapRows = this.currentMapGroundGrid.length;
        this.mapCols = this.currentMapGroundGrid[0].length;

        // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
        if (this.scene.playerTween !== null) {
            this.scene.playerTween.stop();
        }

        // Update the game world bounds. Affects how the camera bumps up against edges.
        this.scene.cameras.main.setBounds(
            -(dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE),
            -(dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE),
            this.mapCols * dungeonz.SCALED_TILE_SIZE + (dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE * 2),
            this.mapRows * dungeonz.SCALED_TILE_SIZE + (dungeonz.VIEW_DIAMETER * dungeonz.SCALED_TILE_SIZE * 2)
        );

        this.updateGroundGrid();
        this.updateStaticsGrid();
        this.updateDarknessGrid();
        this.updateDarknessGridPosition();
    }

    shiftMapUp() {
        this.updateGroundGridEdgeTop();
        this.updateStaticsGridEdgeTop();
        this.updateDarknessGrid();
        this.updateDarknessGridPosition();
    }

    shiftMapDown() {
        this.updateGroundGridEdgeBottom();
        this.updateStaticsGridEdgeBottom();
        this.updateDarknessGrid();
        this.updateDarknessGridPosition();
    }

    shiftMapLeft() {
        this.updateGroundGridEdgeLeft();
        this.updateStaticsGridEdgeLeft();
        this.updateDarknessGrid();
        this.updateDarknessGridPosition();
    }

    shiftMapRight() {
        this.updateGroundGridEdgeRight();
        this.updateStaticsGridEdgeRight();
        this.updateDarknessGrid();
        this.updateDarknessGridPosition();
    }

}

export default Tilemap;