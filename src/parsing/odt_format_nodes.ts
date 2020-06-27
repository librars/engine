/** Andrea Tino - 2020 */

import { FormatNode } from "./format_node";

/**
 * Describes the ODT root.
 */
export class RootFormatNode extends FormatNode {
    private static BEFORE_CHUNK_K: string = "before_chunk_k";
    private static AFTER_CHUNK_K: string = "after_chunk_k";
    private static CONTENT_PLACEHOLDER_K: string = "content_placeholder_k";

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
        const before = this.chuncks[RootFormatNode.BEFORE_CHUNK_K];
        const after = this.chuncks[RootFormatNode.AFTER_CHUNK_K];

        const content = this.placeholders[RootFormatNode.CONTENT_PLACEHOLDER_K].toString();

        return `${before}${content}${after}`;
    }
}
