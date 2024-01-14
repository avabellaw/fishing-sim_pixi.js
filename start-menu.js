class StartMenu {
    constructor() {
        this.container = new PIXI.Container();

        let btn = new Button(50, 50, WIDTH - 100, 60, this);
        btn.moveTo(50, 50);
    }
}

class MenuItem {
    constructor(x, y, width, height, startMenu) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.itemContainer = new PIXI.Container();
        this.graphics = new PIXI.Graphics();

        this.itemContainer.addChild(this.graphics);
        startMenu.container.addChild(this.itemContainer);
    }

    moveTo(x, y){
        this.x = x;
        this.y = y;
        this.redraw();
    }
}

class Button extends MenuItem {
    constructor(x, y, width, height, startMenu) {
        super(x, y, width, height, startMenu);

        this.y = getCenterY(this.height);

        this.draw();
    }

    draw(){
        this.graphics.lineStyle(2, 0xFEEB77, 1);
        this.graphics.beginFill(0x650A5A);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
        this.graphics.endFill();
    }

    redraw = ()=> {
        this.graphics.clear();
        this.draw();
    }
}

function getCenterY(height){
    return HEIGHT / 2 - height / 2;
}