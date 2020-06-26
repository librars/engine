/** Andrea Tino */

import process from "process"
import path from "path";

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
