/*
 * General classes for the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

"use strict";

// Class for vectors
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

// Class for rectangles
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// Class for general game objects
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
        // If the hitbox global variable is set to false, dont draw the hitbox
        if (!showHitboxes) {
            return;
        }

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
        // Method to be overridden by subclasses
    }
}

// Class for animated objects
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

        // Get the column of the sprite sheet
        this.spriteRect.x = this.frame % this.sheetCols;
        // Get the row of the sprite sheet
        this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
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

// Text labels witthout wrapping
class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text, color) {
        ctx.font = this.font;
        ctx.fillStyle = color || this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

// Each label for the cards in the game
// This class will wrap the text to fit inside the card
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
    
    // Split the text into lines that fit within the maxWidth
    wrapText(ctx, text) {
        // Split the text into words
        const words =  text.split(' ');
        // Array to hold the lines of text
        let lines = [];
        // Current line of text
        let currentLine = '';

        // Loop through each word in the text
        words.forEach((word) => {
            // Check if adding the next word exceeds the maxWidth
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = ctx.measureText(testLine).width;
            
            // If the line exceeds the maxWidth, push the current line to the lines array
            // and start a new line with the current word
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

// Buttons for the menu
// This class will be used for the buttons in the pause and main menu
class MenuButton extends GameObject {
    constructor(color, width, height, x, y, type, text, textColor, borderColor) {
        super(color, width, height, x, y, type);
        this.text = text; // Button text
        this.textColor = textColor; // Button text color
        this.borderColor = borderColor; // Button border color

        this.isPressed = false; // Button state
        this.isHovered = false; // Button hover state
        this.label = new TextLabel(this.position.x + 10, // x
                                    this.position.y + (this.size.y / 2), // y
                                    "20px monospace", // Font
                                    this.textColor); // Color
    }

    draw(ctx) {
        // Draw the button background
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        // Draw the button border
        this.lineWidth = 4;
        ctx.strokeStyle = this.borderColor; // Border color
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Draw the button label
        this.label.draw(ctx, this.text, this.textColor);
    }

    // Check if the mouse is inside the button
    isMouseInside(x, y) {
        return x > this.position.x && x < this.position.x + this.size.x &&
               y > this.position.y && y < this.position.y + this.size.y;
    }
}

// Class for the bars in the game
// This class will be used for the health and xp bars
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
// NOTE: This was the original collision detection function
// Dont delete it in case we need it in the future
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