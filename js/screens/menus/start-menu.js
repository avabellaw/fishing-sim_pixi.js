import { Button, Label, SecondaryButton } from "./menu-items.js";
import gameObject from "../../game-object.js";
import Menu from "./menu.js";

class StartMenu extends Menu {
    constructor(screenManager) {
        super(screenManager);

        let label = new Label(0, 0, this.width - 100, 20, "Fishing Sim", 36, 0xffffff, "Tahoma");

        let startButton = new Button(0, 100, this.width - 100, 60, "Start Game", 0x3333ff, 0xaaaaaa);
        startButton.addClickHandler((e) => {
            screenManager.startGame();
            gameObject.playerHook.followPointer(e);
        });

        let shopButton = new SecondaryButton(0, 120 + startButton.height, this.width, "Shop");
        shopButton.addClickHandler((e) => {
            screenManager.showShop();
        });

        let leaderboardButton = new SecondaryButton(0, 140 + startButton.height + shopButton.height, this.width, "Leaderboard");
        leaderboardButton.addClickHandler((e) => {
            screenManager.showLeaderboard();
        });

        let cookie = document.cookie;
        if (cookie) {
            let coins = parseInt(cookie.split("=")[1]);
            gameObject.coins = coins;
        } else {
            gameObject.coins = 0;
        }

        let coinsLabel = new Label(3, label.height + 30, 75, 20, "Coins: " + gameObject.coins, 20);

        startButton.makeInteractive(this);
        leaderboardButton.makeInteractive(this);
        shopButton.makeInteractive(this);

        let mainContainer = this.addMenuItems([startButton, shopButton, leaderboardButton, coinsLabel, label]);
        this.centerElement(mainContainer);
        mainContainer.zIndex = 1;
        this.container.addChild(mainContainer);
    }

    async loadBackgroundSprite() {
        await PIXI.Assets.load("background").then(bgTexture => {
            bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            let bg = new PIXI.Sprite(bgTexture);
            bg.zIndex = -1;
            bg.x = -600;
            this.container.addChild(bg);
        });
    }
}

export { StartMenu };