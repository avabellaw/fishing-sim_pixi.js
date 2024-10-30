class Menu {
    constructor(width, height) {
        this.container = new PIXI.Container();
        this.width = width;
        this.height = height;
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
        this.container.addChild(mainContainer);

        return mainContainer;
    }

    /**
     * Centers a MenuItem or PIXI.container vertically.
     */
    centerElement(element, horizontally = true, vertically = true) {
        if (horizontally) element.x = this.width / 2 - element.width / 2;
        if (vertically) element.y = this.height / 2 - element.height / 2;
    }
}

export default Menu;