/**
 * Contains tests targeting the MDParser.
 * Basic tests for simple and elementary scenarios.
 */

import {} from "jest";

import { MDParser } from "../parser";

const parser = new MDParser();

test("Parse empty string", () => {
    const _ = () => { parser.parse(""); };
    expect(_).toThrow();
});
