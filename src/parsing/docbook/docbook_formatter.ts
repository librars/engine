/** Andrea Tino - 2020 */

import { Formatter } from "../formatter";
import { FormatNode } from "../format_node";
import { DocBookRootFormatNode, DocBookLiteralFormatNode, DocBookArrayFormatNode } from "./docbook_format_nodes";

/**
 * A formatter to output DocBookF format.
 */
export class DocBookFormatter implements Formatter {
    /** @inheritdoc */
    public get formatId(): string {
        return "odt";
    }

    /** @inheritdoc */
    public generateRoot(content: FormatNode): FormatNode {
        return new DocBookRootFormatNode(content);
    }

    /** @inheritdoc */
    public generateParagraphBlock(...content: Array<FormatNode>): FormatNode {
        return new DocBookArrayFormatNode(content);
    }

    /** @inheritdoc */
    public generateTextInline(text: FormatNode): FormatNode {
        return new DocBookLiteralFormatNode(text);
    }

    /** @inheritdoc */
    public generateLiteral(literal: string): FormatNode {
        return new DocBookLiteralFormatNode(literal);
    }

    /** @inheritdoc */
    public generateArray(array: Array<FormatNode | string>): FormatNode {
        return new DocBookArrayFormatNode(array);
    }
}
