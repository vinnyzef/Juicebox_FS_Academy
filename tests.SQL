CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL
);


INSERT INTO users
    (username, password)
VALUES
    ('albert', 'bertie99'),
    ('sandra', '2sandy4me'),
    ('glamgal', 'soglam');



SELECT users.id, users.name, users.location, posts.title, posts.content
FROM users INNER JOIN posts ON posts.id = users.id;