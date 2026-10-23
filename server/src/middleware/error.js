import { ZodError } from "zod";

export function notFound(_req, res) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Check the form and try again.",
      issues: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message || "Something went wrong" });
}
