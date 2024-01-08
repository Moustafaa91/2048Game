

const app = new PIXI.Application({
    width: 680,
    height: 680,
    backgroundColor: 0xFFFFFF,
});

document.getElementById('game-container').appendChild(app.view);

let gridSize = 0;
let winCondition = 0;
const grid = [];
const tileSize = 80;
const gridColor = 0x00008B;
const tileColor = 0xADD8E6;

const tileContainer = new PIXI.Container();
app.stage.addChild(tileContainer);

const gridContainer = new PIXI.Container();
app.stage.addChild(gridContainer);

const gridGraphics = new PIXI.Graphics();
app.stage.addChild(gridGraphics);

let gameOver = false;
let isProcessingKeyPress = false;


