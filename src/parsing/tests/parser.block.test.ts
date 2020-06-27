import {} from "jest";

import { MDParser, MDNode } from "../parser";

const parser = new MDParser();

function basicCheck(ast: MDNode) {
    expect(ast).not.toBeNull();
    expect(ast).not.toBeUndefined();
    expect(typeof(ast)).toBe("object");
}

function checkRoot(ast: MDNode) {
    expect(ast.t).toBe("ROOT");
}

test("Parse simple paragraph", () => {
    const input = "Hello world";
    const ast = parser.parse(input);

    basicCheck(ast);
    checkRoot(ast);

    const rootValue = <MDNode[]>ast.v;
    expect(rootValue.length).toBe(1);

    const paragraphBlock: MDNode = rootValue[0];
    expect(paragraphBlock.t).toBe("PARAGRAPH:BLOCK");

    const paragraphBlockValue = <MDNode[]>paragraphBlock.v;
    expect(paragraphBlockValue.length).toBe(1);

    const textInline: MDNode = paragraphBlockValue[0];
    expect(textInline.t).toBe("TEXT:INLINE");

    const textInlineValue = <string>textInline.v;
    expect(textInlineValue).toBe("Hello world");
});
