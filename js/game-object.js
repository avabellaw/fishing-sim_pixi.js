import { Fish } from "./entities/fish.js";
import PassingObject from "./entities/passing-object.js";
import { DEBUG, NUMBER_OF_PASSING_OBJECTS } from "./constants.js";

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
        for (let i = 0; i < NUMBER_OF_PASSING_OBJECTS; i++) {
            this.entitiesStack.push(Fish.getRandomFish());
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
            if (!this.isEndGame) {
                this.endGame();
            }
        }
    },
    endGame: function () {
        let coins = Math.round(this.score / 10);
        document.cookie = `coins=${coins + this.coins}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

        this.background.endGame();
        this.isEndGame = true;
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
    addSpriteToContainer: function (entity) {
        if (DEBUG) console.log("Adding sprite to container: " + entity.constructor.name);
        this.gameScreen.addToStage(entity.sprite);
    },
    addSpriteContainerToContainer: function (container) {
        if (DEBUG) console.log("Adding sprite container to main container");
        this.gameScreen.addToStage(container);
    }
}

export default gameObject;