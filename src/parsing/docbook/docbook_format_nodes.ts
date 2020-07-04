/** Andrea Tino - 2020 */

import { FormatNode, isFormatNode } from "../format_node";
import { DocbookTokens as Tokens } from "./docbook_tokens";
import { generateRandomSimpleId } from "../../utils";

/**
 * Describes the DocBook root.
 */
export class DocBookRootFormatNode extends FormatNode {
    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     */
    constructor(
        private content: FormatNode
    ) {
        super();
    }

    /**
     * Gets the collection of children in non-terminal 'textstream'.
     */
    public get children(): Array<FormatNode> {
        const arrayFormatNode = this.content as DocBookArrayFormatNode<FormatNode>;
        return arrayFormatNode.items;
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_BOOK_OPEN_TAG_TOKEN;
        const after = Tokens.DOCBOOK_BOOK_CLOSE_TAG_TOKEN;

        return `${before}${this.content.toString()}${after}`;
    }
}

/**
 * Describes the DocBook paragraph.
 */
export class DocBookParagraphFormatNode extends FormatNode {
    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     */
    constructor(
        private content: FormatNode
    ) {
        super();
    }

    /**
     * Gets the collection of children in non-terminal 'textstream'.
     */
    public get children(): Array<FormatNode> {
        // The generator will create format nodes for formatting AST nodes and literal nodes for strings
        const arrayFormatNode = this.content as DocBookArrayFormatNode<FormatNode>;
        return arrayFormatNode.items;
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_PARAGRAPH_OPEN_TAG_TOKEN;
        const after = Tokens.DOCBOOK_PARAGRAPH_CLOSE_TAG_TOKEN;

        return `${before}${this.content.toString()}${after}`;
    }
}

/**
 * Describes the DocBook heading.
 */
export class DocBookHeadingFormatNode extends FormatNode {
    /**
     * Initializes a new instance of this class.
     * @param paragraph The paragraph associated to the heading.
     * @param title The title of the heading.
     * @param _level The level of the heading (number of '#').
     *     Examples are:
     *     - '# Title' => level = 1
     *     - '## Title' => level = 2
     *     - etc.
     * @param id The id to assign to the section. If nothing is passed, a random one will be created.
     */
    constructor(
        private paragraph: FormatNode,
        private title: string,
        private _level: number,
        private id?: string
    ) {
        super();
    }

    /** Gets the level. */
    public get level(): number {
        return this.level;
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_SECTION_OPEN_TAG_TOKEN(this.id || generateRandomSimpleId());
        const after = Tokens.DOCBOOK_SECTION_CLOSE_TAG_TOKEN;

        const beforeTitle = Tokens.DOCBOOK_TITLE_OPEN_TAG_TOKEN;
        const afterTitle = Tokens.DOCBOOK_TITLE_CLOSE_TAG_TOKEN;
        const title = `${beforeTitle}${this.title}${afterTitle}`;

        return `${before}${title}${this.paragraph.toString()}${after}`;
    }
}

/**
 * Describes the DocBook section.
 * Note: This has no corresponding non-literal in the grammar but it is present for utility.
 */
export class DocBookSectionFormatNode extends FormatNode {
    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     * @param id The id to assign to the section. If nothing is passed, a random one will be created.
     */
    constructor(
        private content: FormatNode,
        private id?: string
    ) {
        super();
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_SECTION_OPEN_TAG_TOKEN(this.id || generateRandomSimpleId());
        const after = Tokens.DOCBOOK_SECTION_CLOSE_TAG_TOKEN;

        return `${before}${this.content.toString()}${after}`;
    }
}

/**
 * Describes an DocBook literal.
 */
export class DocBookLiteralFormatNode extends FormatNode {
    /**
     * Initializes a new instance of this class.
     * @param literal The literal node to include.
     */
    constructor(
        private literal: FormatNode | string
    ) {
        super();

        this.literal = literal;
    }

    /** @inheritdoc */
    public toString(): string {
        if (isFormatNode(this.literal)) {
            return this.literal.toString();
        }

        return this.literal;
    }
}

/**
 * Describes an DocBook array.
 * @typedef T The type of items.
 */
export class DocBookArrayFormatNode<T = FormatNode | string> extends FormatNode {
    /**
     * Initializes a new instance of this class.
     * @param array The array node to include.
     * @param stringifier When T is not a 'FormatNode', this function is called
     *     to get the string representation of items.
     * @param separator The string to use for separating items when rendering.
     */
    constructor(
        private array: Array<T>,
        private stringifier?: (v: T) => string,
        private separator: string = "\n"
    ) {
        super();
    }

    /**
     * Gets the items in the array.
     */
    public get items(): Array<T> {
        return this.array;
    }

    /** @inheritdoc */
    public toString(): string {
        const result = new Array<string>();

        for (let i = 0; i < this.array.length; i++) {
            const item = this.array[i];
            result.push(this.item2String(item));
        }

        return result.reduce((a, b) => `${a}${this.separator}${b}`);
    }

    private item2String(item: T): string {
        if (isFormatNode(item)) {
            return item.toString();
        }

        if (this.stringifier) {
            return this.stringifier(item);
        }

        throw new Error(`Item ${JSON.stringify(item)} could not be stringified.`);
    }
}
