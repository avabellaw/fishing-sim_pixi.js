import { Background } from '../entities/entities.js';
import { CURSOR, getRandomFish } from '../util/helpers.js';
import { PlayerHook } from '../entities/player-hook.js';
import { gameObject } from '../game-object.js';

let isRunning = false;

class GameScreen {
    constructor(app) {
        this.app = app;
        // PIXI container for all entity sprites
        this.container = new PIXI.Container();
        this.isRunning = false;

        this.init();

        isRunning = true;
        this.app.ticker.add(this.update.bind(this));
    }

    update(delta) {
        gameObject.update(delta);
    }

    addContainerToStage(container) {
        this.container.addChild(container);
    }

    /**
     * Initializes the game display and the game object.
     */
    init() {
        CURSOR.gamePointer();

        gameObject.gameScreen = this;
        gameObject.background = new Background(gameObject);
        this.addPlayerHook();

        this.container.addChild(gameObject.background.backgroundContainer, gameObject.playerHook.container);
        gameObject.addEntity(gameObject.background);
        gameObject.init();

        let updates = 0;
    }

        
    /**
     * Adds the player hook to the game.
     */
    addPlayerHook() {
        gameObject.playerHook = new PlayerHook(10);
        gameObject.addEntity(gameObject.playerHook);
    }

    /**
     * Adds event listeners to the canvas.
     */
    addEventListeners(app) {

        // Enable interactivity
        app.stage.eventMode = 'static';

        // Make sure the whole canvas area is interactive
        app.stage.hitArea = app.screen;

        app.stage.addEventListener('pointermove', (e) => {
            gameObject.playerHook.followPointer(e);
        });

        app.stage.addEventListener('pointerenter', (e) => {
            CURSOR.gamePointer();
        });

        app.stage.addEventListener('pointerleave', (e) => {
            CURSOR.normal();
        });
    }
}

export { GameScreen };