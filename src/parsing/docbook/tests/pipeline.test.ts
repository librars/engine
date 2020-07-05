import {} from "jest";

import { ParsingPipeline } from "../../parsing_pipeline";
import { DocBookFormatter } from "../docbook_formatter";
import { DocBookTransformer } from "../docbook_transformer";

const idgen = () => "fakeid";
const pipeline = new ParsingPipeline(
    new DocBookFormatter(idgen),
    new DocBookTransformer(idgen)
);

function testOutput(input: string, output: string) {
    expect(pipeline.run(input)).toBe(output);
}

test("Generate simple text", () => {
    testOutput("Hello world", "<book><section xml:id=\"fakeid\"><para>Hello world</para></section></book>");
});
