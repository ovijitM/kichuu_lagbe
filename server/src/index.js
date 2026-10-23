import { env } from "./config/env.js";
import { connectDb, syncIndexes } from "./config/db.js";
import "./models/register.js";
import app from "./app.js";

await connectDb(env.mongoUri);
await syncIndexes();
app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
