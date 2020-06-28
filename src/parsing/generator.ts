/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { MDNode } from "./parser";
import { FormatNode } from "./format_node";
import { MDNodeValue, isMDNodeValueOfTypeNode, isMDNodeValueOfTypeString, isMDNodeValueOfTypeNodeArray, isMDNodeValueOfTypeStringArray } from "./ast_types";

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
        const formatTree = this.generateFormatTreeNode(ast);

        // Generate the output
        return formatTree.toString();
    }

    private generateFormatTreeNode(ast: MDNodeValue): FormatNode {
        // Run through all possible node types and use the corresponding format function

        if (isMDNodeValueOfTypeNode(ast)) {
            switch (ast.t) {
                case "ROOT":
                    return this.formatter.generateRoot(this.generateFormatTreeNode(ast.v));
            }

            throw new Error(`Error mapping AST node of type '${ast.t}', cannot find a proper format node. 
                AST node was: '${JSON.stringify(ast)}'`);
        }

        if (isMDNodeValueOfTypeString(ast)) {
            return this.formatter.generateLiteral(ast);
        }

        if (isMDNodeValueOfTypeNodeArray(ast)) {
            const formatNodeArray = new Array<FormatNode>();
            for (let i = 0; i < ast.length; i++) {
                formatNodeArray.push(this.generateFormatTreeNode(ast[i]));
            }

            return this.formatter.generateArray(formatNodeArray);
        }

        if (isMDNodeValueOfTypeStringArray(ast)) {
            const formatNodeArray = new Array<FormatNode>();
            for (let i = 0; i < ast.length; i++) {
                formatNodeArray.push(this.formatter.generateLiteral(ast[i]));
            }

            return this.formatter.generateArray(formatNodeArray);
        }

        throw new Error(`AST node type not recognized. AST node was: '${JSON.stringify(ast)}'`);
    }
}
