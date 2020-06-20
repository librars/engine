/** Andrea Tino - 2020 */

import { readFileSync } from "fs"
import { join } from "path"
import { generate, Parser } from "pegjs";

/**
 * Main parser.
 */
export class MDParser {
    private generatedParser: Parser;

    constructor() {
        const grammarfile = join(__dirname, "grammar.pegjs");
        this.generatedParser = generate(readFileSync(grammarfile).toString(), {
            trace: true
        })
    }

    /**
     * Parses a string.
     * @param input String to parse.
     */
    public parse(input: string): any {
        return this.generatedParser.parse(input);
    }
}
