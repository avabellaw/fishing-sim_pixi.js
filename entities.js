class Entity {
    constructor(x, y, width, height, spriteLocation) {
        this.x = x;
        this.y = y;
        this.spriteLocation = spriteLocation;

        this.sprite = PIXI.Sprite.from(spriteLocation);
        app.stage.addChild(this.sprite);


        this.width = width;
        this.height = height;

        this.sprite.x = x;
        this.sprite.y = y;

        this.sprite.width = width;
        this.sprite.height = height;

        this.updates = 0;
    }

    update(delta) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        updates += delta;
        if (updates >= 60) {
            updates = 0;
        }
    }
}

// FISH

class Fish extends Entity {
    constructor(x, y, width, height, speed, spriteLocation, points) {
        super(x, y, width, height, spriteLocation);

        this.points = points;
        this.speed = speed;
        this.sprite.on('mouseenter', (event) => { this.caughtFish() });
        this.sprite.eventMode = "dynamic"
    }

    update(delta) {
        super.update(delta);
        this.y -= this.speed;

        if (this.y < -this.height) {
            this.removeFish();
        }
    }

    caughtFish(){
        this.removeFish();
        gameObject.addToScore(this.points)
    }

    removeFish() {
        app.stage.removeChild(this.sprite);
        entities.splice(entities.indexOf(this), 1);
    }

    getMiddleX() {
        return WIDTH - this.width / 2;
    }
}

class CommonFish extends Fish {
    constructor() {
        super(0, HEIGHT, 40, 36, 1.8, "assets/sprites/fish/common.webp", 4);
        this.x = Math.floor(Math.random() * (WIDTH - this.width));
    }

    update(delta) {
        super.update(delta);
    }
}

class YellowFish extends Fish {
    constructor() {
        super(0, HEIGHT, 19 * 2, 18 * 2, 2.2, "assets/sprites/fish/yellow.webp", 5);
        this.x = Math.floor(Math.random() * (WIDTH - this.width));
    }

    update(delta) {
        super.update(delta);
    }
}

// END FISH

// PLAYER HOOK

class PlayerHook extends Entity {
    constructor() {
        super(0, 0, 24, 40, "assets/sprites/hook.webp");
    }

    update() {
        super.update();
    }
}

// END PLAYER HOOK