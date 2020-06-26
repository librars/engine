/** Andrea Tino - 2020 */

import path from "path";
import os from "os"
import yargs from "yargs";
import process from "child_process"
import fs from "fs";

import { Command } from "./command";
import { getAppDataDirPath } from "../utils";
import { Session } from "../session";
import { MDParser } from "../parsing/parser";
import { Generator } from "../parsing/generator";
import { Formatter } from "../parsing/formatter";
import { ODTFormatter } from "../parsing/odt_formatter";

/**
 * Output format.
 */
export type OutputFormat = "pdf" | "html";

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
        private format: OutputFormat,
        private pandocPath: string,
        private intermediateFolder: string
    ) {
        if (!filePath) throw new Error("Parameter 'filePath' required");
        if (!pandocPath) throw new Error("Parameter 'pandocPath' required");

        format = format || "pdf";
    }

    /** @inheritdoc */
    public execute(): void {
        // Prepare session
        const session = new Session({
            dirpath: this.intermediateFolder
        });

        // Run parser and generator and generate output file
        const input: string = fs.readFileSync(this.filePath, {encoding: "utf-8"});
        const formatter: Formatter = new ODTFormatter();
        const output = new Generator(formatter).generate(
            new MDParser().parse(input)
        );
        const outputFileName = "output.odt";
        session.addFile(outputFileName, output);

        // Run Pandoc
        const generatedFileName = `generated_output.${ParseCommand.outputFormat2Ext(this.format)}`;
        process.execFileSync(this.pandocPath, [
            session.getFilePath(outputFileName),
            "--from", formatter.formatId,
            "--to", this.format,
            "--output", generatedFileName
        ]);

        // Destroy session
        session.dispose();
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
                alias: "i",
                default: ParseCommand.getDefaultIntermediateFolder()
            }).option("format", {
                alias: "f",
                default: "pdf"
            });
        }, argv => {
            new ParseCommand(
                <string>argv["file"],
                <OutputFormat>argv["format"],
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

    private static outputFormat2Ext(format: OutputFormat): string {
        switch (format) {
            case "pdf":
                return "pdf";
            case "html":
                return "html";
        }
    }
}
