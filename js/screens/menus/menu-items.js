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
        // Using .bind(this) to ensure that the correct context is used when calling the function
        this.itemContainer.on("pointerover", this.hoveredOver.bind(this));
        this.itemContainer.on("pointerout", this.hoveredOut.bind(this));
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

    addClickHandler(handler) {
        this.clicked = handler;
    }

    hoveredOver() {
        this.alpha = 1;
    }

    hoveredOut() {
        this.alpha = 0.9;
    }
}

class SecondaryButton extends Button {
    constructor(x, y, menuWidth, text) {
        super(x, y, menuWidth - 120, 50, text, 0x222222, 0xffffff);
    }

    hoveredOver() {
        super.hoveredOver();
        this.bgColour = 0x000000;
        super.redraw();
    }

    hoveredOut() {
        super.hoveredOut();
        this.bgColour = 0x222222;
        this.redraw();
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

export { Button, Label, SecondaryButton };