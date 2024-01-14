class StartMenu {
    constructor() {
        this.container = new PIXI.Container();

        let btn = new Button(50, 50, WIDTH - 100, 60, "Start Game", this);
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

        this.itemContainer.addChild(this.graphics);
        startMenu.container.addChild(this.itemContainer);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.redraw();
    }

    move(x, y) {
        this.x += x;
        this.y += y;
        this.redraw();
    }

    redraw() {
        this.graphics.clear();
        this.draw();
    }
}

class Button extends MenuItem {
    constructor(x, y, width, height, text, startMenu) {
        super(x, y, width, height, startMenu);

        this.y = getCenterY(this.height);
       
        let buttonText = new MenuItemText(this, "Start Game");
        buttonText.centerText();

        this.draw();
    }

    draw() {
        this.graphics.lineStyle(2, 0xFEEB77, 1);
        this.graphics.beginFill(0x650A5A);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
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