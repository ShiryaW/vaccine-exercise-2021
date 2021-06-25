const { FILEPATH } = require("./constants");
const reader = require("./reader");

describe("File reader", () => {
  it("Parses a valid text file as JSON", async () => {
    const expected = [
      {
        Gryffindor: [
          "Harry Potter",
          "Hermeliini Granger",
          "Ron Weasler",
          "Albus Dumblydory",
          "Minerva McGonnagone",
        ],
        Hufflepuff: [
          "Edward Cullen",
          "I actually have no idea who else was in Hufflepuff",
          "me",
        ],
        Ravenclaw: ["Luna Lovegood", "Cho Chang"],
        Slytherin: [
          "Draco Malfoy",
          "Tom Marvolo Riddle",
          "Snejp",
          "Horacio Kriklan whatever his English name is",
        ],
      },
    ];

    const result = await reader.readFile(
      `${FILEPATH.TEST_RESOURCES}/readerTest.txt`
    );

    expect(result).toEqual(expected);
  });

  it("Returns an error if an invalid filepath is passed", async () => {
    const result = await reader.readFile("./thisFileDoesNotExist.txt");
    expect(result.error).not.toBe(null);
  });
});
