/** Andrea Tino - 2020 */

/** Type for describing annotations to format nodes. */
export interface AnnotationsObject {
    /** A descriptive text providing extra info on the node. */
    description?: string;
}

/**
 * Describes a node in the format output tree.
 */
export abstract class FormatNode implements ClonableNode {
    /** Converts the node into the final representation. */
    public abstract toString(): string;

    /** Gets the annotations for this node. */
    public annotations: AnnotationsObject | null = null;

    /** @inheritdoc */
    public abstract clone(): FormatNode;
}

/**
 * Describes a FormatNode which has children that it exposes.
 */
export interface NodesContainer {
    /**
     * Gets the children.
     */
    childNodes: Array<FormatNode>;
}

/**
 * Describes a FormatNode which has children and that gives the
 * ability to modify the collection.
 */
export interface ModifiableNodesContainer {
    /**
     * Adds a node at the specified position.
     * @param node The node to add.
     * @param at The position. If n is specified, the new child will be in position n+1.
     *     If not specified, the item will be appended last.
     * @returns The length of the updated cllection.
     */
    addChildNode(node: FormatNode, at?: FormatNode | number): number;

    /**
     * Removes a node from the collection of children.
     * @param at The position where to remove the node.
     * @returns The removed node, null if no node was removed.
     */
    removeChildNode(at: FormatNode | number): FormatNode | null;
}

/**
 * Type guard to check whether an object implements interface 'ModifiableNodesContainer'.
 * @param obj The object to check.
 */
export function isModifiableNodesContainer(obj: any): obj is ModifiableNodesContainer { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    return "addChildNode" in obj && "removeChildNode" in obj;
}

/**
 * Describes a FormatNode which can be safely cloned.
 */
export interface ClonableNode {
    /**
     * Clones the node.
     * @returns An exact copy of the node.
     */
    clone(): FormatNode;
}

/**
 * Type guard.
 * @param element The element to check.
 */
export function isFormatNode(element: any): element is FormatNode { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    return typeof(element) === "object" &&
        "toString" in element &&
        "clone" in element &&
        "annotations" in element;
}
