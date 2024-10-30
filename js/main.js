import { StartMenu } from "./screens/menus/start-menu.js";
import { startLoadingEntitySprites } from "./util/assets.js";
import { GameScreen } from "./screens/game-screen.js";
import Leaderboard from "./screens/menus/leaderboard.js";
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

class ScreenManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.currentScreen = new StartMenu(this);
        app.stage.addChild(this.currentScreen.container);
        this.menus = {"start": this.currentScreen};
    }

    addTicker(updateMethod) {
        app.ticker.add(updateMethod);
    }

    switchScreen(newScreen) {
        app.stage.removeChild(this.currentScreen.container);
        app.stage.addChild(newScreen.container);
        this.currentScreen = newScreen;
    }

    startGame() {
        this.switchScreen(new GameScreen(this));
    }

    showLeaderboard() {
        // Use already loaded leaderboard if it exists
        if (!this.menus["leaderboard"]) {
            this.menus["leaderboard"] = new Leaderboard(this);
        }
        this.switchScreen(this.menus["leaderboard"]);
    }

    showStartMenu() {
        if (!this.menus["start"]) {
            this.menus["start"] = new StartMenu(this);
        }
        this.switchScreen(this.menus["start"]);
    }
}

startLoadingEntitySprites();

new ScreenManager(WIDTH, HEIGHT);
