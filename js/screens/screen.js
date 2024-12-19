class Screen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        // PIXI container for all entity sprites
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
    }

    update(delta) {
        throw new Error("Method 'update()' called without implementation.");
    }
}

export default Screen;