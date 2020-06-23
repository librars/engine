import {} from "jest";

import { MDParser } from "./parser";

const parser = new MDParser();

test("Parse simple paragraph", () => {
    const input = "Hello world";
    const ast = parser.parse(input);

    expect(ast).not.toBeNull();
    expect(ast).not.toBeUndefined();
    expect(typeof(ast)).toBe("object");
});
