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
