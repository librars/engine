import {} from "jest";

import { ParsingPipeline } from "../../parsing_pipeline";
import { DocBookFormatter } from "../docbook_formatter";
import { DocBookTransformer } from "../docbook_transformer";
import { FormatNode } from "../../format_node";
import { DocBookRootFormatNode, DocBookSectionFormatNode, DocBookParagraphFormatNode, DocBookLiteralFormatNode } from "../docbook_format_nodes";

const idgen = () => "fakeid";
const pipeline = new ParsingPipeline(
    new DocBookFormatter(idgen),
    new DocBookTransformer(idgen)
);

function getTransformedTree(input: string): FormatNode {
    pipeline.run(input);
    return pipeline.transformedTree as FormatNode;
}

test("Root node is rearranged into correct structure", () => {
    const tree = getTransformedTree("Hello world");
    expect(tree as DocBookRootFormatNode).toBeTruthy();
    expect((tree as DocBookRootFormatNode).childNodes.length).toBe(1);

    const section = (tree as DocBookRootFormatNode).childNodes[0];
    expect(section as DocBookSectionFormatNode).toBeTruthy();
    expect((section as DocBookSectionFormatNode).childNodes.length).toBe(1);

    const paragraph = (section as DocBookSectionFormatNode).childNodes[0];
    expect(paragraph as DocBookParagraphFormatNode).toBeTruthy();
    expect((section as DocBookParagraphFormatNode).childNodes.length).toBe(1);

    const literal = (section as DocBookParagraphFormatNode).childNodes[0];
    expect(literal as DocBookLiteralFormatNode).toBeTruthy();
});
