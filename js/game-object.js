import { getRandomFish } from "./util/helpers.js";
import { PassingObject } from "./entities/entities.js";

let gameObject = {
    entities: [],
    playerHook: null,
    score: 0,
    streak: 0,
    longestStreak: 0,
    fishCaught: 0,
    fishMissed: 0,
    bootsHit: 0,
    entitiesStack: [],
    spawnObjectCoolOff: 10,
    spawnCounter: 0,
    isEndGame: false,
    showScoreScreen: false,
    isEntityCollidingWithHook: function (entity) {
        return this.playerHook.isCollidingWith(entity);
    },
    init: function () {
        for (let i = 0; i < 10; i++) {
            this.entitiesStack.push(getRandomFish());
        }
    },
    update: function (delta) {
        this.entities.forEach(entity => {
            entity.update(delta);
        });

        if (this.entitiesStack.length > 0 &&
            this.spawnCounter++ >= this.spawnObjectCoolOff + (this.entitiesStack.length * 0.3)) {
            this.addEntity(this.entitiesStack.pop());
            this.spawnCounter = 0;
        } else if (this.entitiesStack.length === 0 && !this.isEndGame && this.numberOfPassingObjects() === 0) {
            this.background.endGame();
        }
    },
    addToScore: function (points) {
        this.score += points;
        document.getElementById("score").innerText = Math.round(this.score);
    },
    numberOfPassingObjects: function () {
        return this.entities.filter(entity => entity instanceof PassingObject).length;
    },
    /**
     * Add an entity to the game.
     * @param {Entity} The entity to add 
     */
    addEntity: function (entity) {
        this.entities.push(entity);
    },
    /**
     * Will render the sprite/container to the screen.
     * @param {*} sprite Sprite OR container to add to the main PIXI container
     */
    addSpriteToContainer: function (sprite) {
        this.gameScreen.addContainerToStage(sprite);
    },
}

export { gameObject };