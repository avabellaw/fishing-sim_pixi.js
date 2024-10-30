class Screen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        // PIXI container for all entity sprites
        this.container = new PIXI.Container();
    }
}

export default Screen;