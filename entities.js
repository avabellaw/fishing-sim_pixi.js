class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.updates = 0;
    }

    addSprite(spriteLocation) {
        this.spriteLocation = spriteLocation;

        this.sprite = PIXI.Sprite.from(spriteLocation);
        app.stage.addChild(this.sprite);

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.width = this.width;
        this.sprite.height = this.height;
    }

    updateSprite() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    update(delta) {
        this.updates += delta;
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
}

// FISH

class Fish extends Entity {
    constructor(x, y, width, height, speed, spriteLocation, points) {
        super(x, y, width, height);

        this.addSprite(spriteLocation);

        this.points = points;
        this.speed = speed;
        this.sprite.eventMode = "dynamic"
    }

    update(delta) {
        super.update(delta);

        if (this.isCollidingWith(playerHook)) {
            this.caughtFish();
        }

        this.updateSprite();

        this.y -= this.speed;

        if (this.y < -this.height) {
            this.removeFish();
        }
    }

    caughtFish() {
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
    constructor(speed) {
        super(WIDTH / 2, 0, 24, 40);

        this.desiredX = this.x;
        this.desiredY = this.y;
        this.hookLine = new HookLine(this, 2);
        this.speed = speed;

        // Adjust x for playerHook width
        this.x -= this.width / 2;
        this.addSprite("assets/sprites/hook.webp");

        this.sprite.interactive = true;
    }

    update() {
        super.update();
        this.updateSprite();
        this.hookLine.update(this.x, this.y);

        if (this.y < this.desiredY - this.speed / 2) {
            this.y += this.speed;
        } else if (this.y > this.desiredY + this.speed / 2) {
            this.y -= this.speed;
        }

        if (this.x < this.desiredX - this.speed / 2) {
            this.x += this.speed;
        } else if (this.x > this.desiredX + this.speed / 2) {
            this.x -= this.speed;
        }
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

        this.x = x + this.playerHook.width - 3;
        this.y = y;

        this.lineGraphics.clear();
        this.lineGraphics.lineStyle(this.lineThickness, 0x000000, 1);
        this.lineGraphics.moveTo(this.START_X, this.START_Y);
        this.lineGraphics.lineTo(this.x, this.y)
    }
}

// END PLAYER HOOK