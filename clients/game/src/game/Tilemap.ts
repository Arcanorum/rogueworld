import {
    message,
    shiftMatrixDown,
    shiftMatrixLeft,
    shiftMatrixRight,
    shiftMatrixUp,
} from '@dungeonz/utils';
import Phaser from 'phaser';
import Config from '../shared/Config';
import { PlayerState } from '../shared/state';
import GameScene from './GameScene';

const scaledTileSize = Config.SCALED_TILE_SIZE;
const halfScaledTileSize = scaledTileSize * 0.5;
const viewDiameter = Config.VIEW_DIAMETER;
const viewRange = Config.VIEW_RANGE;
const viewRangePixels = viewRange * scaledTileSize;

class Tilemap {
    scene: GameScene;

    /** The frame on the ground tileset that is all black. */
    blackFrame = 4;

    mapRows = 0;

    mapCols = 0;

    currentMapGroundGrid: Array<Array<number>> = [];

    groundTilesGrid: Array<Array<Phaser.GameObjects.Bob>> = [];

    groundTilesBlitter: Phaser.GameObjects.Blitter;

    bordersContainer: Phaser.GameObjects.Container;

    topBorderSprite: Phaser.GameObjects.Sprite;

    bottomBorderSprite: Phaser.GameObjects.Sprite;

    leftBorderSprite: Phaser.GameObjects.Sprite;

    rightBorderSprite: Phaser.GameObjects.Sprite;

    constructor(scene: GameScene) {
        this.scene = scene;

        // Create the ground grid.
        this.groundTilesBlitter = this.scene.add.blitter(0, 0, 'ground-tileset');
        this.groundTilesBlitter.setDepth(this.scene.renderOrder.ground);

        for (let row = 0; row < viewDiameter; row += 1) {
            this.groundTilesGrid[row] = [];
            for (let col = 0; col < viewDiameter; col += 1) {
                const bob = this.groundTilesBlitter.create(
                    col * scaledTileSize,
                    row * scaledTileSize,
                    1,
                );
                this.groundTilesGrid[row][col] = bob;
            }
        }

        // Creates a sprite for each edge of the screen that covers that edge.
        // Used to hide the ugly transition pop-in of new tiles/entities during the player move tween.
        this.bordersContainer = this.scene.add.container();
        this.bordersContainer.setDepth(this.scene.renderOrder.borders);

        const gridSize = scaledTileSize * viewDiameter + (scaledTileSize * 2);
        const thickness = (scaledTileSize * 2) + 32;

        const createBorderSprite = (width: number, height: number) => {
            const borderSprite = this.scene.add.sprite(0, 0, 'ground-tileset', this.blackFrame);
            borderSprite.displayWidth = width;
            borderSprite.displayHeight = height;
            borderSprite.setOrigin(0.5);
            borderSprite.setScrollFactor(0);
            this.bordersContainer.add(borderSprite);
            return borderSprite;
        };

        this.topBorderSprite = createBorderSprite(gridSize, thickness);
        this.bottomBorderSprite = createBorderSprite(gridSize, thickness);
        this.leftBorderSprite = createBorderSprite(thickness, gridSize);
        this.rightBorderSprite = createBorderSprite(thickness, gridSize);

        this.updateBorders();
    }

    /**
     * Sets the black border sprites (that hide the move transition pop-in) to be at the edges of the screen.
     */
    updateBorders() {
        const halfWindowWidth = window.innerWidth / 2;
        const halfWindowHeight = window.innerHeight / 2;
        const gridRangeSize = scaledTileSize * (viewRange + 1);
        const halfTileScale = scaledTileSize / 2;
        // When the window resized, set the border covers to be the width/height of the window.
        // Also move them along to be at the edge of the view range to put them to the edge of the tiled area.
        this.topBorderSprite.x = halfWindowWidth;
        this.topBorderSprite.y = halfWindowHeight - gridRangeSize + halfTileScale;

        this.bottomBorderSprite.x = halfWindowWidth;
        this.bottomBorderSprite.y = halfWindowHeight + gridRangeSize - halfTileScale;

        this.leftBorderSprite.x = halfWindowWidth - gridRangeSize + halfTileScale;
        this.leftBorderSprite.y = halfWindowHeight;

        this.rightBorderSprite.x = halfWindowWidth + gridRangeSize - halfTileScale;
        this.rightBorderSprite.y = halfWindowHeight;
    }

