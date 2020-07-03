import {} from "jest";

import { ParsingPipeline } from "../../parsing_pipeline";
import { DocBookFormatter } from "../docbook_formatter";
import { DocBookTransformer } from "../docbook_transformer";

const pipeline = new ParsingPipeline(new DocBookFormatter(), new DocBookTransformer());

function testOutput(input: string, output: string) {
    expect(pipeline.run(input)).toBe(output);
}

test("Generate simple text", () => {
    testOutput("Hello world", "<book><para>Hello world</para></book>");
});
