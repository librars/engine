/** Andrea Tino - 2020 */

import { FormatNode } from "./format_node";

/**
 * Describes the ODT root.
 */
export class ODTRootFormatNode extends FormatNode {
    private static BEFORE_CHUNK_K = "before_chunk_k";
    private static AFTER_CHUNK_K = "after_chunk_k";
    private static CONTENT_PLACEHOLDER_K = "content_placeholder_k";

    constructor(content: FormatNode) {
        super();

        this.placeholders = {
            CONTENT_PLACEHOLDER_K: content
        };

        this.chuncks = {
            BEFORE_CHUNK_K: "<root>",
            AFTER_CHUNK_K: "</root>"
        };
    }

    /** @inheritdoc */
    public toString(): string {
        const before = this.chuncks[ODTRootFormatNode.BEFORE_CHUNK_K];
        const after = this.chuncks[ODTRootFormatNode.AFTER_CHUNK_K];

        const content = this.placeholders[ODTRootFormatNode.CONTENT_PLACEHOLDER_K].toString();

        return `${before}${content}${after}`;
    }
}

/**
 * Describes an ODT literal.
 */
export class ODTLiteralFormatNode extends FormatNode {
    private literal: string;

    constructor(literal: string) {
        super();

        this.literal = literal;
    }

    /** @inheritdoc */
    public toString(): string {
        return this.literal;
    }
}

/**
 * Describes an ODT array.
 */
export class ODTArrayFormatNode extends FormatNode {
    private array: Array<FormatNode | string>;

    constructor(array: Array<FormatNode | string>) {
        super();

        this.array = array;
    }

    /** @inheritdoc */
    public toString(): string {
        const result = new Array<string>();

        for (let i = 0; i < this.array.length; i++) {
            const element = this.array[i];
            result.push(this.isFormatNode(element) ? element.toString() : element);
        }

        return result.reduce((a, b) => `${a}\n${b}`);
    }

    private isFormatNode(element: any): element is FormatNode { // eslint-disable-line @typescript-eslint/no-explicit-any
        return "toString" in element;
    }
}
