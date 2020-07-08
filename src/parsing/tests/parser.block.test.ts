/**
 * Contains tests targeting the MDParser.
 * Tests validating block non-terminals.
 */

import {} from "jest";

import { MDParser, MDNode } from "../parser";
import { Heading } from "../ast_types";

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

    const rootValue = ast.v as MDNode[];
    expect(rootValue.length).toBe(1);

    const paragraphBlock: MDNode = rootValue[0];
    expect(paragraphBlock.t).toBe("PARAGRAPH:BLOCK");

    const paragraphBlockValue = paragraphBlock.v as MDNode[];
    expect(paragraphBlockValue.length).toBe(1);

    const textInline: MDNode = paragraphBlockValue[0];
    expect(textInline.t).toBe("TEXT:INLINE");

    const textInlineValue = <string>textInline.v;
    expect(textInlineValue).toBe("Hello world");
});

test("Parse empty 1L heading", () => {
    const input = "# Heading";
    const ast = parser.parse(input);

    basicCheck(ast);
    checkRoot(ast);

    const rootValue = ast.v as MDNode[];
    expect(rootValue.length).toBe(1);

    const sectionBlock: MDNode = rootValue[0];
    expect(sectionBlock.t).toBe("HEADING:BLOCK");

    const sectionBlockValue = sectionBlock.v as MDNode;
    expect(sectionBlockValue).toBeTruthy();
    expect(sectionBlockValue.t).toBe("HEADING");

    const sectionContent = sectionBlockValue.v as Heading;
    expect(sectionContent).toBeTruthy();
    expect(sectionContent.level).toBe(1);
    expect(sectionContent.title).toBe("Heading");
    expect(sectionContent.paragraph).toBeNull();
});

test("Parse simple 1L heading", () => {
    const input = "# Heading\nThis is some text";
    const ast = parser.parse(input);

    basicCheck(ast);
    checkRoot(ast);

    const rootValue = ast.v as MDNode[];
    expect(rootValue.length).toBe(1);

    const sectionBlock: MDNode = rootValue[0];
    expect(sectionBlock.t).toBe("HEADING:BLOCK");

    const sectionBlockValue = sectionBlock.v as MDNode;
    expect(sectionBlockValue).toBeTruthy();
    expect(sectionBlockValue.t).toBe("HEADING");

    const sectionContent = sectionBlockValue.v as Heading;
    expect(sectionContent).toBeTruthy();
    expect(sectionContent.level).toBe(1);
    expect(sectionContent.title).toBe("Heading");
    expect(sectionContent.paragraph).toBeTruthy();

    const paragraphContent = sectionContent.paragraph as MDNode[];
    expect(paragraphContent.length).toBe(1);
    const textInline: MDNode = paragraphContent[0];
    expect(textInline.t).toBe("TEXT:INLINE");
    const textInlineValue = <string>textInline.v;
    expect(textInlineValue).toBe("This is some text");
});
