const entities = [];


let width = 400, height = 500;
const SCALE = getScale();
const WIDTH = width * SCALE;
const HEIGHT = height * SCALE;

const BACKGROUND_SCALE = 2;

let playerHook;
let isRunning = false;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.RESOLUTION = 1;
window.devicePixelRatio = 1;

// Change cursor style.
const CURSOR = {
    normal: () => {
        document.body.style.cursor = "default";
    },
    gamePointer: () => {
        document.body.style.cursor = 'url("assets/sprites/cursor.webp"),auto';
    },
    handPointer: () => {
        document.body.style.cursor = 'pointer';
    }
}

let gameObject = {
    // PIXI container for all entity sprites
    stage: new PIXI.Container(),
    score: 0,
    streak: 0,
    longestStreak: 0,
    fishCaught: 0,
    fishMissed: 0,
    bootsHit: 0,
    entitiesStack: [],
    bounds: {
        minX: 0,
        maxX: WIDTH,
        minY: 0,
        maxY: HEIGHT
    },
    spawnObjectCoolOff: 10,
    spawnCounter: 0,
    isEndGame: false,
    showScoreScreen: false,
    update: function (delta, updates) {
        entities.forEach(entity => {
            entity.update(delta);
        });

        if (this.entitiesStack.length > 0 &&
            this.spawnCounter++ >= this.spawnObjectCoolOff + (this.entitiesStack.length * 0.3)) {
            addEntity(this.entitiesStack.pop());
            this.spawnCounter = 0;
        } else if (this.entitiesStack.length === 0 && !this.isEndGame && this.numberOfPassingObjects() === 0) {
            this.background.endGame();
        }
    },
    init: function () {
        app.stage.addChild(this.stage);
        for (let i = 0; i < 10; i++) {
            this.entitiesStack.push(getRandomFish());
        }
    },
    addToScore: function (points) {
        this.score += points;
        document.getElementById("score").innerText = Math.round(this.score);
    },
    numberOfPassingObjects: function () {
        return entities.filter(entity => entity instanceof PassingObject).length;
    }
}

const app = new PIXI.Application({
            width: WIDTH,
            height: HEIGHT,
            transparent: false,
            antialias: false,
        });

document.getElementById("game-container").appendChild(app.view);
        
        startLoadingEntitySprites();

const startMenu = new StartMenu();
        
app.stage.addChild(startMenu.container);

function startGame() {
    app.stage.removeChild(startMenu.container);

    CURSOR.gamePointer();

    initGame();

    addEventListeners();

    isRunning = true;
}

/**
 * Initializes the game display and the game object.
 */
function initGame() {
    gameObject.background = new Background();
    entities.push(gameObject.background);
    gameObject.init();

    let updates = 0;
    app.ticker.add(delta => {
        if (isRunning) {
            gameObject.update(delta, updates);

            updates += delta;

            if (updates >= 60) {
                updates = 0;
            }
        }
    });

    addPlayerHook();
}

/**
 * Adds event listeners to the canvas.
 */
function addEventListeners() {

    // Enable interactivity
    app.stage.eventMode = 'static';

    // Make sure the whole canvas area is interactive
    app.stage.hitArea = app.screen;

    app.stage.addEventListener('pointermove', (e) => {
        playerHook.followPointer(e);
    });

    app.stage.addEventListener('pointerenter', (e) => {
        CURSOR.gamePointer();
    });

    app.stage.addEventListener('pointerleave', (e) => {
        CURSOR.normal();
    });
}

/**
 * Adds the player hook to the game.
 */
function addPlayerHook() {
    playerHook = new PlayerHook(10);
    entities.push(playerHook);
}

// Helper functions

/**
 * Randomly selects a fish and returns it.
 * @returns {Fish} A random fish.
 */
function getRandomFish() {
    let randomNum = Math.floor(Math.random() * 100)

    if (randomNum < 50) {
        if (randomNum < 30) {
            return new CommonFish();
        } else {
            return new YellowFish();
        }
    } else if (randomNum < 80) {
        if (randomNum < 65) {
            return new ClownFish();
        } else {
            return new AltClownFish();
        }
    } else if (randomNum < 90) {
        return new SlowFish();
    } else {
        return new Boot();
    }
}

/**
 * Add an entity to the game.
 * @param {Entity} The entity to add 
 */
function addEntity(entity) {
    entities.push(entity);
}

function getScale() {
    // Margin for both sides on smaller screens
    let gutter = 10;
    let vw = window.innerWidth - gutter;
    let vh = window.innerHeight;

    // Default scale
    let scale = 1.2;

    if (vw < 600) {
        scale = vw / width;
    }

    let gameContainerHeight = height + 60;
    if (scale * gameContainerHeight > vh) {
        scale = vh / gameContainerHeight;
    }

    return scale
}