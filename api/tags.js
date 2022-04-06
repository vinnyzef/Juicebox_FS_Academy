const express = require("express");
const { client } = require("../db");
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made!");
  next();
});
async function getAllTags() {
  const tags = await client.query(`
    SELECT * FROM tags;
    `);
  return tags;
}
tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();
  res.send({
    tags,
  });
});
module.exports = tagsRouter;
