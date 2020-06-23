/** Andrea Tino - 2020 */

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
    public parse(input: string): any {
        return this.invokeGeneratedParser(input);
    }

    private invokeGeneratedParser(input: string): any {
        return require(`./${MDParser.generatedParserFileName}`).parse(input);
    }
}
