/** Andrea Tino - 2020 */

import { FormatNode } from "./format_node";

/**
 * Describes a transformer to process an annotated tree into a
 * non-annotated tree ready for output emission.
 */
export interface Transformer {
    /**
     * Transforms the input annotated tree into another
     * (non-annotated) tree ready for output emission.
     * @param formatTree The input annotated format tree.
     */
    transform(formatTree: FormatNode): FormatNode;
}
