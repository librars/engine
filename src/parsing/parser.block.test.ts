import {} from "jest";

import { MDParser } from "./parser";

const parser = new MDParser({ trace: false });

test("Parse simple paragraph", () => {
    const input = "Hello world";
    const ast = parser.parse(input);

    expect(ast).not.toBeNull();
    expect(typeof(ast)).toBe("object");
});
