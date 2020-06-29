/** Andrea Tino - 2020 */

import { FormatNode } from "./format_node";

/**
 * Describes a formatter for the output generation.
 */
export interface Formatter {
    /** Gets the identifier of the format for Pandoc */
    formatId: string;

    /** Generates the root. Formatter for nodes of type 'ROOT'. */
    generateRoot(...input: Array<FormatNode>): FormatNode;

    /** Generates a paragraph block. Formatter for nodes of type 'PARAGRAPH:BLOCK'. */
    generateParagraphBlock(...input: Array<FormatNode>): FormatNode;

    /** Generates a text inline element. Formatter for nodes of type 'TEXT:INLINE'. */
    generateTextInline(input: FormatNode): FormatNode;

    /** Generates a literal. */
    generateLiteral(input: string): FormatNode;

    /** Generates an array. */
    generateArray(input: Array<FormatNode | string>): FormatNode;
}
