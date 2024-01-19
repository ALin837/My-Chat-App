// refer to https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial when deploying to atlas
const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;
let conn;
module.exports = {
  connectToServer : async () => {
    try {
      conn = await client.connect()
      console.log("Successfully connected to MongoDB.");
    } catch (e) {
      console.log("Connect failed " + e.message )
    }
    dbConnection = conn.db("my-chat-app");
  },

  getDb: function () {
    return dbConnection;
  },
};
