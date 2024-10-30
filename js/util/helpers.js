import { CommonFish, YellowFish, ClownFish, AltClownFish, SlowFish, Boot } from '../entities/fish.js';

// Change cursor style.
const CURSOR = {
    normal: () => {
        document.body.style.cursor = "default";
    },
    gamePointer: () => {
        document.body.style.cursor = 'url("assets/sprites/cursor.webp"),auto';
    },
    handPointer: () => {
        document.body.style.cursor = 'pointer';
    }
}

/**
 * Randomly selects a fish and returns it.
 * @returns {Fish} A random fish.
 */
function getRandomFish() {
    let randomNum = Math.floor(Math.random() * 100)

    if (randomNum < 50) {
        if (randomNum < 30) {
            return new CommonFish();
        } else {
            return new YellowFish();
        }
    } else if (randomNum < 80) {
        if (randomNum < 65) {
            return new ClownFish();
        } else {
            return new AltClownFish();
        }
    } else if (randomNum < 90) {
        return new SlowFish();
    } else {
        return new Boot();
    }
}

export { CURSOR, getRandomFish };