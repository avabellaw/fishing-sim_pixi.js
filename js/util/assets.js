/**
 * Begins loading sprites in the background.
 */
function startLoadingEntitySprites() {
    // Default fish sprite location.
    const fishAssetsLocation = "../../assets/sprites/fish/";
    const sceneAssetsLocation = "../../assets/sprites/";

    // Key: Sprite name to access it, Value: Sprite filename
    const fishSpriteData = {
        "commonFish": "common",
        "yellowFish": "yellow",
        "clownFish": "clown",
        "altClownFish": "alt-clown",
        "slowFish": "slow",
        "boot": "boot"
    };

    const sceneSpriteData = {
        "bottom": "bottom"
    }

    // Add all fish sprites to the loader from the object.
    for (const [key, filename] of Object.entries(fishSpriteData)) {
        PIXI.Assets.add(key, fishAssetsLocation + filename + ".webp");
    }

    for (const [key, filename] of Object.entries(sceneSpriteData)) {
        PIXI.Assets.add(key, sceneAssetsLocation + filename + ".webp");
    }

    // Load all sprites in the background using the key/sprite name.
    PIXI.Assets.backgroundLoad(Object.keys(fishSpriteData), Object.keys(sceneSpriteData));
}

export { startLoadingEntitySprites };