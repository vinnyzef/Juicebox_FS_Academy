// inside db/index.js
const { Client } = require("pg"); // imports the pg module

// supply the db name and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
    SELECT id, username FROM users;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};
async function getAllPosts() {
  try {
    const { rows } = await client.query(`
        SELECT "authorId", title FROM posts
        `);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function createUser({ username, password, name, location }) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `,
      [username, password, name, location]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}
async function createPost({ authorId, title, content }) {
  try {
    const { rows } = await client.query(
      //possibly have to change quotation around authorId
      `
            INSERT INTO posts("authorId", title, content)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
      [authorId, title, content]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = client.query(`
    SELECT users.id, users.name, users.location, posts.title, posts.content
    FROM users INNER JOIN posts ON posts.id = ${userId};
      `);

    return rows;
  } catch (error) {
    throw error;
  }
}
async function getUserById(userId) {
  // first get the user (NOTE: Remember the query returns
  // (1) an object that contains

  // (2) a `rows` array that (in this case) will contain
  // (3) one object, which is our user.
  // if it doesn't exist (if there are no `rows` or `rows.length`), return null

  // if it does:
  // delete the 'password' key from the returned object
  // get their posts (use getPostsByUser)
  // then add the posts to the user object with key 'posts'
  // return the user object
  try {
    const { rows } = await client.query(`
        SELECT users.id, users.username, users.name, users.location FROM users WHERE users.id = ${userId};
        `);
    return rows;
  } catch (error) {
    return null;
  }
}
async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
}
async function updatePost(id, fields = { title, content, active }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  getAllPosts,
  updatePost,
  getPostsByUser,
  getUserById,
};
