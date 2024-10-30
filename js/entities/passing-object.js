import Entity from "./entity.js";

import gameObject from "../game-object.js";
import { Boot } from "./fish.js";

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

        if (!this.rendered) {
            // As soon as the entity is being used, render it.
            this.renderEntity(this.spriteName, gameObject.gameScreen.container);
            this.rendered = true;
        }

        if (this.y < -this.height) {
            this.handleObjectOffScreen();
        }
    }

    /**
     * Removes the entity from the game. Override with super call to add additional logic.
     */
    handleObjectOffScreen() {
        this.removeEntity();
    }

    caughtObject() {
        this.removeEntity();

        if(++gameObject.streak > gameObject.longestStreak) {
            gameObject.longestStreak = gameObject.streak;
        }

        if (this instanceof Boot) {
            gameObject.bootsHit++;
            gameObject.streak = 0;
        }

        document.getElementById("streak").textContent = gameObject.streak;

        gameObject.addToScore(this.getPoints());
    }
}

export default PassingObject 