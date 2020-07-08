/** Andrea Tino - 2020 */

import { MDNode } from "./parser";

/** Represents the type of a node type. */
export type MDNodeType = 
    "ROOT" |
    "TEXT:INLINE" |
    "PARAGRAPH:BLOCK" |
    "HEADING:BLOCK" |
    "HEADING";

/** Represents a custom HEADING node in the grammar. */
export type Heading = {
    level: number,
    title: string,
    paragraph: MDNode[] | null
}

/**
 * Represents the type of a node value.
 */
export type MDNodeValue = MDNode | Array<MDNode> | string | Array<string> | Heading;

/**
 * Type guard.
 * @param {MDNodeValue} ast The AST to check.
 */
export function isMDNodeValueOfTypeNode(ast: any): ast is MDNode { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    return ast.t !== undefined;
}

/**
 * Type guard.
 * @param {MDNodeValue} ast The AST to check.
 */
export function isMDNodeValueOfTypeNodeArray(ast: any): ast is Array<MDNode> { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    const isArray = ast.length !== undefined && ast.length >= 0;
    if (ast.length > 0) {
        return isMDNodeValueOfTypeNode(ast[0]);
    }
    return isArray;
}

/**
 * Type guard.
 * @param {MDNodeValue} ast The AST to check.
 */
export function isMDNodeValueOfTypeString(ast: any): ast is string { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    return typeof(ast) === "string";
}

/**
 * Type guard.
 * @param {MDNodeValue} ast The AST to check.
 */
export function isMDNodeValueOfTypeStringArray(ast: any): ast is Array<string> { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    const isArray = ast.length !== undefined && ast.length >= 0;
    if (ast.length > 0) {
        return isMDNodeValueOfTypeString(ast[0]);
    }
    return isArray;
}

/**
 * Type guard.
 * @param {MDNodeValue} ast The AST to check.
 */
export function isMDNodeValueOfTypeHeading(ast: any): ast is Heading { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    return ast.title !== undefined && ast.level !== undefined;
}
