/** Andrea Tino - 2020 */

import { MDNodeType } from "./ast_types";

/**
 * Describes a node in the AST.
 */
export interface MDNode {
    t: MDNodeType,
    v: MDNode | Array<MDNode> | string | Array<string>
}

/**
 * Main parser.
 */
export class MDParser {
    private static generatedParserFileName = "generated_parser.js";

    /**
     * Parses a string.
     * @param input String to parse.
     */
    public parse(input: string): MDNode {
        return <MDNode>this.invokeGeneratedParser(input);
    }

    private invokeGeneratedParser(input: string): unknown {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(`./${MDParser.generatedParserFileName}`).parse(input);
    }
}
