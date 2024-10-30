// Set width and height of the game prior to scaling
let width = 400, height = 500;

// Export the scale used to scale with the viewport
export const SCALE = getScale();

// Export the scaled width and height of the game
export const WIDTH = width * SCALE;
export const HEIGHT = height * SCALE;

// Export background scale
export const BACKGROUND_SCALE = 2;

export const DEBUG = true;

/**
 * Scales based on viewport width and height.
 * @returns {number} The scale to use for the game canvas.
 */
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