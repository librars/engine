/** Andrea Tino - 2020 */

/**
 * Describes a logger.
 */
export interface Logger {
    /**
     * Logs an info.
     * @param message The message to log.
     */
    info(message: string): void;

    /**
     * Logs a warning.
     * @param message The message to log.
     */
    warn(message: string): void;

    /**
     * Logs an error.
     * @param message The message to log.
     */
    error(message: string): void;

    /**
     * Logs a debug trace.
     * @param message The message to log.
     */
    trace(message: string): void;
}
