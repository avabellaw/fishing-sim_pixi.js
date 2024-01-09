const entities = [];

const WIDTH = 500, HEIGHT = 500;

let playerHook;
let isRunning = false;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.RESOLUTION = 1;
window.devicePixelRatio = 1;

let background;

let gameObject = {
    score: 0,
    entitiesStack: [],
    update: function (delta, updates) {
        entities.forEach(entity => {
            entity.update(delta);
        });

        if (updates % 60 == 0 && this.entitiesStack.length > 0) {
            addEntity(this.entitiesStack.pop());
        }
    },
    init: function () {
        for (let i = 0; i < 100; i++) {
            this.entitiesStack.push(getRandomFish());
        }
    },
    addToScore: function (points) {
        this.score += points;
        document.getElementById("score").innerText = this.score;
    }
}

const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    transparent: false,
    antialias: false
});

init();

const FISH_TYPES = { commonFish: new CommonFish(), yellowFish: new YellowFish() };

addPlayerHook();

addEventListeners();

isRunning = true;

/**
 * Initializes the game display and the game object.
 */
function init() {
    document.getElementById("score-container").style.maxWidth = WIDTH;

    app.renderer.backgroundColor = "transparent";

    const texture = PIXI.Texture.from('assets/sprites/background.webp');

    const background = new PIXI.TilingSprite(
        texture,
        app.screen.width,
        app.screen.height,
    );

    background.tileScale.x = 2.5;
    background.tileScale.y = 2.5;

    app.stage.addChild(background);

    gameObject.init();

    let updates = 0;
    app.ticker.add(delta => {
        if(isRunning){
            gameObject.update(delta, updates);

            updates += delta;
    
            background.tilePosition.y -= 1;
    
            if (updates >= 60) {
                updates = 0;
            }
        }
    });

    document.getElementById("game-container").appendChild(app.view);
}

/**
 * Adds event listeners to the canvas.
 */
function addEventListeners() {
    // Mouse events
    const CANVAS = document.getElementsByTagName("canvas")[0];
    CANVAS.onmousemove = function (event) {
        playerHook.x = event.offsetX - playerHook.width / 2;
        playerHook.y = event.offsetY - playerHook.height / 2;
    };

    CANVAS.onmouseenter = function (event) {
        document.body.style.cursor = "none";
    };

    CANVAS.onmouseleave = function (event) {
        document.body.style.cursor = "default";
    };
}

/**
 * Adds the player hook to the game.
 */
function addPlayerHook() {
    playerHook = new PlayerHook();
    entities.push(playerHook);
}

// Helper functions

/**
 * Randomly selects a fish and returns it.
 * @returns {Fish} A random fish.
 */
function getRandomFish() {
    switch (Math.floor(Math.random() * 2)) {
        case 0:
            return new CommonFish();
        case 1:
            return new YellowFish();
    }
}

/**
 * Add an entity to the game.
 * @param {Entity} The entity to add 
 */
function addEntity(entity) {
    entities.push(entity);
    app.stage.addChild(entity.sprite);
}