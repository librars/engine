/** Andrea Tino - 2020 */

import { Formatter } from "../formatter";
import { FormatNode } from "../format_node";
import { DocBookRootFormatNode, DocBookLiteralFormatNode, DocBookArrayFormatNode, DocBookParagraphFormatNode, DocBookHeadingFormatNode } from "./docbook_format_nodes";

/** Describes a function to generate ids. */
export type IdGenerator = (input?: unknown) => string;

/**
 * A formatter to output DocBookF format.
 */
export class DocBookFormatter implements Formatter {
    /**
     * Initializes a new instance of this class.
     * @param idgen The id generator to use.
     */
    constructor(
        private idgen?: IdGenerator
    ) {
    }

    /** @inheritdoc */
    public get formatId(): string {
        return "docbook";
    }

    /** @inheritdoc */
    public get fileExtension(): string {
        return "docbook.xml";
    }

    /** @inheritdoc */
    public generateRoot(content: DocBookArrayFormatNode<FormatNode>): FormatNode {
        return new DocBookRootFormatNode(content);
    }

    /** @inheritdoc */
    public generateParagraphBlock(...content: Array<FormatNode>): FormatNode {
        return new DocBookParagraphFormatNode(
            new DocBookArrayFormatNode(content)
        );
    }
    /** @inheritdoc */
    public generateHeadingBlock(title: string, level: number, paragraph?: FormatNode): FormatNode {
        return new DocBookHeadingFormatNode(title, level, paragraph, this.generateId());
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
    public generateArray<T extends { clone(): T } = FormatNode>(array: Array<T>): FormatNode {
        return new DocBookArrayFormatNode<T>(array);
    }

    private generateId(): string | undefined {
        if (!this.idgen) {
            return undefined;
        }
        return this.idgen();
    }
}
