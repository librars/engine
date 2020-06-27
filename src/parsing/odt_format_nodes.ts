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
