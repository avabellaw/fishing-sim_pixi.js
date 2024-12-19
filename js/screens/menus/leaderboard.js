import Menu from "./menu.js";
import { SecondaryButton, Label } from "./menu-items.js";

class Leaderboard extends Menu {
    constructor(screenManager) {
        super(screenManager);
        // Background has already been loaded by the start menu
        let bgTexture = PIXI.Texture.from("background");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        let label = new Label(0, 0, this.width - 100, 20, "Leaderboard");

        let backButton = new SecondaryButton(0, 100, this.width, "Back");
        backButton.addClickHandler((e) => {
            screenManager.showStartMenu();
        });

        backButton.makeInteractive(this);

        let mainContainer = this.addMenuItems([backButton, label]);
        this.centerElement(mainContainer);

        this.container.addChild(mainContainer);
    }
}

export default Leaderboard;