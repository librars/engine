/** Andrea Tino - 2020 */

/**
 * Describes a formatter for the output generation.
 */
export interface Formatter {
    /** Gets the identifier of the format for Pandco */
    formatId: string;

    /** Generates the root. */
    generateRoot(): string;
}
