/** Andrea Tino - 2020 */

import { Transformer } from "../transformer";
import { FormatNode, isModifiableNodesContainer } from "../format_node";
import { DocBookRootFormatNode, DocBookSectionFormatNode, DocBookArrayFormatNode, DocBookHeadingFormatNode } from "./docbook_format_nodes";

/**
 * The DocBook transformer.
 */
export class DocBookTransformer implements Transformer {
    /**
     * Scan the input tree in order to re-arrange the nodes in
     * the proper way, suitable for output emission.
     * @param formatTree The input format tree (annotated).
     */
    public transform(formatTree: FormatNode): FormatNode {
        let newFormatTree = formatTree;

        // Define the correct structure
        newFormatTree = this.defineSectionStructure(newFormatTree);

        return newFormatTree;
    }

    // In order to properly generate DocBook output, sections must be nested
    // into one another to generate the proper indentation level and
    // document structure.
    // Also, paragraphs and other block nodes inside non-terminal 'blockflow'
    // must be included into their respective sessions. This method will take
    // care of setting the proper structure inside the root node.
    private defineSectionStructure(root: FormatNode): FormatNode {
        // Root must be of specific type
        if (!(root instanceof DocBookRootFormatNode)) {
            throw new Error("Root type not expected");
        }

        // Make sure to add content to headings
        const newRootChildren: Array<FormatNode> = [];

        // The first node might not be a heading, so a section will not be
        // created, therefore add one manually.
        if (!DocBookTransformer.isNodeASection(root.childNodes[0])) {
            newRootChildren.push(
                new DocBookSectionFormatNode([])
            );
        }

        for (let childNode of root.childNodes) {
            childNode = childNode.clone(); // Clone, do not edit the original
            const lastAddedSectionNode: FormatNode | undefined = newRootChildren[newRootChildren.length - 1];

            if (lastAddedSectionNode === undefined) {
                // Initialization: first node is a section, just add it to the new array
                newRootChildren.push(childNode);
                continue;
            }

            if (DocBookTransformer.isNodeASection(childNode)) {
                // Found new section node, add it to the new array
                newRootChildren.push(childNode);
                continue;
            }

            // All other cases: the node must abe added to the last added section node
            if (isModifiableNodesContainer(lastAddedSectionNode)) {
                lastAddedSectionNode.addChildNode(childNode);
            }
        }

        // Return a new root node
        return new DocBookRootFormatNode(new DocBookArrayFormatNode<FormatNode>(newRootChildren));
    }

    private static isNodeASection(node: FormatNode): boolean {
        return node instanceof DocBookHeadingFormatNode;
    }
}
