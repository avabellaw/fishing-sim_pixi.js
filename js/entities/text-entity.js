import Entity from "./entity.js";

import gameObject from "../game-object.js";

/**
 * A static text entity that is rendered on the screen.
 */
class TextEntity extends Entity {
    constructor(x, y, text, style) {
        super(x, y, 0, 0);
        this.sprite = new PIXI.Text(text, style);

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    getSprite() {
        return this.sprite;
    }

    update(delta) {
        super.update(delta);
    }
}

/**
 * Created when a fish is caught to display points gained.
 */
class PointsText extends TextEntity {
    constructor(x, y, text, style) {
        super(x, y, text, style);

        this.START_Y = this.y;
        this.speed = 3;

        gameObject.addSpriteToContainer(this);
    }

    update() {
        super.update();
        this.y -= this.speed;


        if (this.START_Y - this.y > 80)
            this.sprite.alpha -= 0.03;

        if (this.y < 0 || this.sprite.alpha <= 0) {
            this.removeEntity();
        }
    }
}

class FishPointsText extends PointsText {
    constructor(x, y, points) {
        super(x, y, points, new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 25,
            fontWeight: "bold"
        }))
    }
}

class LostPointsText extends PointsText {
    constructor(x, y, points) {
        super(x, y, points, new PIXI.TextStyle({
            fill: "#ff0000",
            fontSize: 25,
            fontWeight: "bold"
        }))
    }
}

export { TextEntity, PointsText, FishPointsText, LostPointsText };