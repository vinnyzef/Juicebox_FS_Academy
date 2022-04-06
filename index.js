const express = require("express");
const server = express();
const PORT = 3000;
const morgan = require("morgan");
server.use(morgan("dev"));
const { client } = require("./db");
client.connect();

server.use(express.json());
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
// stuff above here

const apiRouter = require("./api");
server.use("/api", apiRouter);

// stuff below here
