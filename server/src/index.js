const { app, db, port } = require("./app");

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await db.then((database) => {
    database.close((err) => {
      if (err) {
        return console.error("Error closing database connection:", err.message);
      }
    });
  });
  server.close(() => {
    console.log("Server closed.");
  });
});
