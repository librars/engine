/** Andrea Tino - 2020 */

import { FormatNode, NodesContainer, isFormatNode, ModifiableNodesContainer } from "../format_node";
import { DocbookTokens as Tokens } from "./docbook_tokens";
import { generateRandomSimpleId, addToArray, removeFromArray } from "../../utils";

/**
 * Describes the DocBook root.
 */
export class DocBookRootFormatNode extends FormatNode implements NodesContainer, ModifiableNodesContainer {
    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     */
    constructor(
        private content: DocBookArrayFormatNode<FormatNode>
    ) {
        super();
    }

    /** @inheritdoc */
    public get childNodes(): Array<FormatNode> {
        return this.content.items;
    }

    /** @inheritdoc */
    public addChildNode(node: FormatNode, at?: FormatNode | number): number {
        this.content.add(node, at);
        return this.content.items.length;
    }

    /** @inheritdoc */
    public removeChildNode(at: FormatNode | number): FormatNode {
        return this.content.remove(at);
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_BOOK_OPEN_TAG_TOKEN;
        const after = Tokens.DOCBOOK_BOOK_CLOSE_TAG_TOKEN;

        return `${before}${this.content.toString()}${after}`;
    }

    /** @inheritdoc */
    public clone(): DocBookRootFormatNode {
        return new DocBookRootFormatNode(this.content.clone());
    }
}

/**
 * Describes the DocBook paragraph.
 */
export class DocBookParagraphFormatNode extends FormatNode implements NodesContainer {
    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     */
    constructor(
        private content: FormatNode
    ) {
        super();
    }

    /** @inheritdoc */
    public get childNodes(): Array<FormatNode> {
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

    /** @inheritdoc */
    public clone(): DocBookParagraphFormatNode {
        return new DocBookParagraphFormatNode(this.content.clone());
    }
}

/**
 * Describes the DocBook heading.
 */
export class DocBookHeadingFormatNode extends FormatNode implements NodesContainer, ModifiableNodesContainer {
    private content: DocBookArrayFormatNode<FormatNode>;

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
        paragraph: FormatNode,
        private title: string,
        private _level: number,
        private id?: string
    ) {
        super();

        this.content = new DocBookArrayFormatNode<FormatNode>([paragraph]);
    }

    /** Gets the level. */
    public get level(): number {
        return this.level;
    }

    /** @inheritdoc */
    public get childNodes(): Array<FormatNode> {
        return this.content.items;
    }

    /** @inheritdoc */
    public addChildNode(node: FormatNode, at?: FormatNode | number): number {
        this.content.add(node, at);
        return this.content.items.length;
    }

    /** @inheritdoc */
    public removeChildNode(at: FormatNode | number): FormatNode {
        return this.content.remove(at);
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_SECTION_OPEN_TAG_TOKEN(this.id || generateRandomSimpleId());
        const after = Tokens.DOCBOOK_SECTION_CLOSE_TAG_TOKEN;

        const beforeTitle = Tokens.DOCBOOK_TITLE_OPEN_TAG_TOKEN;
        const afterTitle = Tokens.DOCBOOK_TITLE_CLOSE_TAG_TOKEN;
        const title = `${beforeTitle}${this.title}${afterTitle}`;

        return `${before}${title}${this.content.toString()}${after}`;
    }

    /** @inheritdoc */
    public clone(): DocBookHeadingFormatNode {
        return new DocBookHeadingFormatNode(this.paragraph.clone(), `${this.title}`, this._level);
    }

    // Gets the first item which is the paragraph originally associated to the heading by the grammar.
    private get paragraph(): FormatNode {
        return this.content.items[0];
    }
}

/**
 * Describes the DocBook section.
 * Note: This has no corresponding non-literal in the grammar but it is present for utility.
 */
export class DocBookSectionFormatNode extends FormatNode implements NodesContainer, ModifiableNodesContainer {
    private content: DocBookArrayFormatNode<FormatNode>;

    /**
     * Initializes a new instance of this class.
     * @param content The content node to assign.
     * @param id The id to assign to the section. If nothing is passed, a random one will be created.
     */
    constructor(
        content: Array<FormatNode>,
        private id?: string
    ) {
        super();

        this.content = new DocBookArrayFormatNode<FormatNode>(content);
    }

    /** @inheritdoc */
    public get childNodes(): Array<FormatNode> {
        return this.content.items;
    }

    /** @inheritdoc */
    public addChildNode(node: FormatNode, at?: FormatNode | number): number {
        this.content.add(node, at);
        return this.content.items.length;
    }

    /** @inheritdoc */
    public removeChildNode(at: FormatNode | number): FormatNode {
        return this.content.remove(at);
    }

    /** @inheritdoc */
    public toString(): string {
        const before = Tokens.DOCBOOK_SECTION_OPEN_TAG_TOKEN(this.id || generateRandomSimpleId());
        const after = Tokens.DOCBOOK_SECTION_CLOSE_TAG_TOKEN;

        return `${before}${this.content.toString()}${after}`;
    }

    /** @inheritdoc */
    public clone(): DocBookSectionFormatNode {
        return new DocBookSectionFormatNode(this.content.clone().items, this.id);
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

    /** @inheritdoc */
    public clone(): DocBookLiteralFormatNode {
        if (isFormatNode(this.literal)) {
            return new DocBookLiteralFormatNode(this.literal.clone());
        }

        return new DocBookLiteralFormatNode(`${this.literal}`);
    }
}

/**
 * Describes an DocBook array.
 * @typedef T The type of items.
 */
export class DocBookArrayFormatNode<T extends { clone(): T } = FormatNode> extends FormatNode {
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

    /**
     * Adds an item to the collection.
     * @param item The item to add.
     * @param at The (existing) item (in the array) after which adding the new item or its position.
     *     If not specified, the item will be appended last.
     */
    public add(item: T, at?: number | T): number {
        this.array = addToArray(this.array, item, at);
        return this.array.length;
    }

    /**
     * Removes an item from the collection.
     * @param at The (existing) item (in the array) to remove.
     */
    public remove(at: number | T): T {
        const itemToRemove = typeof(at) === "number" ? this.array[at] : at;
        this.array = removeFromArray(this.array, at);
        return itemToRemove;
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

    /** @inheritdoc */
    public clone(): DocBookArrayFormatNode<T> {
        const array: Array<T> = [];
        for (const item of this.array) {
            array.push(item.clone());
        }

        return new DocBookArrayFormatNode(array, this.stringifier, this.separator);
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
