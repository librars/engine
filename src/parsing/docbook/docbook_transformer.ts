/** Andrea Tino - 2020 */

import { Transformer } from "../transformer";
import { FormatNode } from "../format_node";

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
}
