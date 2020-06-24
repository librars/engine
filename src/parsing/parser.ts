/** Andrea Tino - 2020 */

import { MDNodeType } from "./ast_types";

export interface MDNode {
    t: MDNodeType,
    v: MDNode | Array<MDNode> | string | Array<string>
}

/**
 * Main parser.
 */
export class MDParser {
    private static generatedParserFileName: string = "generated_parser.js";

    constructor() {
    }

    /**
     * Parses a string.
     * @param input String to parse.
     */
    public parse(input: string): MDNode {
        return this.invokeGeneratedParser(input);
    }

    private invokeGeneratedParser(input: string): any {
        return require(`./${MDParser.generatedParserFileName}`).parse(input);
    }
}
