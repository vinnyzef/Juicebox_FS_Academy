// db/seed.js

const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  getAllPosts,
  updatePost,
  getPostsByUser,
  getUserById,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
    `);
    await client.query(`
        DROP TABLE IF EXISTS users;
      `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT true
        );
      `);
    await client.query(`
      CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
    "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
         active BOOLEAN DEFAULT true);
      `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "al",
      location: "Chicago",
    });
    const post = await createPost({
      authorId: "1",
      title: "taco bell",
      content: "archer ave. sweet spot",
    });
    console.log(post);
    console.log(albert);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();

    const posts = await getAllPosts();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });

    console.log("Result:", updateUserResult);
    //added update for post
    console.log("Calling updateUser on posts[0]");
    const updatePostResult = await updatePost(posts[0].authorId, {
      title: "New Cool Stuff",
      content: "Crazy content ",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getPosts on authorId[1]");
    // const getPostsByUserId = await getPostsByUser(1);
    // console.log("Result:", getPostsByUserId);
    console.log("Getting user by id(1)");
    const getUser = await getUserById(1);
    console.log(getUser);
    console.log("Finsihsed getting user by id(1)");
    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
