const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  if (db) return db;

  try {
    await client.connect();
    console.log("✅ MongoDB Connected Successfully");

    db = client.db(); // uses default database from URI
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
