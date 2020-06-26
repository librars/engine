/** Andrea Tino - 2020 */

import { Formatter } from "./formatter";

/**
 * A formatter to output ODT format.
 */
export class ODTFormatter implements Formatter {
    /** @inheritdoc */
    public get formatId(): string {
        return "odt";
    }

    /** @inheritdoc */
    public generateRoot(): string {
        throw new Error("Method not implemented.");
    }
}
