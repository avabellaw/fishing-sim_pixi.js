import PassingObject from "./passing-object.js";

import { HEIGHT } from "../constants.js";
import gameObject from "../game-object.js";
import { FishPointsText, LostPointsText } from "./text-entity.js";

class Fish extends PassingObject {
    constructor(x, y, width, height, speed, spriteName, points) {
        super(x, y, width * 1.75, height * 1.75, speed * 1.70, spriteName, points);
    }

    update(delta) {
        super.update(delta);

        if (gameObject.isEntityCollidingWithHook(this)) {
            this.caughtFish();
        }
    }

    handleObjectOffScreen() {
        super.handleObjectOffScreen();

        // Fish is off screen -> it was missed -> increment missed fish counter.
        gameObject.fishMissed++;
    }

    caughtFish() {
        this.caughtObject();

        gameObject.fishCaught++;

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
        gameObject.entities.push(new LostPointsText(this.x, this.y, this.points));
        this.caughtObject();
    }
}

export { CommonFish, YellowFish, ClownFish, AltClownFish, SlowFish, Boot };