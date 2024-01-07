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

app.renderer.view.style.position = "absolute";

app.renderer.backgroundColor = "#FFFFFF";

document.body.appendChild(app.view);

app.ticker.add(delta => gameLoop(delta));

entities.push(new CommonFish());

let updates = 0;

function gameLoop(delta) {
    for (let entity of entities) {
        entity.update(delta);
    }
}