/**
 * Contains unit tests for each single DocBook format node.
 */

import {} from "jest";

import { DocBookRootFormatNode, DocBookArrayFormatNode, DocBookLiteralFormatNode, DocBookParagraphFormatNode, DocBookHeadingFormatNode, DocBookSectionFormatNode } from "../docbook_format_nodes";
import { FormatNode } from "../../format_node";

test("DocBookRootFormatNode rendered output", () => {
    const literal = "Hello";
    const output = new DocBookRootFormatNode(
        new DocBookArrayFormatNode<FormatNode>([
            new DocBookLiteralFormatNode(literal)
        ])
    ).toString();
    expect(output).toBe(`<book>${literal}</book>`);
});

test("DocBookRootFormatNode rendered output - Multiple children", () => {
    const separator = "\n";
    const literal1 = "Hello1";
    const literal2 = "Hello2";
    const literal3 = "Hello3";
    const output = new DocBookRootFormatNode(
        new DocBookArrayFormatNode<FormatNode>([
            new DocBookLiteralFormatNode(literal1),
            new DocBookLiteralFormatNode(literal2),
            new DocBookLiteralFormatNode(literal3)
        ], undefined, separator)
    ).toString();
    expect(output).toBe(`<book>${literal1}${separator}${literal2}${separator}${literal3}</book>`);
});

test("DocBookParagraphFormatNode rendered output", () => {
    const literal = "Hello";
    const output = new DocBookParagraphFormatNode(
        new DocBookArrayFormatNode<FormatNode>([
            new DocBookLiteralFormatNode(literal)
        ])
    ).toString();
    expect(output).toBe(`<para>${literal}</para>`);
});

test("DocBookParagraphFormatNode rendered output - Empty collection", () => {
    const output = new DocBookParagraphFormatNode(
        new DocBookArrayFormatNode<FormatNode>([])
    ).toString();
    expect(output).toBe(`<para></para>`);
});

test("DocBookParagraphFormatNode rendered output - Multiple children", () => {
    const separator = "\n";
    const literal1 = "Hello1";
    const literal2 = "Hello2";
    const literal3 = "Hello3";
    const output = new DocBookParagraphFormatNode(
        new DocBookArrayFormatNode<FormatNode>([
            new DocBookLiteralFormatNode(literal1),
            new DocBookLiteralFormatNode(literal2),
            new DocBookLiteralFormatNode(literal3)
        ], undefined, separator)
    ).toString();
    expect(output).toBe(`<para>${literal1}${separator}${literal2}${separator}${literal3}</para>`);
});

test("DocBookHeadingFormatNode (empty) rendered output", () => {
    const title = "Title";
    const level = 1;
    const output = new DocBookHeadingFormatNode(
        title,
        level,
        undefined,
        "fakeid"
    ).toString();
    expect(output).toBe(`<section xml:id="fakeid"><title>${title}</title></section>`);
});

test("DocBookHeadingFormatNode rendered output", () => {
    const literal = "Hello";
    const title = "Title";
    const level = 1;
    const output = new DocBookHeadingFormatNode(
        title,
        level,
        new DocBookParagraphFormatNode(
            new DocBookLiteralFormatNode(literal)
        ),
        "fakeid"
    ).toString();
    expect(output).toBe(`<section xml:id="fakeid"><title>${title}</title><para>${literal}</para></section>`);
});

test("DocBookSectionFormatNode rendered output", () => {
    const literal = "Hello";
    const output = new DocBookSectionFormatNode([
        new DocBookLiteralFormatNode(literal)
    ],
    "fakeid").toString();
    expect(output).toBe(`<section xml:id="fakeid">${literal}</section>`);
});

test("DocBookSectionFormatNode rendered output - Multiple children", () => {
    const literal = "Hello";
    const output = new DocBookSectionFormatNode([
        new DocBookLiteralFormatNode(literal)
    ],
    "fakeid").toString();
    expect(output).toBe(`<section xml:id="fakeid">${literal}</section>`);
});

test("DocBookLiteralFormatNode rendered output", () => {
    const literal = "Hello";
    const output = new DocBookLiteralFormatNode(literal).toString();
    expect(output).toBe(`${literal}`);
});

test("DocBookArrayFormatNode rendered output", () => {
    const literal = "Hello";
    const output = new DocBookArrayFormatNode([
        new DocBookLiteralFormatNode(literal)
    ]).toString();
    expect(output).toBe(`${literal}`);
});

test("DocBookArrayFormatNode rendered output - Empty collection", () => {
    const literal = "Hello";
    const output = new DocBookArrayFormatNode([]).toString();
    expect(output).toBe("");
});

test("DocBookArrayFormatNode rendered output - Multiple items", () => {
    const literal1 = "Hello1";
    const literal2 = "Hello2";
    const literal3 = "Hello3";
    const output = new DocBookArrayFormatNode([
        new DocBookLiteralFormatNode(literal1),
        new DocBookLiteralFormatNode(literal2),
        new DocBookLiteralFormatNode(literal3)
    ]).toString();
    expect(output).toBe(`${literal1}\n${literal2}\n${literal3}`);
});

test("DocBookArrayFormatNode rendered output - Multiple items and custom separator", () => {
    const literal1 = "Hello1";
    const literal2 = "Hello2";
    const literal3 = "Hello3";
    const separator = "a";
    const output = new DocBookArrayFormatNode([
        new DocBookLiteralFormatNode(literal1),
        new DocBookLiteralFormatNode(literal2),
        new DocBookLiteralFormatNode(literal3)
    ],
    undefined,
    separator).toString();
    expect(output).toBe(`${literal1}${separator}${literal2}${separator}${literal3}`);
});

test("DocBookArrayFormatNode rendered output - Multiple items and custom type (and stringifier)", () => {
    class C {
        constructor(public v: string) {}
        public clone() {
            return new C(`${this.v}`);
        }
    }
    const c1 = new C("Hello");
    const c2 = new C("World");
    const c3 = new C("Again");

    const output = new DocBookArrayFormatNode<C>([c1, c2, c3], (v: C) => {
        return `v:${v.v}`;
    }).toString();

    expect(output).toBe(`v:${c1.v}\nv:${c2.v}\nv:${c3.v}`);
});
