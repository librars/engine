/** Andrea Tino - 2020 */

import { readFileSync } from "fs"
import { join } from "path"
import { generate, Parser } from "pegjs";

export interface MSParserOptions {
    trace?: boolean;
}

/**
 * Main parser.
 */
export class MDParser {
    private generatedParser: Parser;
    private options: MSParserOptions;

    constructor(options?: MSParserOptions) {
        this.options = options || MDParser.DefaultOptions;

        const grammarfile = join(__dirname, "grammar.pegjs");
        this.generatedParser = generate(readFileSync(grammarfile).toString(), {
            trace: this.options.trace || MDParser.DefaultOptions.trace
        })
    }

    private static DefaultOptions: MSParserOptions = {
        trace: false
    };

    /**
     * Parses a string.
     * @param input String to parse.
     */
    public parse(input: string): any {
        return this.generatedParser.parse(input);
    }
}
