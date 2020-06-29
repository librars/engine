/** Andrea Tino - 2020 */

import path from "path";
import os from "os"
import yargs from "yargs";
import process from "child_process"
import fs from "fs";

import { Command } from "./command";
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
export class ParseCommand extends Command {
    /**
     * Initializes a new instance of this class.
     * @param filePath Path to the file to parse.
     * @param format The output format.
     * @param pandocPath The path to Pandoc executable.
     * @param intermediateFolder The intermediate folder.
     */
    constructor(
        private filePath: string,
        private format: OutputFormat,
        private pandocPath: string,
        private intermediateFolder?: string
    ) {
        super(intermediateFolder);

        if (!filePath) throw new Error("Parameter 'filePath' required");
        if (!pandocPath) throw new Error("Parameter 'pandocPath' required");

        format = format || "pdf";
    }

    /** @inheritdoc */
    protected executeCore(): void {
        this.session.logger.info(`Entered command 'parse' - Session: '${this.session.id}' created.`);

        // Run parser and generator and generate output file
        const input: string = fs.readFileSync(this.filePath, {encoding: "utf-8"});
        const formatter: Formatter = new ODTFormatter();
        const output = new Generator(formatter, this.session.logger).generate(
            new MDParser().parse(input)
        );
        const outputFileName = "output.odt";
        this.session.addFile(outputFileName, output);

        // Run Pandoc
        const generatedFileName = `generated_output.${ParseCommand.outputFormat2Ext(this.format)}`;
        const generatedFilePath = path.join(this.session.sessionDirPath, generatedFileName);
        process.execFileSync(this.pandocPath, [
            this.session.getFilePath(outputFileName),
            "--from", formatter.formatId,
            "--to", this.format,
            "--output", generatedFilePath
        ]);
        this.session.logger.info(`Parsing completed, output: ${generatedFileName}`);

        // Provide output file to the user
        const userDstGeneratedOutputFilePath = path.join(__dirname, generatedFileName);
        fs.copyFileSync(generatedFilePath, userDstGeneratedOutputFilePath);
        this.session.logger.info(`Output generation completed - File: '${userDstGeneratedOutputFilePath}'.`);

        this.session.logger.info(`Command 'parse' completed - Session: '${this.session.id}' closing.`);
    }

    /** @inheritdoc */
    protected get commandName(): string {
        return "Parse";
    }

    /**
     * Registers the handler.
     */
    public static getHandler(): yargs.Argv<unknown> {
        return yargs.command("parse <file>", "", y => {
            return y.option("pandoc-path", {
                alias: "p",
                default: ParseCommand.getDefaultPandocPath()
            }).option("intermediate-folder", {
                alias: "i",
                default: Command.getDefaultIntermediateFolder()
            }).option("format", {
                alias: "f",
                default: "pdf"
            });
        }, argv => {
            const command = new ParseCommand(
                <string>argv["file"],
                <OutputFormat>argv["format"],
                argv["pandoc-path"],
                argv["intermediate-folder"]
            );
            command.execute();
            command.dispose();
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

    private static outputFormat2Ext(format: OutputFormat): string {
        switch (format) {
            case "pdf":
                return "pdf";
            case "html":
                return "html";
        }
    }
}
