const { MongoClient } = require("mongodb");

exports.initMongo = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  console.log("DB connected...");
  return client.db("pinsaar").collection("notes");
};
