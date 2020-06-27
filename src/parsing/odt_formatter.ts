/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { FormatNode } from "./format_node";
import { ODTRootFormatNode } from "./odt_format_nodes";

/**
 * A formatter to output ODT format.
 */
export class ODTFormatter implements Formatter {
    /** @inheritdoc */
    public get formatId(): string {
        return "odt";
    }

    /** @inheritdoc */
    public generateRoot(content: FormatNode): FormatNode {
        return new ODTRootFormatNode(content);
    }
}
