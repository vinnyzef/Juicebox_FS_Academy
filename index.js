const express = require("express");
const server = express();
const PORT = 3000;
const morgan = require("morgan");
server.use(morgan("dev"));
const { client, updatePost, getPostById } = require("./db");
client.connect();

server.use(express.json());
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
// index.js
server.get("/background/:color", (req, res, next) => {
  res.send(`
    <body style="background: ${req.params.color};">
      <h1>Hello World</h1>
    </body>
  `);
});
server.get("/add/:first/to/:second", (req, res, next) => {
  res.send(
    `<h1>${req.params.first} + ${req.params.second} = ${
      Number(req.params.first) + Number(req.params.second)
    }</h1>`
  );
});
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);

// stuff below here
