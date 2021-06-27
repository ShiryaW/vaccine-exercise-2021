import { Response } from "node-fetch";
import {
  parseTimestampToDate,
  parseDateToTimestamp,
  capitalize,
  defaultResponseHandler,
} from "./helpers";

describe("parseTimestampToDate", () => {
  it("returns a UI-friendly representation of the database timestamp format", () => {
    const input = "2021-03-07T19:23:29.670958Z";
    const expected = new Date(2021, 2, 7).toISOString(); // the months in Date() are zero-indexed, hence the mismatch

    const result = parseTimestampToDate(input);
    expect(result.toISOString()).toBe(expected);
  });

  it("returns undefined if the timestamp is malformed", () => {
    const input = "2021.03.07";
    const result = parseTimestampToDate(input);

    expect(result).toBe(undefined);

    const input2 = "asdfghjkl";
    const result2 = parseTimestampToDate(input2);

    expect(result2).toBe(undefined);
  });
});

describe("parseDateToTimestamp", () => {
  it("converts a Date object to a database-friendly string", () => {
    const input = new Date(2021, 3, 7);
    const expected = "2021-04-07"; // the months in Date() are zero-indexed, hence the mismatch

    const result = parseDateToTimestamp(input);
    expect(result).toBe(expected);
  });
});

describe("defaultResponseHandler", () => {
  it("returns the response body in JSON format if status == OK", async () => {
    const mockResponse = new Response(JSON.stringify({ hello: "world" }), {
      status: 200,
      statusText: "OK",
    });

    expect(await defaultResponseHandler(mockResponse)).toEqual({
      hello: "world",
    });
  });

  it("returns nothing if the response status != OK", async () => {
    const mockResponse = new Response(null, {
      status: 404,
      statusText: "Not found",
    });

    expect(await defaultResponseHandler(mockResponse)).toBe(undefined);
  });
});

describe("capitalize", () => {
  it("capitalizes the given string", () => {
    expect(capitalize("antiqua")).toBe("Antiqua");
    expect(capitalize("the quick brown fox Jumped over the lazy Dog")).toBe(
      "The quick brown fox Jumped over the lazy Dog"
    );
    expect(capitalize("")).toBe("");
  });
});
