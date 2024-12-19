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
        "bottom": "bottom",
        "playerHook": "hook",
    }

    // Add all fish sprites to the loader from the object.
    addSpritesToLoader(fishSpriteData, fishAssetsLocation);

    addSpritesToLoader(sceneSpriteData, sceneAssetsLocation);

    // Load all sprites in the background using the key/sprite name.
    PIXI.Assets.backgroundLoad(Object.keys(fishSpriteData), Object.keys(sceneSpriteData));
}

function addSpritesToLoader(spriteData, location){
    for (const [key, filename] of Object.entries(spriteData)) {
        PIXI.Assets.add(key, location + filename + ".webp");
    }
}

export { startLoadingEntitySprites };