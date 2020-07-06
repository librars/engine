/** Andrea Tino - 2020 */

import { FormatNode } from "./format_node";

/**
 * Describes a transformer to process a tree into an
 * annotated tree ready for output emission.
 * 
 * Transformers are also concerned about semantic analysis.
 */
export interface Transformer {
    /**
     * Transforms the input tree into another
     * (annotated) tree ready for output emission.
     * @param formatTree The input format tree.
     * @returns The annotated format tree.
     */
    transform(formatTree: FormatNode): FormatNode;
}
