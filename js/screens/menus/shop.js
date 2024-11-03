import Menu from "./menu.js";
import { Label, SecondaryButton } from "./menu-items.js";

class Shop extends Menu {
    constructor(screenManager) {
        super(screenManager);
        let bgTexture = PIXI.Texture.from("assets/images/background.webp");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        // let backButton = new SecondaryButton(0, 0, this.width, "Back");
        // backButton.addClickHandler((e) => {
        //     screenManager.showStartMenu();
        // });

        // backButton.makeInteractive();

        // Item positionings
        let boxBorder = 20;
        let titleBoxWidth = this.width - boxBorder * 2;
        let titleBox = this.getTitleBox(boxBorder, titleBoxWidth, boxBorder);

        let boxHeight = this.height - titleBox.y - titleBox.height - boxBorder * 2;
        let boxWidth = this.width - boxBorder * 2;
        let box = this.getBackgroundBoxGraphics(boxBorder, boxBorder + titleBox.height + boxBorder, boxWidth, boxHeight);

        let mainContainer = new PIXI.Container();

        mainContainer.addChild(titleBox, box);

        this.container.addChild(mainContainer);
    }

    getTitleBox(padding, titleBoxWidth, boxBorder) {
        let title = new Label(padding, padding, titleBoxWidth - padding * 2, 20, "SHOP");
        let titleCaption = new Label(padding, padding + title.height + 10, titleBoxWidth - padding * 2, 20, "Spend hard earned coins to catch ya more fish!", 16);
    
        let titleBox = new PIXI.Container();
        titleBox.y = boxBorder;
        titleBox.x = boxBorder;
    
        let titleBoxHeight = 10 + 50 + title.height + titleCaption.height;
    
        let titleBoxBg = this.getBackgroundBoxGraphics(0, 0, titleBoxWidth, titleBoxHeight);
        titleBox.addChild(titleBoxBg, title.itemContainer, titleCaption.itemContainer);
    
        return titleBox;
    }
}

export default Shop;