import { StartMenu } from "./screens/menus/start-menu.js";
import { startLoadingEntitySprites } from "./util/assets.js";
import { GameScreen } from "./screens/game-screen.js";
import { WIDTH, HEIGHT } from "./constants.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.RESOLUTION = 1;
window.devicePixelRatio = 1;

const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    transparent: false,
    antialias: false,
});

document.getElementById("game-container").appendChild(app.view);

let gameScreen;

startLoadingEntitySprites();

function startGame() {
    app.stage.removeChild(startMenu.container);
    gameScreen = new GameScreen(app);
    gameScreen.addEventListeners(app);
    app.stage.addChild(gameScreen.container);
    gameScreen.init()
}

const startMenu = new StartMenu(startGame, WIDTH, HEIGHT);

app.stage.addChild(startMenu.container);