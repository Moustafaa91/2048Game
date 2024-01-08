function initializeGrid(gridSize) {
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 0;
        }
    }
}



document.getElementById('start-game').addEventListener('click', startGame);
// Function to start the game with user configurations
function startGame() {
    
    gridSize = parseInt(document.getElementById('grid-size').value, 10);
    winCondition = parseInt(document.getElementById('win-condition').value, 10);

    document.getElementById("message").textContent = "";
    gameOver = false;

    
    initializeGame(gridSize);
}



function createTile(x, y, value) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(tileColor);
    graphics.drawRect(0, 0, tileSize, tileSize);
    graphics.endFill();
    graphics.position.x = y * tileSize;  // Swap x and y
    graphics.position.y = x * tileSize;  // Swap x and y
    tileContainer.addChild(graphics);

    // Set the tile value
    grid[x][y] = value;

    // Display the value on the tile
    const text = new PIXI.Text(value.toString(), { fontSize: 30, fill: 0x000000 });
    text.position.x = tileSize / 2 - text.width / 2;  // Swap x and y
    text.position.y = tileSize / 2 - text.height / 2;  // Swap x and y
    graphics.addChild(text);
}

function getRandomEmptyCell() {
    const emptyCells = [];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }

    if (emptyCells.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function getEmptyCellCount() {
    let count = 0;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                count++;
            }
        }
    }

    return count;
}
function spawnRandomTile(times) {
    i = 0;
    while (i++ < times)
    {
        const emptyCell = getRandomEmptyCell();

        if (emptyCell) {
            const value = Math.random() < 0.5 ? 2 : 4; // 50% chance of 2, 50% chance of 4
            createTile(emptyCell.x, emptyCell.y, value);
        }
    }
}

// Draw the initial grid color
function drawInitialGrid(gridSize) {
    gridGraphics.clear();
    gridGraphics.lineStyle(2, gridColor);

    for (let i = 0; i <= gridSize; i++) {
        const x = i * tileSize;
        const y = i * tileSize;
        const limit = tileSize * gridSize;

        // Draw vertical lines
        if (x < app.screen.width) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, limit);
        }

        // Draw horizontal lines
        if (y < app.screen.height) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(limit, y);
        }
    }
}

function initializeGame(gridSize) {
    // Reset the game state and clear the existing PIXI elements
    gameOver = false;
    tileContainer.removeChildren();
    gridGraphics.clear();

    // Set up the game with the specified grid size and win condition
    initializeGrid(gridSize);
    drawInitialGrid(gridSize);
    spawnRandomTile(gridSize, gridSize);

}