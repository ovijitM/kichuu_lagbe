import mongoose from "mongoose";

export async function connectDb(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function syncIndexes() {
  await Promise.all(mongoose.modelNames().map((name) => mongoose.model(name).syncIndexes()));
}
