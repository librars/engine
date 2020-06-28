/** Andrea Tino - 2020 */

import fs from "fs";
import path from "path";
import { Logger as WinstonLogger, createLogger as createWinstonLogger, format, transports } from "winston";

/**
 * A logger.
 */
export class Logger {
    private readonly logger: WinstonLogger;

    /**
     * Initializes a new instance of this class.
     * @param logToConsole A value indicating whether to log to console or not.
     */
    constructor(logToConsole?: boolean, logsBasePath?: string) {
        this.logger = this.createLogger(
            logToConsole == undefined ? true : logToConsole,
            logsBasePath
        );
    }

    /**
     * Logs an info.
     * @param message The message to log.
     */
    public info(message: string): void {
        this.logger.log("info", message);
    }

    /**
     * Logs a warning.
     * @param message The message to log.
     */
    public warn(message: string): void {
        this.logger.log("warn", message);
    }

    /**
     * Logs an error.
     * @param message The message to log.
     */
    public error(message: string): void {
        this.logger.log("error", message);
    }

    /**
     * Logs a debug trace.
     * @param message The message to log.
     */
    public trace(message: string): void {
        this.logger.log("debug", message);
    }

    private createLogger(logToConsole: boolean, logsBasePath?: string): WinstonLogger {
        const logger = createWinstonLogger({
            level: "info", // Default level
            format: format.combine(
                format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                format.errors({ stack: true }),
                format.splat(),
                format.json()
            ),
            defaultMeta: { service: "LiberArs Engine" }
        });

        if (!!logsBasePath && fs.existsSync(logsBasePath)) {
            /*
                - Write to all logs with level `info` and below to `quick-start-combined.log`.
                - Write all logs error (and below) to `quick-start-error.log`.
            */
            logger.add(new transports.File({ filename: path.join(logsBasePath, "error.log"), level: "error" }));
            logger.add(new transports.File({ filename: path.join(logsBasePath, "combined.log") }));
        }

        if (logToConsole) {
            logger.add(new transports.Console({
                format: format.simple(),
            }));
        }

        return logger;
    }
}
