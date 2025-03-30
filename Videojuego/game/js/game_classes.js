/*
 * Classes for the game
 */

"use strict";

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}


class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


class GameObject {
    constructor(color, width, height, x, y, type) {
        this.position = new Vec(x, y);
        this.size = new Vec(width, height);
        this.color = color;
        this.type = type;

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;

        // Hitbox properties
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: this.size.x,
            height: this.size.y,
        }
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    setHitbox(offsetX, offsetY, width, height) {
        this.hitbox.position.x = this.position.x + offsetX;
        this.hitbox.position.y = this.position.y + offsetY;
        this.hitbox.width = width;
        this.hitbox.height = height;
    }

    draw(ctx, scale) {
        if (this.spriteImage) {
            // Dont pixelate the sprites
            ctx.imageSmoothingEnabled = false;

            // Draw a sprite if the object has one defined
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x * this.spriteRect.width,
                              this.spriteRect.y * this.spriteRect.height,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x * scale, this.position.y * scale,
                              this.size.x * scale, this.size.y * scale);
            } else {
                ctx.drawImage(this.spriteImage,
                              this.position.x * scale, this.position.y * scale,
                              this.size.x * scale, this.size.y * scale);
            }
        } else {
            // If there is no sprite asociated, just draw a color square
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x * scale, this.position.y * scale,
                         this.size.x * scale, this.size.y * scale);
        }
    }

    drawHitbox(ctx, scale) {
        ctx.strokeStyle = "red"; // Use red color for the hitbox
        ctx.lineWidth = 2; // Set the line width for better visibility

        ctx.strokeRect(
            this.hitbox.position.x * scale,
            this.hitbox.position.y * scale,
            this.hitbox.width * scale,
            this.hitbox.height * scale
        );
    }

    update() {

    }
}

class AnimatedObject extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = 0;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    setAnimation(minFrame, maxFrame, repeat, duration) {
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            let restartFrame = (this.repeat ? this.minFrame : this.frame);
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
            this.totalTime = 0;
        }
    }
}

class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

class cardTextLabel extends TextLabel {
    constructor(x, y, font, color, maxWidth) {
        super(x, y, font, color);
        this.maxWidth = maxWidth;
        this.lineHeight = 20;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;

        const lines =  this.wrapText(ctx, text);

        lines.forEach((line, index) => {
            ctx.fillText(line, this.x, this.y +index * this.lineHeight);
        });
    }
        
    wrapText(ctx, text) {
        const words =  text.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach((word) => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = ctx.measureText(testLine).width;
            
            if(testWidth > this.maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if(currentLine) {
            lines.push(currentLine);
        }
        return lines;
    }
}

class MenuButton extends GameObject {
    constructor(color, width, height, x, y, type, text) {
        super(color, width, height, x, y, type);
        this.text = text; // Button text
        this.isPressed = false; // Button state
        this.isHovered = false; // Button hover state
        this.label = new TextLabel(this.position.x + 10, this.position.y + (this.size.y / 2), "20px monospace", "black");
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        this.lineWidth = 4;
        ctx.strokeStyle = "black"; // Border color
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Draw the button label
        this.label.draw(ctx, this.text);
    }
}

class Bar {
    constructor(x, y, width, height, maxValue, currentValue, barColor = "white", backgroundColor = "black", borderColor = "black") {
        this.position = new Vec(x, y); // Position of the bar
        this.size = new Vec(width, height); // Size of the bar
        this.maxValue = maxValue; // Max value of the bar
        this.currentValue = currentValue; // Current value of the bar
        this.barColor = barColor; // Color of the filled portion
        this.backgroundColor = backgroundColor; // Color of the background
        this.borderColor = borderColor; // Color of the border
    }

    update(newValue, newMaxValue) {
        // Update the current value of the bar
        this.currentValue = newValue
        // Update the max value of the bar
        this.maxValue = newMaxValue
    }

    draw(ctx) {
        const filledWidth = (this.currentValue / this.maxValue) * this.size.x;

        // Draw the background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Draw the filled portion
        ctx.fillStyle = this.barColor;
        ctx.fillRect(this.position.x, this.position.y, filledWidth, this.size.y);

        // Draw the border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

/*
// Simple collision detection between rectangles
function overlapRectangles(actor1, actor2) {
    return actor1.position.x + actor1.size.x > actor2.position.x &&
           actor1.position.x < actor2.position.x + actor2.size.x &&
           actor1.position.y + actor1.size.y > actor2.position.y &&
           actor1.position.y < actor2.position.y + actor2.size.y;
}
*/

// Collision detection between hitboxes
function overlapRectangles(actor1, actor2) {
    return actor1.hitbox.position.x + actor1.hitbox.width > actor2.hitbox.position.x &&
           actor1.hitbox.position.x < actor2.hitbox.position.x + actor2.hitbox.width &&
           actor1.hitbox.position.y + actor1.hitbox.height > actor2.hitbox.position.y &&
           actor1.hitbox.position.y < actor2.hitbox.position.y + actor2.hitbox.height;
}