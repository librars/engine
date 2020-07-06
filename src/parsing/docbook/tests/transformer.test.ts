/**
 * Contains tests targeting the transformer.
 */

import {} from "jest";

import { ParsingPipeline } from "../../parsing_pipeline";
import { DocBookFormatter } from "../docbook_formatter";
import { DocBookTransformer } from "../docbook_transformer";
import { FormatNode, NodesContainer } from "../../format_node";
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

function testNode<T extends FormatNode>(node: FormatNode, childrenNum?: number): void {
    expect(node as T).toBeTruthy();

    if (childrenNum && childrenNum >= 0) {
        expect((node as unknown) as NodesContainer).toBeTruthy();
        expect(((node as unknown) as NodesContainer).childNodes.length).toBe(childrenNum);
    }
}

function extractChildNode<T extends FormatNode>(node: T, index?: number): FormatNode {
    expect((node as unknown) as NodesContainer).toBeTruthy();
    return ((node as unknown) as NodesContainer).childNodes[index || 0];
}

function testNodeIsSimpleSectionWithLeavesOfType<T extends FormatNode>(node: FormatNode, childrenNum = 1): void {
    // One section with many paragraphs
    testNode<DocBookSectionFormatNode>(node, childrenNum);

    for (let i = 0; i < childrenNum; i++) {
        const paragraph = extractChildNode(node, i);
        testNode<DocBookParagraphFormatNode>(paragraph);

        const leaf = extractChildNode(paragraph);
        testNode<T>(leaf);
    }
}

test("Root node is rearranged into correct structure - Single paragraph added to synthetic section", () => {
    const tree = getTransformedTree("Hello world");
    testNode<DocBookRootFormatNode>(tree, 1); // One section

    const section = extractChildNode(tree);
    expect(section.annotations).not.toBeNull();
    expect(section.annotations?.description).not.toBeNull();
    expect(section.annotations?.description).toBe(DocBookTransformer.SECTION_SYNTHETIC_ANNOTATION);
    testNodeIsSimpleSectionWithLeavesOfType<DocBookLiteralFormatNode>(section);
});

test("Root node is rearranged into correct structure - Sequence of paragraphs", () => {
    const tree = getTransformedTree("Hello world one\n\nHello world two\n\nHello world three");
    testNode<DocBookRootFormatNode>(tree, 1); // One section

    const section = extractChildNode(tree);
    expect(section.annotations).not.toBeNull();
    expect(section.annotations?.description).not.toBeNull();
    expect(section.annotations?.description).toBe(DocBookTransformer.SECTION_SYNTHETIC_ANNOTATION);
    testNodeIsSimpleSectionWithLeavesOfType<DocBookLiteralFormatNode>(section, 3); // Many paragraphs
});
