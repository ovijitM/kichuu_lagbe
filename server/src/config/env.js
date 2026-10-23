import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

if (isProd && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

export const env = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kichuu_lagbe",
  jwtSecret: process.env.JWT_SECRET || "dev-only-kichuu-lagbe-secret",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
