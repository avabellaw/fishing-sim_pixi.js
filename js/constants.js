let width = 400, height = 500;
const SCALE = getScale();
const WIDTH = width * SCALE;
const HEIGHT = height * SCALE;

const BACKGROUND_SCALE = 2;

function getScale() {
    // Margin for both sides on smaller screens
    let gutter = 10;
    let vw = window.innerWidth - gutter;
    let vh = window.innerHeight;

    // Default scale
    let scale = 1.2;

    if (vw < 600) {
        scale = vw / width;
    }

    let gameContainerHeight = height + 60;
    if (scale * gameContainerHeight > vh) {
        scale = vh / gameContainerHeight;
    }

    return scale
}

export { WIDTH, HEIGHT, SCALE, BACKGROUND_SCALE };