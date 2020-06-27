/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { MDNode } from "./parser";
import { FormatNode } from "./format_node";

/**
 * Describes a generator to convert an AST into the output format.
 * @type {F} The formatter to use
 */
export class Generator {
    private formatter: Formatter;

    /**
     * Initializes a new instance of this class.
     * @param {Formatter} formatter The formatter to use.
     */
    constructor(formatter: Formatter) {
        this.formatter = formatter;
    }

    /**
     * Generates the output from the AST.
     * 
     * In the first stage, the AST is converted into a tree of FormatNode(s).
     * Later on, the string coversion is recursively called on that tree producing
     * the final output.
     * @param {MDNode} ast The AST emitted by the parser.
     */
    public generate(ast: MDNode): string {
        // Recursively create the format tree
        const formatTree = this.generateTree(ast);

        // Generate the output
        return formatTree.toString();
    }

    private generateTree(ast: MDNode): FormatNode {
        switch (ast.t) {
            case "ROOT":
                return this.formatter.generateRoot(this.generateTree(<MDNode>ast.v));
        }

        throw new Error(`Error mapping AST node type '${ast.t}', cannot find a proper format node`);
    }
}
