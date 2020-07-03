/** Andrea Tino - 2020 */

import { Transformer } from "../transformer";
import { FormatNode } from "../format_node";
import { DocBookRootFormatNode, DocBookSectionFormatNode, DocBookArrayFormatNode } from "./docbook_format_nodes";

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
        return formatTree;
    }

    private generateSections(root: FormatNode): FormatNode {
        // Root must be of specific type
        if (!(root instanceof DocBookRootFormatNode)) {
            throw new Error("Root type not expected");
        }

        // Start with a section
        // At least one section is necessary inside non-terminal 'blockflow'
        const createFirstSection = (content: Array<FormatNode>) => new DocBookSectionFormatNode(new DocBookArrayFormatNode(content));
        const firstSectionContent: Array<FormatNode> = [];
        for (const child of root.children) {
            // TODO
        }

        return root; // TODO
    }
}
