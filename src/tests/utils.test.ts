/**
 * Contains tests targeting the general-purpose utils.
 */

import {} from "jest";
import { addToArray } from "../utils";

test("Add into array by numeric position", () => {
    const array = [1, 2, 3];
    const item = 4;
    const newArray = addToArray(array, item, 1);

    expect(newArray.length).toBe(array.length + 1);
    expect(newArray[0]).toBe(array[0]);
    expect(newArray[1]).toBe(array[1]);
    expect(newArray[2]).toBe(item);
    expect(newArray[3]).toBe(array[2]);
});

test("Add into array by numeric position at beginning", () => {
    const array = [1, 2, 3];
    const item = 4;
    const newArray = addToArray(array, item, -1);

    expect(newArray.length).toBe(array.length + 1);
    expect(newArray[0]).toBe(item);
    expect(newArray[1]).toBe(array[0]);
    expect(newArray[2]).toBe(array[1]);
    expect(newArray[3]).toBe(array[2]);
});

test("Add into array by object reference", () => {
    const array = [{ v: 1 }, { v: 2 }, { v: 3 }];
    const item = { v: 4 };
    const newArray = addToArray(array, item, array[1]);

    expect(newArray.length).toBe(array.length + 1);
    expect(newArray[0].v).toBe(array[0].v);
    expect(newArray[1].v).toBe(array[1].v);
    expect(newArray[2].v).toBe(item.v);
    expect(newArray[3].v).toBe(array[2].v);
});

test("Add into array with no position", () => {
    const array = [1, 2, 3];
    const item = 4;
    const newArray = addToArray(array, item);

    expect(newArray.length).toBe(array.length + 1);
    expect(newArray[0]).toBe(array[0]);
    expect(newArray[1]).toBe(array[1]);
    expect(newArray[2]).toBe(array[2]);
    expect(newArray[3]).toBe(item);
});

test("Add into empty array with no position", () => {
    const array: Array<number> = [];
    const item = 4;
    const newArray = addToArray(array, item);

    expect(newArray.length).toBe(array.length + 1);
    expect(newArray[0]).toBe(item);
});
