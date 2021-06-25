const fs = require("fs");
const readline = require("readline");

async function readFile(filepath) {
  try {
    await fs.promises.readFile(filepath);
  } catch (e) {
    return { error: e };
  }

  return new Promise((resolve) => {
    let lines = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(filepath),
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", (line) => {
      lines.push(JSON.parse(line));
    });

    rl.on("close", () => {
      resolve(lines);
    });
  });
}

module.exports = {
  readFile,
};
