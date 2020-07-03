/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { Transformer } from "./transformer";
import { Logger } from "../logging/logger";
import { Generator } from "./generator";
import { MDParser } from "./parser";

/**
 * Describes a pipeline for parsing input files into output to pass to Pandoc.
 */
export class ParsingPipeline {
    /**
     * Initializes a new instance of this class.
     * @param formatter The formatter to use.
     * @param transformer The transformer to use.
     * @param logger The logger to use.
     */
    constructor(
        private formatter: Formatter,
        private transformer: Transformer,
        private logger?: Logger) {
    }

    /**
     * Runs the parsing pipeline.
     * @param input The input string to parse.
     */
    public run(input: string): string {
        return new Generator(this.formatter, this.transformer, this.logger).generate(
            new MDParser().parse(input)
        );
    }
}
