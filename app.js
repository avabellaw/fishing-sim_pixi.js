const entities = [];

const WIDTH = 500, HEIGHT = 500;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.RESOLUTION = 1;
window.devicePixelRatio = 1;

const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    transparent: false,
    antialias: false
});

init();

const FISH_TYPES = { commonFish: new CommonFish(), yellowFish: new YellowFish() };
let updates = 0;
let playerHook = new PlayerHook();
playerHook.x = WIDTH / 2 - playerHook.width / 2;
entities.push(playerHook);

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

// Game loop

function gameLoop(delta) {
    for (let entity of entities) {
        entity.update(delta);
    }

    console.log(elapsedMS);

    // if (updates >= 60) {
    //     if(Math.floor(Math.random() * 2) == 0) {
    //         addRandomFish();
    //     }

    //     updates = 0;
    // }
}

/**
 * Initializes the game display.
 */
function init() {
    app.renderer.view.style.position = "absolute";

    app.renderer.backgroundColor = "#FFFFFF";

    document.body.appendChild(app.view);

    let updates = 0;
    app.ticker.add(delta => {
        update(delta);

        updates += delta;

        if(updates >= 50) {
            if(Math.floor(Math.random() * 30) == 0){
                addRandomFish();
            }
        }

        if(updates >= 60) {
            updates = 0;
        }
    });
}

// Update

function update(delta) {
    for (let entity of entities) {
        entity.update(delta);
    }
}

// Helper functions

function getRandomFish() {
    switch (Math.floor(Math.random() * 2)) {
        case 0:
            return new CommonFish();
        case 1:
            return new YellowFish();
    }
}

function addRandomFish() {
    let fish = getRandomFish();
    entities.push(fish);
    app.stage.addChild(fish.sprite);
}