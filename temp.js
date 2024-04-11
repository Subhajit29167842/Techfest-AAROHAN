const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('college', 'root', 'hellobro2', {
  dialect: 'mysql',
  host: 'localhost'
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: DataTypes.STRING
});

// Define Post model
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  userId: DataTypes.INTEGER // Foreign key referencing User
});

// Synchronize the models with the database
sequelize.sync()
  .then(() => {
    console.log("Models synced successfully.");

    // Insert dummy values into User table
    return sequelize.query(
      "INSERT INTO Users (username,createdAt,updatedAt) VALUES ('user1',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP()), ('user2',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP()), ('user3',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());"
    );
  })
  .then(() => {
    // Insert dummy values into Post table
    return sequelize.query(
      "INSERT INTO Posts (title, content, userId,createdAt,updatedAt) VALUES ('Title 1', 'Content of Post 1', 1,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP()), ('Title 2', 'Content of Post 2', 2,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP()), ('Title 3', 'Content of Post 3', 3,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());"
    );
  })
  .then(() => {
    // Execute the SQL query
    return sequelize.query(
        'SELECT users.id, posts.title, posts.content FROM users JOIN posts ON users.id = posts.userId',
      { type: Sequelize.QueryTypes.SELECT }
    );
  })
  .then(results => {
    // Display the results
    console.log(results);
  })
  .catch(error => {
    console.error('Error:', error);
  });
