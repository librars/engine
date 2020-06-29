/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { FormatNode } from "./format_node";
import { ODTRootFormatNode, ODTLiteralFormatNode, ODTArrayFormatNode } from "./odt_format_nodes";

/**
 * A formatter to output ODT format.
 */
export class ODTFormatter implements Formatter {
    /** @inheritdoc */
    public get formatId(): string {
        return "odt";
    }

    /** @inheritdoc */
    public generateRoot(content: FormatNode): FormatNode {
        return new ODTRootFormatNode(content);
    }

    /** @inheritdoc */
    public generateParagraphBlock(...content: Array<FormatNode>): FormatNode {
        return new ODTArrayFormatNode(content);
    }

    /** @inheritdoc */
    public generateTextInline(text: FormatNode): FormatNode {
        return new ODTLiteralFormatNode(text);
    }

    /** @inheritdoc */
    public generateLiteral(literal: string): FormatNode {
        return new ODTLiteralFormatNode(literal);
    }

    /** @inheritdoc */
    public generateArray(array: Array<FormatNode | string>): FormatNode {
        return new ODTArrayFormatNode(array);
    }
}
