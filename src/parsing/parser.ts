/** Andrea Tino - 2020 */

import { readFileSync } from "fs"
import { generate, Parser } from "pegjs";

/**
 * Main parser.
 */
export class MDParser {
    private generatedParser: Parser;

    constructor() {
        this.generatedParser = generate(readFileSync("grammar.pegjs").toString(), {
            trace: true
        })
    }

    /**
     * Parses a string.
     * @param input String to parse.
     */
    public parse(input: string): void {
        let ast = this.generatedParser.parse(input);
    }
}
