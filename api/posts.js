const express = require("express");
const postsRouter = express.Router();
const {
  getAllPosts,
  getUserByUsername,
  getPostById,
  updatePost,
} = require("../db");
const { createPost } = require("../db");
const { requireUser } = require("./utils");

postsRouter.post("/", requireUser, async (req, res, next) => {
  const iD = req.user.id;
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  idGetter = async (iD) => {
    console.log(iD);
    iD = await getUserByUsername(iD);
    console.log("THIS IS PRINTING OUT WHAT THE ID IS YO!!!!!!YO!!!!" + iD);
  };
  idGetter();

  try {
    // add authorId, title, content to postData object

    Object.assign(
      postData,
      { authorId: 1 },
      { title: title },
      { content: content }
    );

    // const post = await createPost(postData);
    const post = await createPost(postData);

    res.send({ post });
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// near the top

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? { 
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});
//curl http://localhost:3000/api/posts/1 -X DELETE -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NDk2MzQ0OTJ9.zLw3xv2hqK_GAeQBMUEH5prldDwRGkjzqYF-iQv3xZg'

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();
  res.send({
    posts,
  });
});

module.exports = postsRouter;
