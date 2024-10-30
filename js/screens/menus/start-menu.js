import { Button, Label } from "./menu-items.js";
import { WIDTH } from '../../constants.js';
import { getCenterY } from '../../util/helpers.js';
import gameObject from "../../game-object.js";

class StartMenu {
    constructor(startGame, screens) {
        this.container = new PIXI.Container();

        let bgTexture = PIXI.Texture.from("assets/images/background.webp");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        let startButton = new Button(0, 0, WIDTH - 100, 60, "Start Game", 0x3333ff, 0xaaaaaa);
        startButton.addClickHandler((e) => {
            startGame();
            gameObject.playerHook.followPointer(e);
        });

        let label = new Label(0, 0, WIDTH - 100, 20, "Fishing Sim");
        startButton.itemContainer.y = 100;
        label.itemContainer.y = 0;

        startButton.makeInteractive();

        let mainContainer = new PIXI.Container();
        mainContainer.addChild(label.itemContainer);
        mainContainer.addChild(startButton.itemContainer);
        mainContainer.x = 50;
        mainContainer.y = getCenterY(mainContainer.height);

        this.container.addChild(mainContainer);
    }
}

export { StartMenu };