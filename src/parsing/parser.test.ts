import {} from "jest";

import { MDParser } from "./parser";

const parser = new MDParser();

test("Parse empty string", () => {
    const ast = parser.parse("");
    expect(ast).toBe("");
});
