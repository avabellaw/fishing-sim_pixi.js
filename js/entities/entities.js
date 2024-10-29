import { WIDTH, HEIGHT, SCALE, BACKGROUND_SCALE } from "../constants.js";
import { gameObject } from "../game-object.js";

const entities = gameObject.entities;

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
    renderEntity(spriteName, container) {
        PIXI.Assets.load(spriteName).then((texture) => {
            this.sprite = this.getSprite(texture);

            this.sprite.x = this.x;
            this.sprite.y = this.y;

            this.sprite.width = this.width;
            this.sprite.height = this.height;
            container.addChild(this.sprite);
        });
    }

    removeEntity() {
        if (this.sprite != undefined) {
            gameObject.gameScreen.container.removeChild(this.sprite);
            this.sprite.destroy();
            this.sprite = undefined;
        }
        gameObject.entities.splice(gameObject.entities.indexOf(this), 1);
    }

    getMiddleX() {
        return WIDTH - this.width / 2;
    }

    getRandomX() {
        return Math.floor(Math.random() * (WIDTH - this.width));
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

        gameObject.addSpriteToContainer(this.sprite);
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
    constructor(gameObject) {
        super(0, 0, WIDTH, HEIGHT);
        this.gameObject = gameObject;
        this.backgroundContainer = new PIXI.Container();
        const bgTexture = PIXI.Texture.from('assets/sprites/background.webp');

        this.background = new PIXI.TilingSprite(
            bgTexture,
            WIDTH,
            HEIGHT,
        );

        this.background.tileScale.set(BACKGROUND_SCALE * SCALE);

        this.backgroundContainer.addChild(this.background);

        // Set up a filter to adjust the brightness of the background later.
        this.filter = new PIXI.ColorMatrixFilter();
        this.background.filters = [this.filter];

        this.bottomImage = null;
    }

    update(delta) {
        super.update(delta);

        if (this.gameObject.isEndGame) {
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
        if (!this.gameObject.showScoreScreen) this.background.tilePosition.y -= 1;
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

        if (!this.rendered) {
            // As soon as the entity is being used, render it.
            this.renderEntity(this.spriteName, gameObject.gameScreen.container);
            this.rendered = true;
        }

        if (gameObject.isEntityCollidingWithHook(this)) {
            this.caughtFish();
        }
    }

    caughtFish() {
        this.caughtObject();
        gameObject.entities.push(new FishPointsText(this.x, this.y, this.getPoints()));
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

        if (gameObject.isEntityCollidingWithHook(this)) {
            this.caught();
        }
    }
    caught() {
        entities.push(new LostPointsText(this.x, this.y, this.points));
        this.caughtObject();
    }
}

// END FISH

export { Entity, TextEntity, PointsText, FishPointsText, LostPointsText, Background, PassingObject, Fish, CommonFish, YellowFish, ClownFish, AltClownFish, SlowFish, Boot};