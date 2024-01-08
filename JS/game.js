function checkWin(winCondition) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === winCondition) {
                showMessage("You Win!", "win-message");
                gameOver = true;
                //resetGame();
                return;
            }
        }
    }
}

function checkLose() {
    if (getEmptyCellCount() === 0 && !canMove()) {
        showMessage("Game Over", "lose-message");
        gameOver = true;
        //resetGame();
    }
}

function canMove() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const currentValue = grid[i][j];
            if (
                (i > 0 && grid[i - 1][j] === currentValue) ||
                (i < gridSize - 1 && grid[i + 1][j] === currentValue) ||
                (j > 0 && grid[i][j - 1] === currentValue) ||
                (j < gridSize - 1 && grid[i][j + 1] === currentValue)
            ) {
                return true;
            }
        }
    }
    return false;
}





document.addEventListener('keydown', handleKeyPress);
function handleKeyPress(event) {
    if (isProcessingKeyPress || gameOver) {
        return; // Ignore key presses if a key is already being processed
    }

    isProcessingKeyPress = true;

    const keyCode = event.code;
    console.log('Key pressed:', event.code);
    let dir = '';

    switch (keyCode) {
        case 'ArrowUp':
            dir = 'up';
            break;
        case 'ArrowDown':
            dir = 'down';
            break;
        case 'ArrowLeft':
            dir = 'left';
            break;
        case 'ArrowRight':
            dir = 'right';
            break;
    }

    if (dir !== '') {
        moveTiles(dir);
        updateGame(dir);
    }

    isProcessingKeyPress = false;
}


function moveTiles(direction) {
    // Implement logic to move tiles in the specified direction
    // You need to handle merging, sliding, and updating the grid
    // Use separate functions for sliding and merging to keep the code modular

    slideTiles(direction);
    mergeTiles(direction);
    

}

function slideTiles(direction) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] !== 0) {
                let newRow = i;
                let newCol = j;

                while (canSlide(newRow, newCol, direction)) {
                    const nextCell = getNextCell(newRow, newCol, direction);
                    if (grid[nextCell.x][nextCell.y] != 0)
                    {
                        grid[nextCell.x][nextCell.y] = 2 * grid[newRow][newCol];
                    }
                    else 
                    {
                        grid[nextCell.x][nextCell.y] = grid[newRow][newCol];
                    }
                    grid[newRow][newCol] = 0;
                    newRow = nextCell.x;
                    newCol = nextCell.y;
                }
            }
        }
    }
}

function canSlide(row, col, direction) {
    const nextCell = getNextCell(row, col, direction);
    return isInBounds(nextCell.x, nextCell.y) && (grid[nextCell.x][nextCell.y] === 0 || grid[nextCell.x][nextCell.y] === grid[row][col]);
}

function getNextCell(row, col, direction) {
    switch (direction) {
        case 'up':
            return { x: row - 1, y: col };
        case 'down':
            return { x: row + 1, y: col };
        case 'left':
            return { x: row, y: col - 1 };
        case 'right':
            return { x: row, y: col + 1 };
        default:
            return { x: row, y: col };
    }
}

function getTileAt(row, col) {
    for (let i = 0; i < tileContainer.children.length; i++) {
        const child = tileContainer.children[i];
        if (child.position.x === col * tileSize && child.position.y === row * tileSize) {
            return child;
        }
    }
    return null;
}

function moveTile(startRow, startCol, endRow, endCol) {
    const tile = getTileAt(startRow, startCol);
    if (!tile) return;

    const endX = endCol * tileSize;
    const endY = endRow * tileSize;

    const animationTime = 200; // Adjust the duration as needed
    const animationFrames = 60; // Number of frames in the animation
    const frameDuration = animationTime / animationFrames;

    const deltaX = (endX - tile.position.x) / animationFrames;
    const deltaY = (endY - tile.position.y) / animationFrames;

    let frameCount = 0;

    const animate = () => {
        frameCount++;

        tile.position.x += deltaX;
        tile.position.y += deltaY;

        if (frameCount < animationFrames) {
            setTimeout(animate, frameDuration);
        } else {
            // Animation completed, update the grid data
            grid[endRow][endCol] = grid[startRow][startCol];
            grid[startRow][startCol] = 0;
        }
    };

    animate();
}



function mergeTiles(direction) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] !== 0) {
                let currentCell = { x: i, y: j };
                let nextCell = getNextCell(currentCell.x, currentCell.y, direction);

                while (isInBounds(nextCell.x, nextCell.y) && grid[nextCell.x][nextCell.y] === 0) {
                    currentCell = nextCell;
                    nextCell = getNextCell(currentCell.x, currentCell.y, direction);
                }

                if (isInBounds(nextCell.x, nextCell.y) && grid[nextCell.x][nextCell.y] === grid[i][j]) {
                    // Merge tiles
                    grid[nextCell.x][nextCell.y] = 2* grid[i][j];
                    grid[i][j] = 0;
                }
            }
        }
    }
}



function isInBounds(row, col) {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

function updateGame(direction) {
    slideTiles(direction);
    mergeTiles(direction);
    const addedTiles = spawnRandomTile(2); // Track the number of tiles added
    updateGrid();

    if (checkWin(winCondition)) {
        showMessage("You Win!", "win-message");
    } else if (checkLose() && addedTiles === 0) {
        showMessage("Game Over", "lose-message");
    }
}

function showMessage(message, messageType) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.color = messageType === "win-message" ? "green" : "red";

}


function updateGrid() {
    // Update the PIXI display based on the updated grid state
    tileContainer.removeChildren();

    // Iterate through the grid and redraw the tiles
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] !== 0) {
                createTile(i, j, grid[i][j]);
            }
        }
    }
}

function drawGrid() {
    gridGraphics.clear();
    drawInitialGrid();

    // Iterate through the grid and redraw the tiles
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] !== 0) {
                createTile(i, j, grid[i][j]);
            }
        }
    }
}
