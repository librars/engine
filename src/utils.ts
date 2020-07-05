/** Andrea Tino */

import process from "process"
import path from "path";
import { v4 } from "uuid";

/**
 * Gets the application data directory absolute path.
 * @returns {string} The application data folder path.
 */
export function getAppDataDirPath(): string {
    const dataDir = process.env.APPDATA;
    if (!dataDir) {
        throw new Error("Could not retrieve user data folder");
    }

    return path.normalize(dataDir);
}

/**
 * Generates a 32 bit (8 hexdigit) string by creating a random
 * UUID and taking the most significant 32 bits.
 * @returns An hex rnadom identifier.
 */
export function generateRandomSimpleId(): string {
    const r = v4();
    return r.substring(0, r.indexOf("-"));
}

/**
 * Adds an item into an array at the specified position.
 * Important: the original array is not touched, a new array is created but no copies of
 * the single items are made, so the same references are used.
 * @param array The array to modify.
 * @param item The item to add.
 * @param at The (existing) item (in the array) after which adding the new item or its position.
 *     If not specified, the item will be appended last.
 *     If a negative value is specified, the element will be added as first.
 * @returns The new array.
 */
export function addToArray<T>(array: Array<T>, item: T, at?: number | T): Array<T> {
    if (typeof(at) === "number" && at < 0) {
        // Special case for adding in head
        return [item].concat(array);
    }

    if (array.length === 0) {
        // Special case of empty array
        return [item];
    }

    at = at || array.length - 1;
    const result: Array<T> = [];

    for (let i = 0; i < array.length; i++) {
        result.push(array[i]);
        if ((typeof(at) === "number") ? (i === at) : (array[i] === at)) {
            result.push(item);
        }
    }

    return result;
}

/**
 * Removes an item from an array at the specified position.
 * Important: the original array is not touched, a new array is created but no copies of
 * the single items are made, so the same references are used.
 * @param array The array from which removing.
 * @param at The (existing) item (in the array) to remove or its position.
 * @returns The new array.
 */
export function removeFromArray<T>(array: Array<T>, at: number | T): Array<T> {
    const result: Array<T> = [];
    for (let i = 0; i < array.length; i++) {
        if ((typeof(at) === "number") ? (i === at) : (array[i] === at)) {
            continue;
        }
        result.push(array[i]);
    }

    return result;
}
