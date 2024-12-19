import { WIDTH, SCALE } from "../constants.js";
import gameObject from "../game-object.js";
import {DEBUG} from "../constants.js";

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
        if (this.sprite != undefined && (this.x !== this.sprite.x || this.y !== this.sprite.y)) {
            this.updateSprite();
        }
    }

    isCollidingWith(entity) {
        return this.x < entity.x + entity.width &&
            this.x + this.width > entity.x &&
            this.y < entity.y + entity.height &&
            this.y + this.height > entity.y;
    }

    loadAndAddSprite(spriteName) {
        PIXI.Assets.load(spriteName).then((texture) => {
            this.sprite = this.getSprite(texture);

            this.sprite.x = this.x;
            this.sprite.y = this.y;

            this.sprite.width = this.width;
            this.sprite.height = this.height;
            gameObject.addSpriteToContainer(this);
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

export default Entity;