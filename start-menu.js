class StartMenu {
    constructor() {
        this.container = new PIXI.Container();

        let bgTexture = PIXI.Texture.from("assets/images/background.webp");
        bgTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        let bg = new PIXI.Sprite(bgTexture);
        bg.x = -600;
        this.container.addChild(bg);

        let btn = new Button(0, 0, WIDTH - 100, 60, "Start Game", 0x3333ff, 0xaaaaaa);
        let label = new Label(0, 0, WIDTH - 100, 20, "Fishing Sim");
        btn.itemContainer.y = 100;
        label.itemContainer.y = 0;

        btn.makeInteractive();

        let mainContainer = new PIXI.Container();
        mainContainer.addChild(label.itemContainer);
        mainContainer.addChild(btn.itemContainer);
        mainContainer.x = 50;
        mainContainer.y = getCenterY(mainContainer.height);

        this.container.addChild(mainContainer);
    }
}

class MenuItem {
    constructor(x, y, width, height) {
        this.itemContainer = new PIXI.Container();
        this.graphics = new PIXI.Graphics();

        this.itemContainer.x = x;
        this.itemContainer.y = y;
        this.width = width;
        this.height = height;

        this.itemContainer.addChild(this.graphics);
    }

    makeInteractive() {
        this.itemContainer.eventMode = 'static';
        this.itemContainer.cursor = 'pointer';
        this.itemContainer.on("pointerup", this.clicked);
        this.itemContainer.on("pointerover", this.hoveredOver);
        this.itemContainer.on("pointerout", this.hoveredOut);
    }

    moveTo(x, y) {
        this.itemContainer.x = x;
        this.itemContainer.y = y;
        this.redraw();
    }

    move(x, y) {
        this.itemContainer.x += x;
        this.itemContainer.y += y;
        this.redraw();
    }

    redraw() {
        this.graphics.clear();
        this.draw();
    }
}

class Button extends MenuItem {
    constructor(x, y, width, height, text, bgColour, outlineColour) {
        super(x, y, width, height);
        this.bgColour = bgColour;
        this.outlineColour = outlineColour;

        let buttonText = new MenuItemText(this, text);
        buttonText.centerText();
        this.alpha = 1;

        this.draw();
    }

    draw() {
        this.graphics.lineStyle(2, this.outlineColour, 1);
        this.graphics.beginFill(this.bgColour, this.alpha);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
    }

    clicked(e) {
        startGame();
        playerHook.followPointer(e);
    }

    hoveredOver() {
        this.alpha = 1;
    }

    hoveredOut() {
        this.alpha = 0.9;
    }
}

class Label extends MenuItem {
    constructor(x, y, width, height, text) {
        super(x, y, width, height);
        new MenuItemText(this, text).centerText();
    }

}

class MenuItemText {
    constructor(menuItem, text) {
        this.txt = new PIXI.Text(text, new PIXI.TextStyle({ fill: 0xFFFFFF }))
        this.menuItem = menuItem;
        menuItem.itemContainer.addChild(this.txt);
    }

    centerText() {
        this.centerHorizontally();
        this.centerVertically();
    }

    centerHorizontally() {
        this.txt.x = this.menuItem.width / 2 - this.txt.width / 2;
    }

    centerVertically() {
        this.txt.y = this.menuItem.height / 2 - this.txt.height / 2;
    }
}

function getCenterY(height) {
    return HEIGHT / 2 - height / 2;
}