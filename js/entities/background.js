import Entity from "./entity.js";
import { WIDTH, HEIGHT, SCALE, BACKGROUND_SCALE } from "../constants.js";
import { TextEntity } from "./text-entity.js";

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

        if (this.gameObject.isEndGame && this.bottomImage) {
            // Move the bottom bank image up until it's fully visible.
            if (this.bottomImage.y > HEIGHT - this.bottomImage.height) {
                this.bottomImage.y -= 1;
                this.bottomImage.update(delta);

                let finalBrightness = 0.4;

                // Reduce background brightness as the bottom bank image and score is revealed.
                this.filter.brightness(1 - (finalBrightness / this.bottomImage.height) *  (HEIGHT - this.bottomImage.y));
            } else {
                if (!this.gameObject.showScoreScreen) this.showScoreScreen();
            }
        }
        if (!this.gameObject.showScoreScreen) this.background.tilePosition.y -= 1;
    }

    endGame() {
        PIXI.Assets.load("bottom").then(texture => {
            this.bottomImage = new Entity(0, this.backgroundContainer.height, 200 * BACKGROUND_SCALE, 100 * BACKGROUND_SCALE);

            this.bottomImage.sprite = this.getSprite(texture);
            this.bottomImage.sprite.width = this.bottomImage.width;
            this.bottomImage.sprite.height = this.bottomImage.height;
            this.bottomImage.updateSprite();

            this.backgroundContainer.addChild(this.bottomImage.sprite);

            this.gameObject.isEndGame = true;
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
        let scoreDetailsText = `Fish caught: ${this.gameObject.fishCaught}\nLongest streak: ${this.gameObject.longestStreak}\nFish missed: ${this.gameObject.fishMissed}\nBoots hit: ${this.gameObject.bootsHit}`;

        let score = new TextEntity(0, 0, "Score: " + this.gameObject.score, new PIXI.TextStyle({
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
        this.gameObject.addSpriteToContainer(scoreScreenContainer);
        this.gameObject.showScoreScreen = true;
    }

    centerSpriteX(sprite) {
        sprite.x = this.backgroundContainer.width / 2 - sprite.width / 2;
    }

}

export default Background;