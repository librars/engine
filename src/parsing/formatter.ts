/** Andrea Tino - 2020 */

import { FormatNode } from "./format_node";

/**
 * Describes a formatter for the output generation.
 */
export interface Formatter {
    /** Gets the identifier of the format for Pandco */
    formatId: string;

    /** Generates the root. */
    generateRoot(...input: Array<FormatNode>): FormatNode;

    /** Generates a literal. */
    generateLiteral(input: string): FormatNode;

    /** Generates an array. */
    generateArray(input: Array<FormatNode | string>): FormatNode;
}
