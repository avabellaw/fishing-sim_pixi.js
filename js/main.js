import { StartMenu } from "./screens/menus/start-menu.js";
import { startLoadingEntitySprites } from "./util/assets.js";
import { GameScreen } from "./screens/game-screen.js";
import Leaderboard from "./screens/menus/leaderboard.js";
import { WIDTH, HEIGHT } from "./constants.js";
import { DEBUG } from "./constants.js";
import Shop from "./screens/menus/shop.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.RESOLUTION = 1;
window.devicePixelRatio = 1;

const renderer = new PIXI.Renderer({
    width: WIDTH,
    height: HEIGHT,
    transparent: false,
    antialias: false,
});

const stage = new PIXI.Container();
stage.sortableChildren = true;
const ticker = new PIXI.Ticker();

class ScreenManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.currentScreen = new StartMenu(this);
        this.currentScreen.loadBackgroundSprite().then(() => {
            stage.addChild(this.currentScreen.container);
            this.menus = {"start": this.currentScreen};
            this.renders = 0;
            ticker.add(this.update.bind(this));
    
            this.render();

            /* 
                Add the renderer to the DOM.
                (Now that the start menu has been loaded)
            */
            document.getElementById("game-container").appendChild(renderer.view);
        });
    }

    update() {
        // Calls the currentScreen's update method. Must be started when needed.
        this.currentScreen.update();
    }

    startTicker() {
        ticker.start();
    }

    stopTicker() {
        ticker.stop();
    }
    
    switchScreen(newScreen) {
        this.stopTicker();
        stage.removeChild(this.currentScreen.container);
        stage.addChild(newScreen.container);
        this.currentScreen = newScreen;
        this.render();
    }

    render() {
        this.renders += 1;
        renderer.render(stage);
    }

    startGame() {
        this.switchScreen(new GameScreen(this));

        // Start the ticker that will call the update method.
        ticker.start();
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

    showShop() {
        if (!this.menus["shop"]) {
            this.menus["shop"] = new Shop(this);
        }
        this.switchScreen(this.menus["shop"]);
    }
}

startLoadingEntitySprites();

// Renderer is added to the DOM in screen manager constructor.

new ScreenManager(WIDTH, HEIGHT);
