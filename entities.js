class Entity {
    /**
     * Creates a new entity.
     * @param {number} x The x position of the entity.
     * @param {number} y The y position of the entity.
     * @param {number} width The width of the entity.
     * @param {number} height The height of the entity.
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width * SCALE;
        this.height = height * SCALE;

        this.updates = 0;

        this.rendered = false;
    }

    getSprite(spriteTexture) {
        return PIXI.Sprite.from(spriteTexture);
    }

    addSprite(spriteLocation) {
        const texturePromise = PIXI.Assets.load(spriteLocation);

        texturePromise.then((resolvedTexture) => {
            this.sprite = this.getSprite(resolvedTexture);

            this.sprite.x = this.x;
            this.sprite.y = this.y;

            this.sprite.width = this.width;
            this.sprite.height = this.height;
            gameObject.stage.addChild(this.sprite);
        });
    }

    updateSprite() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    update(delta) {
        this.updates += delta;
        if (this.sprite != undefined) {
            this.updateSprite();
        }
        if (this.updates >= 60) {
            this.updates = 0;
        }
    }

    isCollidingWith(entity) {
        return this.x < entity.x + entity.width &&
            this.x + this.width > entity.x &&
            this.y < entity.y + entity.height &&
            this.y + this.height > entity.y;
    }

    // Use already rendered sprite or force it to render.
    renderEntity(spriteName) {
        PIXI.Assets.load(spriteName).then((texture) => {
            this.sprite = this.getSprite(texture);

            this.sprite.x = this.x;
            this.sprite.y = this.y;

            this.sprite.width = this.width;
            this.sprite.height = this.height;
            gameObject.stage.addChild(this.sprite);
        });
    }

    removeEntity() {
        if (this.sprite != undefined) {
            gameObject.stage.removeChild(this.sprite);
            this.sprite.destroy();
            this.sprite = undefined;
        }
        entities.splice(entities.indexOf(this), 1);
    }

    getMiddleX() {
        return WIDTH - this.width / 2;
    }

    getRandomX() {
        return Math.floor(Math.random() * (gameObject.bounds.maxX - this.width - gameObject.bounds.minX) + gameObject.bounds.minX);
    }
}

/**
 * A static text entity that is rendered on the screen.
 */
class TextEntity extends Entity {
    constructor(x, y, text, style) {
        super(x, y, 0, 0);
        this.sprite = new PIXI.Text(text, style);

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    getSprite() {
        return this.sprite;
    }

    update(delta) {
        super.update(delta);
    }
}

/**
 * Created when a fish is caught to display points gained.
 */
class PointsText extends TextEntity {
    constructor(x, y, text, style) {
        super(x, y, text, style);

        this.START_Y = this.y;
        this.speed = 3;

        gameObject.stage.addChild(this.sprite);
    }

    update() {
        super.update();
        this.y -= this.speed;


        if (this.START_Y - this.y > 80)
            this.sprite.alpha -= 0.03;

        if (this.y < 0 || this.sprite.alpha <= 0) {
            this.removeEntity();
        }
    }
}

class FishPointsText extends PointsText {
    constructor(x, y, points) {
        super(x, y, points, new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 25,
            fontWeight: "bold"
        }))
    }
}

class LostPointsText extends PointsText {
    constructor(x, y, points) {
        super(x, y, points, new PIXI.TextStyle({
            fill: "#ff0000",
            fontSize: 25,
            fontWeight: "bold"
        }))
    }
}

// BACKGROUND

class Background extends Entity {
    constructor() {
        super(0, 0, WIDTH, HEIGHT);
        this.backgroundContainer = new PIXI.Container();
        const bgTexture = PIXI.Texture.from('assets/sprites/background.webp');

        this.background = new PIXI.TilingSprite(
            bgTexture,
            app.screen.width,
            app.screen.height,
        );

        this.background.tileScale.set(BACKGROUND_SCALE * SCALE);

        this.backgroundContainer.addChild(this.background);

        // Set up a filter to adjust the brightness of the background later.
        this.filter = new PIXI.ColorMatrixFilter();
        this.background.filters = [this.filter];

        this.bottomImage = null;

        gameObject.stage.addChild(this.backgroundContainer);
    }

    update(delta) {
        super.update(delta);

        if (gameObject.isEndGame) {
            // Move the bottom bank image up until it's fully visible.
            if (this.bottomImage.y > HEIGHT - this.bottomImage.height) {
                this.bottomImage.y -= 1;
                this.bottomImage.update(delta);

                let finalBrightness = 0.4;

                // Reduce background brightness as the bottom bank image and score is revealed.
                this.filter.brightness(1 - (finalBrightness / this.bottomImage.height) *  (HEIGHT - this.bottomImage.y));
            } else {
                if (!gameObject.showScoreScreen) this.showScoreScreen();
            }
        }
        if (!gameObject.showScoreScreen) this.background.tilePosition.y -= 1;
    }

