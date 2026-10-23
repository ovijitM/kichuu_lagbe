import { User } from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ message: "Sign in to continue." });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user || user.status === "suspended") {
      return res.status(401).json({ message: "This account cannot sign in." });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Sign in to continue." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this." });
    }
    next();
  };
}
