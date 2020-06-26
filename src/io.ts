/** Andrea Tino - 2020 */

import fs from "fs";
import path from "path";

/**
 * Ensures a directory is available.
 * @param {string} dirpath Path where to create the directory.
 * @returns {boolean} A value indicating whether the directory was
 *     actually created or was already present.
 */
export function ensureDirectory(dirpath: string): boolean {
    if (fs.existsSync(dirpath)) {
        return false;
    }

    fs.mkdirSync(dirpath);
    return true;
}

/**
 * Safely deletes a directory.
 * @param {string} dirpath Path to the directory to remove.
 */
export function deleteDirectory(dirpath: string): void {
    if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory()) {
        return;
    }

    // Depth first recursive deletion
    const deleteFolderRecursive = (d: string) => {
        if (fs.existsSync(d)) {
            fs.readdirSync(d).forEach((file, index) => {
                const curPath = path.join(d, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath); // Remove each file one by one
                }
            });
            fs.rmdirSync(d); // Safe to delete folder as now empty
        }
    };

    deleteFolderRecursive(dirpath);
}