    endGame() {
        PIXI.Assets.load("bottom").then((texture) => {
            this.bottomImage = new Entity(0, this.backgroundContainer.height, 200 * BACKGROUND_SCALE, 100 * BACKGROUND_SCALE);

            this.bottomImage.sprite = this.getSprite(texture);
            this.bottomImage.sprite.width = this.bottomImage.width;
            this.bottomImage.sprite.height = this.bottomImage.height;
            this.bottomImage.updateSprite();

            this.backgroundContainer.addChild(this.bottomImage.sprite);

            gameObject.isEndGame = true;
        });
    }

    showScoreScreen() {
        let textColour = "0xffffff";
        let gameOver = new TextEntity(0, 0, "Game Over", new PIXI.TextStyle({
            fill: textColour,
            fontSize: 50,
            fontWeight: "bold"
        }));

        // PIXI doesn't handle new lines correctly unless I manually add them like this.
        let scoreDetailsText = `Fish caught: ${gameObject.fishCaught}\nLongest streak: ${gameObject.longestStreak}\nFish missed: ${gameObject.fishMissed}\nBoots hit: ${gameObject.bootsHit}`;

        let score = new TextEntity(0, 0, "Score: " + gameObject.score, new PIXI.TextStyle({
            fill: textColour,
            fontSize: 30,
            fontWeight: "bold",
        }));

        let scoreDetails = new TextEntity(0, 0, scoreDetailsText.trim(), new PIXI.TextStyle({
            fill: textColour,
            fontSize: 20,
            align: "center",
        }));

        // Create PIXI container
        let scoreScreenContainer = new PIXI.Container();  

        // Game over text
        let gameOverSprite = gameOver.getSprite();
        gameOverSprite.y = 0;
        scoreScreenContainer.addChild(gameOverSprite);  

        // Score text - 20px below game over text
        let scoreSprite = score.getSprite();
        scoreSprite.y = gameOverSprite.y + gameOverSprite.height + 20;
        scoreScreenContainer.addChild(scoreSprite);  

        // Score details text - 15px below score text
        let scoreDetailsSprite = scoreDetails.getSprite();
        scoreDetailsSprite.y = scoreSprite.y + scoreSprite.height + 15;
        scoreScreenContainer.addChild(scoreDetailsSprite);  

        // Position the score screen container 
        scoreScreenContainer.y = this.backgroundContainer.height / 2.5 - scoreScreenContainer.height / 2;

        // Center the container horizontally
        this.centerSpriteX(scoreScreenContainer);  
        
        // Center the sprites within the container horizontally
        gameOverSprite.x = scoreScreenContainer.width / 2 - gameOverSprite.width / 2;
        scoreSprite.x = scoreScreenContainer.width / 2 - scoreSprite.width / 2;
        scoreDetailsSprite.x = scoreScreenContainer.width / 2 - scoreDetailsSprite.width / 2;       

        // Add scoreScreen container to the stage
        gameObject.stage.addChild(scoreScreenContainer);
        gameObject.showScoreScreen = true;
    }

    centerSpriteX(sprite) {
        sprite.x = this.backgroundContainer.width / 2 - sprite.width / 2;
    }

}

// PASSING OBJECT

class PassingObject extends Entity {
    constructor(x, y, width, height, speed, spriteName, points) {
        super(x, y, width, height);

        this.x = this.getRandomX();
        this.spriteName = spriteName;

        this.points = points;
        this.speed = speed;
    }

    getPoints() {
        return parseInt(this.points + gameObject.streak * 0.05);
    }

    update(delta) {
        super.update(delta);

        if (!this.rendered) {
            // As soon as the entity is being used, render it.
            this.renderEntity(this.spriteName);
            this.rendered = true;
        }

        this.y -= this.speed;

        if (this.y < -this.height) {
            if (this instanceof Fish) {
                gameObject.fishMissed++;
            }
            this.removeEntity();
        }
    }

    caughtObject() {
        this.removeEntity();
        if (this instanceof Boot) {
            gameObject.bootsHit++;
            gameObject.streak = 0;
        }

        if (this instanceof Fish) {
            gameObject.fishCaught++;
        }


        if(++gameObject.streak > gameObject.longestStreak) {
            gameObject.longestStreak = gameObject.streak;
        }

        document.getElementById("streak").textContent = gameObject.streak;

        gameObject.addToScore(this.getPoints());
    }
}

