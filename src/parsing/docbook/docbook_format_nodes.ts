/** Andrea Tino - 2020 */

import { FormatNode, isFormatNode } from "../format_node";
import { DocbookTokens as Tokens } from "./docbook_tokens";
import { generateRandomSimpleId } from "../../utils";

/**
 * Describes the DocBook root.
 */
export class DocBookRootFormatNode extends FormatNode {
    private content: FormatNode;

    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     */
    constructor(content: FormatNode) {
        super();

        this.content = content;
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
    private content: FormatNode;

    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     */
    constructor(content: FormatNode) {
        super();

        this.content = content;
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
 * Describes the DocBook section.
 */
export class DocBookSectionFormatNode extends FormatNode {
    private content: FormatNode;
    private id: string;

    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     * @param id The id to assign to the section. If nothing is passed, a random one will be created.
     */
    constructor(content: FormatNode, id?: string) {
        super();

        this.content = content;
        this.id = id || generateRandomSimpleId();
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_SECTION_OPEN_TAG_TOKEN(this.id);
        const after = Tokens.DOCBOOK_SECTION_CLOSE_TAG_TOKEN;

        return `${before}${this.content.toString()}${after}`;
    }
}

/**
 * Describes an DocBook literal.
 */
export class DocBookLiteralFormatNode extends FormatNode {
    private literal: FormatNode | string;

    /**
     * Initializes a new instance of this class.
     * @param literal The literal node to include.
     */
    constructor(literal: FormatNode | string) {
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
    private array: Array<T>;
    private stringifier?: (v: T) => string;

    /**
     * Initializes a new instance of this class.
     * @param array The array node to include.
     * @param stringifier When T is not a 'FormatNode', this function is called
     *     to get the string representation of items.
     */
    constructor(array: Array<T>, stringifier?: (v: T) => string) {
        super();

        this.array = array;
        this.stringifier = stringifier;
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

        return result.reduce((a, b) => `${a}\n${b}`);
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
