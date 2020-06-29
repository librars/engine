/** Andrea Tino - 2020 */

/** Describes a dictionary for storing chunks */
export type ChuncksDict = { [k: string]: string };

/** Describes a dictionary for storing placeholders */
export type PlaceholderDict = { [k: string]: FormatNode };

/**
 * Describes a node in the format output tree.
 */
export abstract class FormatNode {
    /** String chuncks describing fixed assets to adjoin. */
    protected chuncks: ChuncksDict;

    /** Placeholders to use to join chuncks. */
    protected placeholders: PlaceholderDict;

    /**
     * Initializes a new instance of this class.
     * @param chuncks Dictionary of chuncks.
     * @param placeholders Dictionary of placeholders.
     */
    constructor(chuncks?: ChuncksDict, placeholders?: PlaceholderDict) {
        this.chuncks = chuncks || {};
        this.placeholders = placeholders || {};
    }

    /** Converts the node into the final representation. */
    public abstract toString(): string;
}

/**
 * Type guard.
 * @param element The element to check.
 */
export function isFormatNode(element: any): element is FormatNode { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    return typeof(element) === "object" && "toString" in element;
}

/**
 * Describes a format node producing an empty string
 */
export class EmptyFormatNode extends FormatNode {
    /** @inheritdoc */
    public toString(): string {
        return "";
    }
}
