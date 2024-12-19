import Background from '../entities/background.js';
import { CURSOR } from '../util/helpers.js';
import PlayerHook from '../entities/player-hook.js';
import gameObject from '../game-object.js';
import Screen from './screen.js';
import { DEBUG } from '../constants.js';

class GameScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        // PIXI container for all entity sprites
        this.container = new PIXI.Container();
        this.addEventListeners();
        this.init()
    }

    update(delta) {
        gameObject.update(delta);
        this.updates += delta;

        this.screenManager.render();
    }

    addToStage(container) {
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

        this.pointerMoveHandler = (e) => {
            gameObject.playerHook.followPointer(e);
        }

        this.pointerEnterHandler = (e) => {
            CURSOR.gamePointer();
        }

        this.pointerLeaveHandler = (e) => {
            CURSOR.normal();
        }

        this.container.on('pointermove', this.pointerMoveHandler);

        this.container.on('pointerenter', this.pointerEnterHandler);

        this.container.on('pointerleave', this.pointerLeaveHandler);
    }
}

export { GameScreen };