/** Andrea Tino - 2020 */

import fs from "fs";
import path from "path";
import { Logger as WinstonLogger, createLogger as createWinstonLogger, format, transports } from "winston";

import { Disposable } from "../disposable";
import { Logger } from "./logger";

/**
 * A logger.
 */
export class SystemLogger implements Logger, Disposable {
    private readonly logger: WinstonLogger;

    /**
     * Initializes a new instance of this class.
     * @param logToConsole A value indicating whether to log to console or not.
     */
    constructor(logToConsole?: boolean, logsBasePath?: string) {
        this.logger = this.createLogger(
            logToConsole === undefined ? true : logToConsole,
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

    /** @inheritdoc */
    public dispose(): void {
        this.logger.destroy();
    }

    /** @inheritdoc */
    public get isDisposed(): boolean {
        return this.logger.destroyed;
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
            defaultMeta: { service: "LiberArs Engine" },
            handleExceptions: true,
            exitOnError: false
        });

        if (logsBasePath !== undefined && fs.existsSync(logsBasePath)) {
            logger.add(new transports.File({ filename: path.join(logsBasePath, "error.log"), level: "error" }));
            logger.add(new transports.File({ filename: path.join(logsBasePath, "debug.log"), level: "debug" }));
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
