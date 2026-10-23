import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import categoryRoutes from "./routes/categories.js";
import merchantRoutes from "./routes/merchant.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shops.js";
import providerRoutes from "./routes/provider.js";
import notificationRoutes from "./routes/notifications.js";

const app = express();

const originConfig =
  !env.clientOrigin || env.clientOrigin === "*"
    ? true
    : env.clientOrigin.includes(",")
    ? env.clientOrigin.split(",").map((s) => s.trim())
    : env.clientOrigin;

app.use(helmet());
app.use(cors({ origin: originConfig, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
