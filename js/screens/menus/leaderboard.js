class Leaderboard extends Menu {
    constructor(screenWidth, screenHeight) {
        super(screenWidth, screenHeight);
        let bgTexture = PIXI.Texture.from("assets/images/background.webp");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        let label = new Label(0, 0, this.width - 100, 20, "Leaderboard");

        let backButton = new SecondaryButton(0, 100, this.width, "Back");
        backButton.addClickHandler((e) => {
            gameObject.startMenu();
        });

        backButton.makeInteractive();

        let mainContainer = this.addMenuItems([backButton, label]);
        this.centerElement(mainContainer);

        this.container.addChild(mainContainer);
    }
}

export default Leaderboard;