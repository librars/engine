/** Andrea Tino - 2020 */

import path from "path";
import yargs from "yargs";
import fs from "fs";

import { Command } from "./command";
import { MDParser } from "../parsing/parser";
import { Generator } from "../parsing/generator";
import { Formatter } from "../parsing/formatter";
import { DocBookFormatter } from "../parsing/docbook/docbook_formatter";
import { OutputFormat } from "../config";
import { mapOutputFormat, Pandoc, PandocOutputFormat } from "../pandoc";
import { Transformer } from "../parsing/transformer";
import { DocBookTransformer } from "../parsing/docbook/docbook_transformer";

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
        private pandocPath?: string,
        private intermediateFolder?: string
    ) {
        super(intermediateFolder);

        if (!filePath) throw new Error("Parameter 'filePath' required");

        format = format || "pdf";
    }

    /** @inheritdoc */
    protected executeCore(): void {
        this.session.logger.info(`Entered command 'parse' - Session: '${this.session.id}' created.`);

        // Run parser and generator and generate output file
        const input: string = fs.readFileSync(this.filePath, {encoding: "utf-8"});
        const formatter: Formatter = new DocBookFormatter();
        const transformer: Transformer = new DocBookTransformer();
        const output = new Generator(formatter, transformer, this.session.logger).generate(
            new MDParser().parse(input)
        );
        const outputFileName = `output.${formatter.fileExtension}`;
        this.session.addFile(outputFileName, output);
        this.session.logger.info(`Generated Pandoc input file: '${outputFileName}'`);

        // Run Pandoc
        const pandocOutputFormat = mapOutputFormat(this.format);
        const generatedFileName = `generated_output.${ParseCommand.outputFormat2Ext(pandocOutputFormat)}`;
        const generatedFilePath = path.join(this.session.sessionDirPath, generatedFileName);
        this.session.logger.info(`Running Pandoc from '${formatter.formatId}' to '${mapOutputFormat(this.format)}' on: '${outputFileName}'...`);
        new Pandoc(this.pandocPath).execute(
            formatter.formatId,                         // From
            pandocOutputFormat,                         // To
            this.session.getFilePath(outputFileName),   // Src
            generatedFilePath                           // Dst
        );
        this.session.logger.info(`Pandoc parsing completed, output file: ${generatedFileName}`);

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
                default: undefined
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

    private static outputFormat2Ext(format: PandocOutputFormat): string {
        switch (format) {
            case "latex":
                return "tex";
            case "html":
                return "html";
        }
    }
}
