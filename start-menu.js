class StartMenu {
    constructor() {
        this.container = new PIXI.Container();

        let btn = new Button(50, 50, WIDTH - 100, 60, "Start Game", 0x3333ff, 0xffffff, this);
        btn.moveTo(50, getCenterY(btn.height));
        btn.makeInteractive();
    }
}

class MenuItem {
    constructor(x, y, width, height, startMenu) {
        this.itemContainer = new PIXI.Container();
        this.graphics = new PIXI.Graphics();

        this.itemContainer.x = x;
        this.itemContainer.y = y;
        this.width = width;
        this.height = height;

        this.isHoveredOver = false;

        this.itemContainer.addChild(this.graphics);
        startMenu.container.addChild(this.itemContainer);
    }

    makeInteractive() {
        this.itemContainer.eventMode = 'static';
        this.itemContainer.cursor = 'pointer';
        this.itemContainer.on("pointerup", this.clicked);
    }

    setHoveredOver(isHoveredOver) {
        this.isHoveredOver = isHoveredOver;
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

    isWithinBounds(x, y) {
        console.log(x);
        console.log("must be greater than " + this.itemContainer.x + " less than " + this.width);
        if (x >= this.itemContainer.x && x <= this.itemContainer.x + this.width && y >= this.itemContainer.y && y <= this.itemContainer.y + this.height)
            return true;
        else
            return false;
    }
}

class Button extends MenuItem {
    constructor(x, y, width, height, text, bgColour, outlineColour, startMenu) {
        super(x, y, width, height, startMenu);
        this.bgColour = bgColour;
        this.outlineColour = outlineColour;

        let buttonText = new MenuItemText(this, text);
        buttonText.centerText();

        this.draw();
    }

    draw() {
        this.graphics.lineStyle(2, this.outlineColour, 1);
        this.graphics.beginFill(this.bgColour);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
    }

    clicked() {
        startGame();
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