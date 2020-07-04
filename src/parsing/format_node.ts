/** Andrea Tino - 2020 */

/** Type for describing annotations to format nodes. */
export interface AnnotationsObject {
    indentation?: number;
}

/**
 * Describes a node in the format output tree.
 */
export abstract class FormatNode {
    /** Converts the node into the final representation. */
    public abstract toString(): string;

    /** Gets the annotations for this node. */
    public get annotations(): AnnotationsObject {
        return {};
    }
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
     * @param position The position. If n is specified, the new child will be in position n+1.
     */
    addChildNode(node: FormatNode, position?: number): void;

    /**
     * Removes a node from the collection of children.
     * @param position The position where to remove the node.
     * @returns The removed node.
     */
    removeChildNode(position: number): FormatNode;
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
    return typeof(element) === "object" && "toString" in element;
}

/**
 * Describes a format node producing an empty string
 */
export class EmptyFormatNode extends FormatNode {
    /** @inheritdoc */
    public toString(): string {
        return "";
    }
}
