/** Andrea Tino - 2020 */

import process from "child_process";
import path from "path";
import os from "os";

import { OutputFormat } from "./config";

/**
 * The output format for Pandoc.
 */
export type PandocOutputFormat = "html" | "latex";

/**
 * Maps the requested format for the engine to the one required from Pandoc.
 * Every requested output format from an engine's standpoint maps to a requested
 * output format on Pandoc's point.
 * When the formats are not the same, it means that the output from Pandoc will
 * be processed more in order to get the final desired format.
 * @param requestedFormat 
 */
export function mapOutputFormat(requestedFormat: OutputFormat): PandocOutputFormat {
    switch (requestedFormat) {
        case "html":
            return "html";
        default:
        case "pdf":
            return "latex";
    }
}

/**
 * Entry point to invoke Pandoc.
 */
export class Pandoc {
    private pathToExec: string;

    /**
     * Creates a new instance of this class.
     * @param pathToExec The path to Pandoc's executable.
     *     If not provided, default will be used depending on OS.
     */
    constructor(pathToExec?: string) {
        this.pathToExec = pathToExec || Pandoc.getPandocPathFromOS();
    }

    /**
     * Executes Pandoc with the specified arguments.
     * @param from The format from which translating.
     * @param to The desired output format.
     * @param src The path to the file to translate.
     * @param dst The path to the output file.
     */
    public execute(from: string, to: string, src: string, dst: string): void {
        process.execFileSync(this.pathToExec, [
            src,
            "--from", from,
            "--to", to,
            "--output", dst
        ]);
    }

    private static getPandocPathFromOS(): string {
        switch (os.platform()) {
            case "win32":
                return path.join("C:", "Program Files", "Pandoc", "pandoc.exe");
            default:
                throw new Error("Not supported yet");
        }
    }
}
