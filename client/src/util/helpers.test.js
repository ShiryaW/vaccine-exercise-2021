import { parseTimestampToDate, parseDateToTimestamp } from "./helpers";

describe("parseTimestampToDate", () => {
  it("returns a UI-friendly representation of the database timestamp format", () => {
    const input = "2021-03-07T19:23:29.670958Z";
    const expected = "7.3.2021";

    const result = parseTimestampToDate(input);
    expect(result).toBe(expected);
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
