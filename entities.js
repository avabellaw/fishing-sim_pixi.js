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
            app.stage.addChild(this.sprite);
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
            app.stage.addChild(this.sprite);
        });
    }

    removeEntity() {
        if (this.sprite != undefined) {
            app.stage.removeChild(this.sprite);
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
        this.text = text;
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

        app.stage.addChild(this.sprite);
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

        this.bottomImage = null;

        app.stage.addChild(this.backgroundContainer);
    }

    update(delta) {
        super.update(delta);

        if (gameObject.isEndGame) {
            if (this.bottomImage.y > HEIGHT - this.bottomImage.height) {
                this.bottomImage.y -= 1;
                this.bottomImage.update(delta);
            } else {
                if (!gameObject.showScoreScreen) this.showScoreScreen();
            }
        }
        if (!gameObject.showScoreScreen) this.background.tilePosition.y -= 1;
    }

    endGame() {
        PIXI.Assets.load("bottom").then((texture) => {
            this.bottomImage = new Entity(0, this.backgroundContainer.height, 200 * 2, 40 * 2);

            this.bottomImage.sprite = this.getSprite(texture);
            this.bottomImage.sprite.width = this.bottomImage.width;
            this.bottomImage.sprite.height = this.bottomImage.height;
            this.bottomImage.updateSprite();

            this.backgroundContainer.addChild(this.bottomImage.sprite);

            gameObject.isEndGame = true;
        });
    }

    showScoreScreen() {
        let gameOver = new TextEntity(0, 0, "Game Over", new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 50,
            fontWeight: "bold"
        }));

        // PIXI doesn't handle new lines correctly unless I manually add them like this.
        let scoreDetailsText = `Fish caught: ${gameObject.fishCaught}\nLongest streak: ${gameObject.longestStreak}\nFish missed: ${gameObject.fishMissed}\nBoots hit: ${gameObject.bootsHit}`;

        let score = new TextEntity(0, 0, "Score: " + gameObject.score, new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 30,
            fontWeight: "bold",
        }));

        let scoreDetails = new TextEntity(0, 0, scoreDetailsText.trim(), new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 20,
            align: "center",
        }));
        
        let scoreSprite = score.getSprite();
        let scoreDetailsSprite = scoreDetails.getSprite();
        let gameOverSprite = gameOver.getSprite();

        gameOverSprite.y = this.backgroundContainer.height / 3 - gameOverSprite.height;
        this.centerSpriteX(gameOverSprite);

        scoreSprite.y = gameOverSprite.y + gameOverSprite.height + 5;
        this.centerSpriteX(scoreSprite);

        scoreDetailsSprite.y = scoreSprite.y + scoreSprite.height + 15;
        this.centerSpriteX(scoreDetailsSprite);

        app.stage.addChild(gameOverSprite, scoreSprite, scoreDetailsSprite);
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
            if (this.y + this.speed + this.height > gameObject.bounds.maxY) {
                this.y = gameObject.bounds.maxY - this.height;
            } else {
                this.y += this.speed;
            }

        } else if (this.y > this.desiredY + this.speed / 2) {
            if (this.y - this.speed - this.height < gameObject.bounds.minY) {
                this.y = gameObject.bounds.minY;
            } else {
                this.y -= this.speed;
            }
        }

        if (this.x < this.desiredX - this.speed / 2) {
            if (this.x + this.speed + this.width > gameObject.bounds.maxX) {
                this.x = gameObject.bounds.maxX - this.width;
            } else {
                this.x += this.speed;
            }
        } else if (this.x > this.desiredX + this.speed / 2) {
            if (this.x - this.speed - this.width < gameObject.bounds.minX) {
                this.x = gameObject.bounds.minX;
            } else {
                this.x -= this.speed;
            }
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

        this.x = x + this.playerHook.width / 2;
        this.y = y;

        this.lineGraphics.clear();
        this.lineGraphics.lineStyle(this.lineThickness, 0x000000, 1);
        this.lineGraphics.moveTo(this.START_X, this.START_Y);
        this.lineGraphics.lineTo(this.x, this.y)
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