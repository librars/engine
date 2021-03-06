/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { MDNode } from "./parser";
import { FormatNode } from "./format_node";
import { MDNodeValue, isMDNodeValueOfTypeNode, isMDNodeValueOfTypeString, isMDNodeValueOfTypeNodeArray, isMDNodeValueOfTypeStringArray, isMDNodeValueOfTypeHeading } from "./ast_types";
import { Logger } from "../logging/logger";

/**
 * Describes a generator to convert an AST into the output format.
 * 
 * Important: keep the generator agnostic of the specific formatters.
 * @type {F} The formatter to use.
 */
export class Generator {
    private formatter: Formatter;
    private logger?: Logger;

    /**
     * Initializes a new instance of this class.
     * @param formatter The formatter to use.
     *     The formatter is responsible for create every format node which will be
     *     responsible for generating the output format.
     * @param logger The logger to use for tracing. When undefined, no logging occurs.
     */
    constructor(formatter: Formatter, logger?: Logger) {
        this.formatter = formatter;
        this.logger = logger;
    }

    /**
     * Generates the output from the AST.
     * 
     * In the first stage, the AST is converted into a tree of FormatNode(s).
     * Later on, the string coversion is recursively called on that tree producing
     * the final output.
     * @param {MDNode} ast The AST emitted by the parser.
     */
    public generate(ast: MDNode): FormatNode {
        return this.generateFormatTreeNode(ast);
    }

    private generateFormatTreeNode(ast: MDNodeValue): FormatNode {
        // Run through all possible node types and use the corresponding format function

        if (isMDNodeValueOfTypeNode(ast)) {
            switch (ast.t) {
                case "ROOT":
                    this.trace("Generating ROOT", ast);
                    return this.formatter.generateRoot(this.generateFormatTreeNode(ast.v));
                case "HEADING:BLOCK":
                    this.trace("Generating HEADING:BLOCK", ast);
                    if (isMDNodeValueOfTypeNode(ast.v) && ast.v.t === "HEADING" && isMDNodeValueOfTypeHeading(ast.v.v)) {
                        // Expecting type 'HEADING'
                        return this.formatter.generateHeadingBlock(
                            ast.v.v.title, ast.v.v.level,
                            ast.v.v.paragraph ? this.generateFormatTreeNode(ast.v.v.paragraph) : undefined);
                    }
                    throw new Error(`Unexpected value node. Expected 'HEADING', got: '${JSON.stringify(ast.v)}'`);
                case "PARAGRAPH:BLOCK":
                    this.trace("Generating PARAGRAPH:BLOCK", ast);
                    // A paragraph might fall inside its own section or not
                    // We generatejust the paragraph here, it's up to the transformer to handle this situation
                    return this.formatter.generateParagraphBlock(this.generateFormatTreeNode(ast.v));
                case "TEXT:INLINE":
                    this.trace("Generating TEXT:INLINE", ast);
                    return this.formatter.generateTextInline(this.generateFormatTreeNode(ast.v));
            }

            throw new Error(`Error mapping AST node of type '${ast.t}', cannot find a proper format node. 
                AST node was: '${JSON.stringify(ast)}'`);
        }

        if (isMDNodeValueOfTypeString(ast)) {
            this.trace("Generating a string", ast);
            return this.formatter.generateLiteral(ast);
        }

        if (isMDNodeValueOfTypeNodeArray(ast)) {
            this.trace("Generating an array of nodes", ast);

            const formatNodeArray = new Array<FormatNode>();
            for (let i = 0; i < ast.length; i++) {
                formatNodeArray.push(this.generateFormatTreeNode(ast[i]));
            }

            return this.formatter.generateArray(formatNodeArray);
        }

        if (isMDNodeValueOfTypeStringArray(ast)) {
            this.trace("Generating an array of string", ast);

            const formatNodeArray = new Array<FormatNode>();
            for (let i = 0; i < ast.length; i++) {
                formatNodeArray.push(this.formatter.generateLiteral(ast[i]));
            }

            return this.formatter.generateArray(formatNodeArray);
        }

        throw new Error(`AST node type not recognized. AST node was: '${JSON.stringify(ast)}'`);
    }

    private trace(message: string, node?: unknown): void {
        if (!this.logger) {
            return;
        }

        const msg = !node
            ? message
            : `${message} - Node is: '${JSON.stringify(node)}'`;

        this.logger.trace(msg);
    }
}
