const express = require("express");
const { client, getPostById, getPostsByTagName } = require("../db");
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
tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;
  try {
    const post = await getPostsByTagName(tagName);
    const posts = post.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id);
    });

    res.send({ posts: post });
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    // forward the name and message to the error handler
  }
});
module.exports = tagsRouter;
