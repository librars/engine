/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { Transformer } from "./transformer";
import { Logger } from "../logging/logger";
import { Generator } from "./generator";
import { MDParser, MDNode } from "./parser";
import { FormatNode } from "./format_node";

/**
 * Describes a pipeline for parsing input files into output to pass to Pandoc.
 */
export class ParsingPipeline {
    // Cached quantities
    private _ast: MDNode | null = null;
    private _generatedTree: FormatNode | null = null;
    private _transformedTree: FormatNode | null = null;
    private _renderedOutput: string | null = null;

    /**
     * Initializes a new instance of this class.
     * @param formatter The formatter to use.
     *     The formatter is responsible for create every format node which will be
     *     responsible for generating the output format.
     * @param transformer The transformer to use.
     *     The transformer will take the (non-annotated) format tree and rearrange it in
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
        // 1. Generate the AST
        this._ast = new MDParser().parse(input);

        // 2. Recursively create the format tree
        this._generatedTree = new Generator(
            this.formatter,
            this.logger
        ).generate(this._ast);

        // 3. Call the transformer to get from the format-tree to the annotated-format-tree
        //    which is the structure ready for emitting the final output.
        this._transformedTree = this.transformer.transform(this._generatedTree);

        // 4. Emit output
        this._renderedOutput = this._transformedTree.toString();

        return this._renderedOutput;
    }

    /** Gets the AST generated from latest call to 'run'. */
    public get ast(): MDNode | null {
        return this._ast;
    }

    /** Gets the parsed tree created from latest call to 'run'. */
    public get generatedTree(): FormatNode | null {
        return this._generatedTree;
    }

    /** Gets the transformed tree created from latest call to 'run'. */
    public get transformedTree(): FormatNode | null {
        return this._transformedTree;
    }

    /** Gets the rendered output generated from latest call to 'run'. */
    public get renderedOutput(): string | null {
        return this._renderedOutput;
    }
}