// FISH

class Fish extends PassingObject {
    constructor(x, y, width, height, speed, spriteName, points) {
        super(x, y, width * 1.75, height * 1.75, speed * 1.70, spriteName, points);
    }

    update(delta) {
        super.update(delta);

        if (this.isCollidingWith(playerHook)) {
            this.caughtFish();
        }
    }

    caughtFish() {
        this.caughtObject();
        entities.push(new FishPointsText(this.x, this.y, this.getPoints()));
    }
}

class CommonFish extends Fish {
    constructor() {
        super(0, HEIGHT, 20, 18, 2.4, "commonFish", 4);
    }

    update(delta) {
        super.update(delta);
    }
}

class YellowFish extends Fish {
    constructor() {
        super(0, HEIGHT, 19, 18, 2.2, "yellowFish", 5);
    }

    update(delta) {
        super.update(delta);
    }
}

class ClownFish extends Fish {
    constructor() {
        super(0, HEIGHT, 29, 14, 2.5, "clownFish", 2);
    }

    update(delta) {
        super.update(delta);
    }
}

class AltClownFish extends Fish {
    constructor() {
        super(0, HEIGHT, 29, 14, 2.6, "altClownFish", 2);
    }

    update(delta) {
        super.update(delta);
    }
}

class SlowFish extends Fish {
    constructor() {
        super(0, HEIGHT, 30, 24, 1.5, "slowFish", 1);
    }

    update(delta) {
        super.update(delta);
    }
}

// BOOT

class Boot extends PassingObject {
    constructor() {
        super(0, HEIGHT, 35, 57, 2.5, "boot", -12);
    }

    update(delta) {
        super.update(delta);

        if (this.isCollidingWith(playerHook)) {
            this.caught();
        }
    }
    caught() {
        entities.push(new LostPointsText(this.x, this.y, this.points));
        this.caughtObject();
    }
}

// END FISH

// PLAYER HOOK

class PlayerHook extends Entity {
    constructor(speed) {
        super(WIDTH / 2, 0, 18 * 0.75, 36 * 0.75);

        this.desiredX = this.x;
        this.desiredY = this.y;
        this.hookLine = new HookLine(this, 2);
        this.speed = speed;

        // Adjust x for playerHook width
        this.x -= this.width / 2;
        this.addSprite("assets/sprites/hook.webp");
    }

    update() {
        super.update();
        this.hookLine.update(this.x, this.y);

        if (this.y < this.desiredY - this.speed / 2) {
            this.y = Math.min(this.y + this.speed, gameObject.bounds.maxY - this.height);
        } else if (this.y > this.desiredY + this.speed / 2) {
            this.y = Math.max(this.y - this.speed, gameObject.bounds.minY);
        }
        
        if (this.x < this.desiredX - this.speed / 2) {
            this.x = Math.min(this.x + this.speed, gameObject.bounds.maxX - this.width);
        } else if (this.x > this.desiredX + this.speed / 2) {
            this.x = Math.max(this.x - this.speed, gameObject.bounds.minX);
        }
    }

    followPointer(e) {
        this.desiredX = e.global.x - this.width / 2;
        this.desiredY = e.global.y - this.height / 2;
    }
}


/**
 * The fishing line that connects to the player hook.
 */
class HookLine extends Entity {
    constructor(playerHook, lineThickness) {
        super(WIDTH / 2 - lineThickness / 2, 0);

        this.playerHook = playerHook;
        this.lineThickness = lineThickness;

        this.START_X = this.x;
        this.START_Y = this.y;

        this.lineGraphics = new PIXI.Graphics();
        this.lineGraphics.lineStyle(lineThickness, 0xffd900, 1);
        this.lineGraphics.moveTo(this.x, this.y);
        this.lineGraphics.lineTo(this.x, this.y);

        app.stage.addChild(this.lineGraphics);
    }

    update(x, y) {
        super.update();

        const newX = x + this.playerHook.width / 2;
        const newY = y;

        // If moved, update the line
        if (this.x !== newX || this.y !== newY) {
            this.x = newX;
            this.y = newY;

            this.lineGraphics.clear();
            this.lineGraphics.lineStyle(this.lineThickness, 0x000000, 1);
            this.lineGraphics.moveTo(this.START_X, this.START_Y);
            this.lineGraphics.lineTo(this.x, this.y);
        }
    }
}

// END PLAYER HOOK

/**
 * Begins loading sprites in the background.
 */
function startLoadingEntitySprites() {
    // Default fish sprite location.
    const fishAssetsLocation = "assets/sprites/fish/";
    const sceneAssetsLocation = "assets/sprites/";

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