/** Andrea Tino - 2020 */

import uuid from "uuid";
import path from "path";
import fs from "fs";

import { Disposable } from "./disposable";
import { APP_DIR } from "./consts";
import { getAppDataDirPath } from "./utils";
import { ensureDirectory, deleteDirectory } from "./io";
import { Logger } from "./logger";

/**
 * Describes the configuration for a session.
 */
export interface SessionConfig {
    /**
     * A value indicating whether a diretory for this session should be created.
     */
    createSessionDir?: boolean;

    /**
     * A value indicating whether the session directory should be
     * removed upon session disposal.
     */
    cleanSessionDir?: boolean;

    /**
     * Explicit path where to create the session directory.
     * The sesison directory will be created inside the provided path.
     */
    dirpath?: string;
}

/**
 * Describes a session.
 */
export class Session implements Disposable {
    private _id: string;
    private config: SessionConfig;
    private _logger: Logger;

    /**
     * Initializes a new instance of this class.
     */
    constructor(config?: SessionConfig) {
        // Handle configuration first
        this.config = config || Session.getDefaultConfig();
        this.config = Session.getConfigWithDefaults(this.config);

        // Create an id
        this._id = uuid.v4();

        // Instantiate the logger
        this._logger = new Logger();

        // Create session directory
        if (this.config.createSessionDir) {
            ensureDirectory(this.sessionDirPath);
        }
    }

    /** Gets the session logger. */
    public get logger(): Logger {
        return this._logger;
    }

    /** Gets the session identifier. */
    public get id(): string {
        return this._id;
    }

    /** Gets the path to the session directory. */
    public get sessionDirPath(): string {
        this.checkSessionDir();

        const sessionDir = path.join(APP_DIR, this._id);
        return path.join(<string>this.config.dirpath, sessionDir);
    }

    /**
     * Writes a file in the session directory.
     * @param {string} fileName The name to give to the file.
     * @param {string} content The content of the file.
     */
    public addFile(fileName: string, content: string): void {
        this.checkSessionDir();

        const filePath = path.join(this.sessionDirPath, fileName);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File '${filePath}' already exists`);
        }

        fs.writeFileSync(filePath, content, { encoding: "utf-8" });
    }

    /**
     * Gets the file path in the session directory.
     * @param {string} fileName The name to give to the file.
     */
    public getFilePath(fileName: string): string {
        this.checkSessionDir();

        const filePath = path.join(this.sessionDirPath, fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        }

        throw new Error(`File '${filePath}' not found`);
    }

    /** @inheritdoc */
    public dispose(): void {
        if (this.config.cleanSessionDir) {
            if (fs.existsSync(this.sessionDirPath)) {
                deleteDirectory(this.sessionDirPath);
            }
        }
    }

    private checkSessionDir(): void {
        if (!this.config.createSessionDir) {
            throw new Error("Session was created with no session directory");
        }
    }

    private static getConfigWithDefaults(config: SessionConfig): SessionConfig {
        return {
            createSessionDir: config.createSessionDir == undefined ? true : config.createSessionDir,
            cleanSessionDir: config.cleanSessionDir == undefined ? true : config.cleanSessionDir,
            dirpath: config.dirpath || getAppDataDirPath()
        };
    }

    private static getDefaultConfig(): SessionConfig {
        return {
            createSessionDir: true,
            cleanSessionDir: true,
            dirpath: getAppDataDirPath()
        };
    }
}
