import Screen from '../screen.js';
import { DEBUG } from '../../constants.js';

class Menu extends Screen {
    constructor(screenManager) {
        super(screenManager);
        this.width = screenManager.width;
        this.height = screenManager.height;
        if (DEBUG) console.log("Menu created");
    }

    static align = {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2
    }

    /**
     * Adds menu items to a container that's added to menu.
     * @param {MenuItem} menuItems Menu items to add to the menu
     * @returns The container that holds the menu items
     */
    addMenuItems(menuItems, alignment = Menu.align.CENTER) {
        let mainContainer = new PIXI.Container();
        let maxWidth = Math.max(...menuItems.map((menuItem) => menuItem.width));
        menuItems.forEach((menuItem) => {
            if (alignment === Menu.align.CENTER) {
                menuItem.itemContainer.x = (maxWidth - menuItem.width) / 2;
            }
             mainContainer.addChild(menuItem.itemContainer)
        });

        return mainContainer;
    }

    /**
     * Centers a MenuItem or PIXI.container vertically or horizontally.
     */
    centerElement(element, horizontally = true, vertically = true) {
        console.log(this.width);
        if (horizontally) element.x = this.width / 2 - element.width / 2;
        if (vertically) element.y = this.height / 2 - element.height / 2;
    }

    getBackgroundBoxGraphics(x, y, width, height, colour = 0x000000, alpha = 0.75) {
        let box = new PIXI.Graphics();
        box.beginFill(colour, alpha);
        box.drawRect(x, y, width, height);
        box.endFill();
        return box;
    }

    reRenderMenu(){
        // Re-render menu container to stage if anything changes.
        this.screenManager.render();
    }
}

export default Menu;