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

class Screen {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.currentScreen = new StartMenu(this);
        app.stage.addChild(this.currentScreen.container);
    }

    switchScreen(newScreen) {
        app.stage.removeChild(this.currentScreen.container);
        app.stage.addChild(newScreen.container);
        this.currentScreen = newScreen;
    }

    startGame() {
        this.switchScreen(new GameScreen(app));
    }
}

startLoadingEntitySprites();

new Screen(WIDTH, HEIGHT);
