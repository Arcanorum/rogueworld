import { existsSync, mkdirSync } from 'fs';
import * as Phaser from 'phaser';

interface BoardPoint {
    row: number;
    col: number;
}

/**
 * Creates a counter that will track it's own count and allow the next count to be retrieved.
 * Useful for creating unique incremental IDs.
 */
export class Counter {
    private count = 0;

    getNext() {
        this.count += 1;
        return this.count;
    }
}

/**
 * Gets a random number between, and including, min and max.
 */
export const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Gets the distance in pixels between a Phaser display object and a pointer.
 */
export const pixelDistanceBetween = (
    displayObject: {x: number; y: number},
    camera: Phaser.Cameras.Scene2D.Camera,
    pointer: PointerEvent,
) => {
    // eslint-disable-next-line no-underscore-dangle
    const dist = Math.abs(camera.scrollX - (displayObject.x - pointer.clientX))
    // eslint-disable-next-line no-underscore-dangle
    + Math.abs(camera.scrollY - (displayObject.y - pointer.clientY));
    return dist;
};

/**
 * Gets the Manhattan distance in tiles between two points.
 */
export const tileDistanceBetween = (dynamic1: BoardPoint, dynamic2: BoardPoint) => {
    return Math.abs(dynamic1.row - dynamic2.row) + Math.abs(dynamic1.col - dynamic2.col);
};

/**
 * When showing an item value (i.e. quantity) on a client, if it would be too long, show a
 * truncated value instead with a + in front to show that it is over this amount.
 */
export const formatItemValue = (value: string | number) => {
    if (!value) return 0;
    if (value > 999) return '+999';
    return value;
};

/**
 * Hashes a message.
 * Useful for securing passwords before sending.
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Converting_a_digest_to_a_hex_string
 */
export const digestMessage = async(message: string) => {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
};

export const getStyle = (className: string) => {
    const classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
    for (let x = 0; x < classes.length; x += 1) {
        const cssClass = (classes[x] as CSSStyleRule);
        if (cssClass.selectorText === className) {
            return cssClass.style;
        }
    }
    return false;
};

export * from './Arrays';
export * from './Logging';
export * from './Profanity';
