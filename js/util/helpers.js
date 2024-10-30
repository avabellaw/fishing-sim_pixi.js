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

export { CURSOR };