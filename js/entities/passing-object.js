import Entity from "./entity.js";

import gameObject from "../game-object.js";

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

        document.getElementById("streak").textContent = gameObject.streak;

        gameObject.addToScore(this.getPoints());
    }
}

export default PassingObject 