    /**
     * Updates the whole ground grid. Used at init and board change. Use the edge ones for player movement.
     */
    updateGroundGrid() {
        const { groundTilesGrid, currentMapGroundGrid } = this;
        const playerRow = PlayerState.row;
        const playerCol = PlayerState.col;
        let row;
        let col;
        let targetRow;
        let targetCol;

        // Change the frame in use by each tile sprite of the ground grid for each tile within the player's view range.
        for (row = 0; row < viewDiameter; row += 1) {
            targetRow = playerRow - viewRange + row;
            for (col = 0; col < viewDiameter; col += 1) {
                targetCol = playerCol - viewRange + col;
                // Check the cell to view is in the current map bounds.
                if (currentMapGroundGrid[targetRow] !== undefined) {
                    if (currentMapGroundGrid[targetRow][targetCol] !== undefined) {
                        groundTilesGrid[row][col].setFrame(
                            currentMapGroundGrid[targetRow][targetCol],
                        );
                        // eslint-disable-next-line no-continue
                        continue;
                    }
                }
                // If the cell to view is out of the current map bounds, show a black frame for that tile.
                groundTilesGrid[row][col].setFrame(this.blackFrame);
            }
        }

        // Reposition to around where the player is now.
        const playerX = PlayerState.col * scaledTileSize - viewRangePixels;
        const playerY = PlayerState.row * scaledTileSize - viewRangePixels;

        groundTilesGrid.forEach((groundRow, rowIndex) => {
            groundRow.forEach((tileSprite, colIndex) => {
                tileSprite.x = playerX + (colIndex * scaledTileSize) - halfScaledTileSize;
                tileSprite.y = playerY + (rowIndex * scaledTileSize) - halfScaledTileSize;
            });
        });
    }

    /**
     * Updates the sprites around the edge in the direction that was moved in, as the rest of the data is just shifted and wraps back around.
     */
    updateGroundGridEdgeTop() {
        shiftMatrixDown(this.groundTilesGrid);

        const { groundTilesGrid, currentMapGroundGrid } = this;
        const playerRow = PlayerState.row;
        const playerY = PlayerState.row * scaledTileSize;
        const topRow = groundTilesGrid[0];
        const mapRow = currentMapGroundGrid[playerRow - viewRange];
        let targetCol;

        topRow.forEach((tileSprite, colIndex) => {
            targetCol = PlayerState.col - viewRange + colIndex;
            // Move this tile sprite position to the other end of the grid.
            tileSprite.y = playerY - viewRangePixels - halfScaledTileSize;
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
        shiftMatrixUp(this.groundTilesGrid);

        const { groundTilesGrid, currentMapGroundGrid } = this;
        const playerRow = PlayerState.row;
        const playerY = PlayerState.row * scaledTileSize;
        const bottomRow = groundTilesGrid[groundTilesGrid.length - 1];
        const mapRow = currentMapGroundGrid[playerRow + viewRange];
        let targetCol;

        bottomRow.forEach((tileSprite, colIndex) => {
            targetCol = PlayerState.col - viewRange + colIndex;
            // Move this tile sprite position to the other end of the grid.
            tileSprite.y = playerY + viewRangePixels - halfScaledTileSize;
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
        shiftMatrixRight(this.groundTilesGrid);

        const { groundTilesGrid, currentMapGroundGrid } = this;
        const startColIndex = 0;
        const playerRow = PlayerState.row;
        const targetCol = PlayerState.col - viewRange;
        const playerX = PlayerState.col * scaledTileSize;
        let mapRow;
        let tileSprite;

        groundTilesGrid.forEach((row, rowIndex) => {
            mapRow = currentMapGroundGrid[playerRow + rowIndex - viewRange];
            tileSprite = row[startColIndex];
            // Move this tile sprite position to the other end of the grid.
            tileSprite.x = playerX - viewRangePixels - halfScaledTileSize;
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
        shiftMatrixLeft(this.groundTilesGrid);

        const { groundTilesGrid, currentMapGroundGrid } = this;
        const endColIndex = groundTilesGrid[0].length - 1;
        const playerRow = PlayerState.row;
        const targetCol = PlayerState.col + endColIndex - viewRange;
        const playerX = PlayerState.col * scaledTileSize;
        let mapRow;
        let tileSprite;

        groundTilesGrid.forEach((row, rowIndex) => {
            mapRow = currentMapGroundGrid[playerRow + rowIndex - viewRange];
            tileSprite = row[endColIndex];
            // Move this tile sprite position to the other end of the grid.
            tileSprite.x = playerX + viewRangePixels - halfScaledTileSize;
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
     * Loads a new map. Updates the world display layers.
     */
    loadMap(boardName: string) {
        message('Loading map:', boardName);

        this.scene.currentBoardName = boardName;

        // Select the map data grids of the new map.
        this.currentMapGroundGrid = Config.mapsData[boardName].groundGrid;

        this.mapRows = this.currentMapGroundGrid.length;
        this.mapCols = this.currentMapGroundGrid[0].length;

        // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
        if (this.scene.playerTween !== null) {
            this.scene.playerTween.stop();
        }

        const actualViewDiameter = viewDiameter * scaledTileSize;
        const actualViewSize = scaledTileSize + (viewDiameter * scaledTileSize * 2);

        // Update the game world bounds. Affects how the camera bumps up against edges.
        this.scene.cameras.main.setBounds(
            -(actualViewDiameter),
            -(actualViewDiameter),
            this.mapCols * actualViewSize,
            this.mapRows * actualViewSize,
        );

        this.updateGroundGrid();
    }

    shiftMapUp() {
        this.updateGroundGridEdgeTop();
    }

    shiftMapDown() {
        this.updateGroundGridEdgeBottom();
    }

    shiftMapLeft() {
        this.updateGroundGridEdgeLeft();
    }

    shiftMapRight() {
        this.updateGroundGridEdgeRight();
    }
}

export default Tilemap;
