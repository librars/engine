/** Andrea Tino - 2020 */

import uuid from "uuid";
import path from "path";

import { Disposable } from "./disposable";
import { APP_DIR } from "./consts";
import { getAppDataDirPath } from "./utils";
import { ensureDirectory, deleteDirectory } from "./io";

/**
 * Describes the configuration for a session.
 */
export interface SessionConfig {
    /**
     * A value indicating whether the session directory should be
     * removed upon session disposal.
     */
    cleanSessionDir?: boolean;
};

/**
 * Describes a session.
 */
export class Session implements Disposable {
    private _id: string = "";
    private config: SessionConfig;

    /**
     * Initializes a new instance of this class.
     */
    constructor(config?: SessionConfig) {
        this.initialize();

        this.config = config || {
            cleanSessionDir: true
        };
        this.config = Session.getConfigWithDefaults(this.config);
    }

    /** Gets the session identifier. */
    public get id(): string {
        return this._id;
    }

    /** @inheritdoc */
    public dispose(): void {
        if (this.config.cleanSessionDir) {
            deleteDirectory(this.getSessionDirPath());
        }
    }

    private getSessionDirPath(): string {
        const sessionDir = path.join(APP_DIR, this._id);
        return path.join(getAppDataDirPath(), sessionDir);
    }

    private initialize(): void {
        // Create an id
        this._id = uuid.v4();

        // Create session directory
        ensureDirectory(this.getSessionDirPath());
    }

    private static getConfigWithDefaults(config: SessionConfig): SessionConfig {
        return {
            cleanSessionDir: config.cleanSessionDir == undefined ? true : config.cleanSessionDir
        };
    }
}
