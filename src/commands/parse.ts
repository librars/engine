/** Andrea Tino - 2020 */

import path from "path";
import os from "os"
import yargs from "yargs";
import process from "child_process"

import { Command } from "./command";
import { getAppDataDirPath } from "../utils";

/**
 * Describe a "parse" command.
 */
export class ParseCommand implements Command {
    /**
     * Initializes a new instance of this class.
     * @param filePath Path to the file to parse.
     * @param pandocPath The path to Pandoc executable.
     * @param intermediateFolder The intermediate folder.
     */
    constructor(
        private filePath: string,
        private pandocPath: string,
        private intermediateFolder: string
    ) {
        if (!filePath) throw new Error("Parameter 'filePath' required");
        if (!pandocPath) throw new Error("Parameter 'pandocPath' required");
        if (!intermediateFolder) throw new Error("Parameter 'intermediateFolder' required");
    }

    /** @inheritdoc */
    public execute(): void {
        // Prepare session
        // Run parser and generate output file
        // Run Pandoc
        process.execFileSync(this.filePath, {});
    }

    /**
     * Registers the handler.
     */
    public static getHandler(): yargs.Argv<{}> {
        return yargs.command("parse <file>", "", y => {
            return y.option("pandoc-path", {
                alias: "p",
                default: ParseCommand.getDefaultPandocPath()
            }).option("intermediate-folder", {
                alias: "f",
                default: ParseCommand.getDefaultIntermediateFolder()
            });
        }, argv => {
            new ParseCommand(
                <string>argv["file"],
                argv["pandoc-path"],
                argv["intermediate-folder"]
            ).execute();
        });
    }

    private static getDefaultPandocPath(): string {
        switch (os.platform()) {
            case "win32":
                return path.join("C:", "Program Files", "Pandoc", "pandoc.exe");
            default:
                throw new Error("Not supported yet");
        }
    }

    private static getDefaultIntermediateFolder(): string {
        return getAppDataDirPath();
    }
}
