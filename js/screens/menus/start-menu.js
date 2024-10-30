import { Button, Label, SecondaryButton } from "./menu-items.js";
import gameObject from "../../game-object.js";
import Menu from "./menu.js";

class StartMenu extends Menu {
    constructor(screenManager) {
        super(screenManager);
        let bgTexture = PIXI.Texture.from("assets/images/background.webp");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        let label = new Label(0, 0, this.width - 100, 20, "Fishing Sim");

        let startButton = new Button(0, 100, this.width - 100, 60, "Start Game", 0x3333ff, 0xaaaaaa);
        startButton.addClickHandler((e) => {
            screenManager.startGame();
            gameObject.playerHook.followPointer(e);
        });

        let leaderboardButton = new SecondaryButton(0, 120 + startButton.height, this.width, "Leaderboard");
        leaderboardButton.addClickHandler((e) => {
            screenManager.showLeaderboard();
        });

        startButton.makeInteractive();
        leaderboardButton.makeInteractive();

        let mainContainer = this.addMenuItems([startButton, leaderboardButton, label]);
        this.centerElement(mainContainer);

        this.container.addChild(mainContainer);
        
        let cookie = document.cookie;
        if (cookie){
            let cookieArray = cookie.split("=");
            let coins = parseInt(cookieArray[1]);
            let coinsLabel = new Label(15, 15, 100, 20, "Coins: " + coins);
            this.container.addChild(coinsLabel.itemContainer);
            gameObject.coins = coins;
        } else {
            gameObject.coins = 0;
        }
    }
}

export { StartMenu };