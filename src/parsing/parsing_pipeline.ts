/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { Transformer } from "./transformer";
import { Logger } from "../logging/logger";
import { Generator } from "./generator";
import { MDParser } from "./parser";
import { FormatNode } from "./format_node";

/**
 * Describes a pipeline for parsing input files into output to pass to Pandoc.
 */
export class ParsingPipeline {
    /**
     * Initializes a new instance of this class.
     * @param formatter The formatter to use.
     *     The formatter is responsible for create every format node which will be
     *     responsible for generating the output format.
     * @param transformer The transformer to use.
     *     The transformer will take the annotated format tree and rearrange it in
     *     the final tree ready to be recursively processed for output generation.
     *     The final tree will have annotations removed.
     * @param logger The logger to use for tracing. When undefined, no logging occurs.
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
        // Recursively create the format tree
        const generatedTree: FormatNode = new Generator(this.formatter, this.logger).generate(
            new MDParser().parse(input)
        );

        // Call the transformer to get from the annotated-format-tree to the format-tree
        // which is the structure ready for emitting the final output.
        const transformedTree = this.transformer.transform(generatedTree);

        // Emit output
        return transformedTree.toString();
    }
}
