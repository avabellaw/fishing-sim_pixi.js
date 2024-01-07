const entities = [];

const WIDTH = 500, HEIGHT = 500;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.RESOLUTION = 1;
window.devicePixelRatio = 1;

let background;

let gameObject = {
    score:0,
    entitiesStack: [],
    update: function(delta, updates) {
        entities.forEach(entity => {
            entity.update(delta);
        });
        if(updates % 60 == 0) {
            addEntity(this.entitiesStack.pop());
        }
    },
    init: function() {
        for(let i = 0; i < 100; i++) {
            this.entitiesStack.push(getRandomFish());
        }
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

/**
 * Initializes the game display.
 */
function init() {
    app.renderer.view.style.position = "absolute";

    app.renderer.backgroundColor = "#FFFFFF";

    document.body.appendChild(app.view);


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
        gameObject.update(delta, updates);

        updates += delta;

        background.tilePosition.y -= 1;

        if(updates >= 60) {
            updates = 0;
        }
    });
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

function addEntity(entity) {
    entities.push(entity);
    app.stage.addChild(entity.sprite);
}