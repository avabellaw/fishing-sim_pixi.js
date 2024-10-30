import Background from '../entities/background.js';
import { CURSOR } from '../util/helpers.js';
import PlayerHook from '../entities/player-hook.js';
import gameObject from '../game-object.js';
import Screen from './screen.js';

let isRunning = false;

class GameScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        // PIXI container for all entity sprites
        this.container = new PIXI.Container();
        this.isRunning = false;

        this.init();

        isRunning = true;
        screenManager.addTicker(this.update.bind(this));
        this.addEventListeners();
        this.init()
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
    addEventListeners() {

        // Enable interactivity
        this.container.eventMode = 'static';

        // Make sure the whole canvas area is interactive
        this.container.hitArea = this.container.screen;

        this.container.addEventListener('pointermove', (e) => {
            gameObject.playerHook.followPointer(e);
        });

        this.container.addEventListener('pointerenter', (e) => {
            CURSOR.gamePointer();
        });

        this.container.addEventListener('pointerleave', (e) => {
            CURSOR.normal();
        });
    }
}

export { GameScreen };