/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";
import { FormatNode, EmptyFormatNode } from "./format_node";
import { RootFormatNode } from "./odt_format_nodes";

/**
 * A formatter to output ODT format.
 */
export class ODTFormatter implements Formatter {
    /** @inheritdoc */
    public get formatId(): string {
        return "odt";
    }

    /** @inheritdoc */
    public generateRoot(): FormatNode {
        return new RootFormatNode(new EmptyFormatNode());
    }
}
