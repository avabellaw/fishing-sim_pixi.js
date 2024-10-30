import { Button, Label } from "./menu-items.js";
import gameObject from "../../game-object.js";
import Menu from "./menu.js";
import { WIDTH } from "../../constants.js";

class StartMenu extends Menu {
    constructor(startGame, screenWidth, screenHeight) {
        super(screenWidth, screenHeight);
        let bgTexture = PIXI.Texture.from("assets/images/background.webp");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        let startButton = new Button(0, 0, this.width - 100, 60, "Start Game", 0x3333ff, 0xaaaaaa);
        startButton.addClickHandler((e) => {
            startGame();
            gameObject.playerHook.followPointer(e);
        });

        let label = new Label(0, 0, this.width - 100, 20, "Fishing Sim");
        startButton.itemContainer.y = 100;
        label.itemContainer.y = 0;

        startButton.makeInteractive();

        let mainContainer = this.addMenuItems([startButton, label]);
        this.centerElement(mainContainer);

        this.container.addChild(mainContainer);
    }
}

export { StartMenu };