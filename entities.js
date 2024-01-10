class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width * SCALE;
        this.height = height * SCALE;

        this.updates = 0;
    }

    getSprite(spriteLocation) {
        this.spriteLocation = spriteLocation;

        return PIXI.Sprite.from(spriteLocation);
    }

    addSprite(sprite) {
        this.sprite = sprite;
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
        if(this.sprite != undefined) {  
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

    removeEntity() {
        if (this.sprite != undefined) {
            app.stage.removeChild(this.sprite);
        }
        entities.splice(entities.indexOf(this), 1);
    }
}

class TextEntity extends Entity {
    constructor(x, y, text, style) {
        super(x, y, 0, 0);
        this.text = text;
        this.sprite = new PIXI.Text(text, style);
        app.stage.addChild(this.sprite);

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    update(delta) {
        super.update(delta);
    }
}

class FishPointsText extends TextEntity {
    constructor(x, y, text, speed) {
        super(x, y, text, new PIXI.TextStyle({
            fill: "#ffffff"
        }));
        this.speed = speed;
    }

    update() {
        super.update();
        this.y -= this.speed;

        if (this.y < 0) {
            this.removeEntity();
        }
    }
}

// FISH

class Fish extends Entity {
    constructor(x, y, width, height, speed, spriteLocation, points) {
        super(x, y, width, height);

        this.x = this.getRandomX();

        this.addSprite(this.getSprite(spriteLocation));

        this.points = points;
        this.speed = speed;
        this.sprite.eventMode = "dynamic"
    }

    update(delta) {
        super.update(delta);

        if (this.isCollidingWith(playerHook)) {
            this.caughtFish();
        }

        this.y -= this.speed;

        if (this.y < 0) {
            this.removeEntity();
        }
    }

    caughtFish() {
        entities.push(new FishPointsText(this.x, this.y, this.points, this.speed));
        this.removeEntity();
        gameObject.addToScore(this.points)
    }

    getMiddleX() {
        return WIDTH - this.width / 2;
    }

    getRandomX() {
        return Math.floor(Math.random() * (gameObject.bounds.maxX - this.width - gameObject.bounds.minX) + gameObject.bounds.minX);
    }
}

class CommonFish extends Fish {
    constructor() {
        super(0, HEIGHT, 20*1.25, 18*1.25, 1.8, "assets/sprites/fish/common.webp", 4);
    }

    update(delta) {
        super.update(delta);
    }
}

class YellowFish extends Fish {
    constructor() {
        super(0, HEIGHT, 19*1.25, 18*1.25, 2.2, "assets/sprites/fish/yellow.webp", 5);
    }

    update(delta) {
        super.update(delta);
    }
}

// END FISH

// PLAYER HOOK

class PlayerHook extends Entity {
    constructor(speed) {
        super(WIDTH / 2, 0, 18*0.75, 36*0.75);

        this.desiredX = this.x;
        this.desiredY = this.y;
        this.hookLine = new HookLine(this, 2);
        this.speed = speed;

        // Adjust x for playerHook width
        this.x -= this.width / 2;
        this.addSprite(this.getSprite("assets/sprites/hook.webp"));

        this.sprite.interactive = true;
    }

    update() {
        super.update();
        this.hookLine.update(this.x, this.y);

        if (this.y < this.desiredY - this.speed / 2) {
            if (this.y + this.speed + this.height > gameObject.bounds.maxY) {
                this.y = gameObject.bounds.maxY - this.height;
            } else {
                this.y += this.speed;
            }

        } else if (this.y > this.desiredY + this.speed / 2) {
            if (this.y - this.speed - this.height < gameObject.bounds.minY) {
                this.y = gameObject.bounds.minY;
            } else {
                this.y -= this.speed;
            }
        }

        if (this.x < this.desiredX - this.speed / 2) {
            if (this.x + this.speed + this.width > gameObject.bounds.maxX) {
                this.x = gameObject.bounds.maxX - this.width;
            } else {
                this.x += this.speed;
            }
        } else if (this.x > this.desiredX + this.speed / 2) {
            if (this.x - this.speed - this.width < gameObject.bounds.minX) {
                this.x = gameObject.bounds.minX;
            } else {
                this.x -= this.speed;
            }
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

        this.x = x + this.playerHook.width / 2;
        this.y = y;

        this.lineGraphics.clear();
        this.lineGraphics.lineStyle(this.lineThickness, 0x000000, 1);
        this.lineGraphics.moveTo(this.START_X, this.START_Y);
        this.lineGraphics.lineTo(this.x, this.y)
    }
}

// END PLAYER HOOK