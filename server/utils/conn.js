// refer to https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial when deploying to atlas
const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("my-chat-app");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};