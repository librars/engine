/** Andrea Tino - 2020 */

import { Disposable } from "../disposable";
import { Session } from "../session";
import { getAppDataDirPath } from "../utils";

/**
 * Describes a command.
 */
export abstract class Command implements Disposable {
    private _isDisposed = false;
    protected session: Session;

    /**
     * Initializes a new instance of this class.
     * @param intermediateFolder The folder where temporary files and logs will be placed.
     */
    constructor(intermediateFolder?: string) {
        // Initialize session
        this.session = new Session({
            dirpath: intermediateFolder || Command.getDefaultIntermediateFolder(),
            cleanSessionDir: false
        });
    }

    /**
     * Executes the command.
     */
    public execute(): void {
        try {
            this.executeCore();
        } catch(e) {
            this.session.logger.error(`An error occurred when executing command ${this.commandName}. Error was: '${JSON.stringify(e)}'`);
            this.dispose();
            throw e;
        }
    }

    /** @inheritdoc */
    public dispose(): void {
        if (this.isDisposed) {
            return;
        }

        // Clear session
        this.session.dispose();

        this._isDisposed = true;
    }

    /** @inheritdoc */
    public get isDisposed(): boolean {
        return this._isDisposed;
    }

    /**
     * Executes the core command.
     */
    protected abstract executeCore(): void;

    /**
     * Gets the name of the command.
     */
    protected abstract get commandName(): string;

    protected static getDefaultIntermediateFolder(): string {
        return getAppDataDirPath();
    }
}
