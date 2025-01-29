import mongoose from "mongoose";
import dotenv from "dotenv";
import { log } from "node:console";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null }; // creating the cached object to store the connection and promise

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log("connected to db");

    return cached.conn;
  }

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "database",
      bufferCommands: false,
    }); // connecting to the database or accessing the cached connection if it already exists

  cached.conn = await cached.promise;

  if (!cached.conn) {
    console.log("Connection to MongoDB failed");
  }

  console.log("connected to db");

  return cached.conn;
};
