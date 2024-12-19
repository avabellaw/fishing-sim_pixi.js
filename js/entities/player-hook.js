import Entity from "./entity.js";

import { WIDTH, HEIGHT } from "../constants.js";

class PlayerHook extends Entity {
    constructor(speed) {
        super(WIDTH / 2, 0, 18 * 0.75, 36 * 0.75);

        this.desiredX = this.x;
        this.desiredY = this.y;

        this.container = new PIXI.Container();
        this.hookLine = new HookLine(this, 2);
        this.speed = speed;

        // Adjust x for playerHook width
        this.x -= this.width / 2;
        this.loadAndAddSprite("playerHook");
    }

    update() {
        super.update();
        this.hookLine.update(this.x, this.y);

        if (this.y < this.desiredY - this.speed / 2) {
            this.y = Math.min(this.y + this.speed, HEIGHT - this.height);
        } else if (this.y > this.desiredY + this.speed / 2) {
            this.y = Math.max(this.y - this.speed, 0);
        }
        
        if (this.x < this.desiredX - this.speed / 2) {
            this.x = Math.min(this.x + this.speed, WIDTH - this.width);
        } else if (this.x > this.desiredX + this.speed / 2) {
            this.x = Math.max(this.x - this.speed, 0);
        }
    }

    followPointer(e) {
        this.desiredX = e.global.x - this.width / 2;
        this.desiredY = e.global.y - this.height / 2;
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

        playerHook.container.addChild(this.lineGraphics);
    }

    update(x, y) {
        super.update();

        const newX = x + this.playerHook.width / 2;
        const newY = y;

        // If moved, update the line
        if (this.x !== newX || this.y !== newY) {
            this.x = newX;
            this.y = newY;

            this.lineGraphics.clear();
            this.lineGraphics.lineStyle(this.lineThickness, 0x000000, 1);
            this.lineGraphics.moveTo(this.START_X, this.START_Y);
            this.lineGraphics.lineTo(this.x, this.y);
        }
    }
}

export default PlayerHook;