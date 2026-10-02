import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";

import { openDb } from "./database/db.js";
import "./database/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || "0.0.0.0";
const db = openDb();
const JWT_SECRET = process.env.JWT_SECRET || "daily-activity-dev-secret";
const DIST_DIR = path.join(__dirname, "dist");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:5176,http://localhost:5177,http://localhost:5178").split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired or invalid." });
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword || typeof storedPassword !== "string") {
    return false;
  }

  if (!storedPassword.includes(":")) {
    return storedPassword === password;
  }

  const [salt, hash] = storedPassword.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedHash = crypto.scryptSync(password, salt, 64).toString("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(derivedHash, "hex")
    );
  } catch {
    return false;
  }
}

function normalizeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

function normalizeActivity(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    date: row.date,
    startTime: row.start_time || "",
    endTime: row.end_time || "",
    reminder: Boolean(row.reminder),
    priority: row.priority || "medium",
    status: row.status || "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Daily Activity API is running." });
});

app.post("/api/auth/register", (req, res) => {
  const { name = "", email = "", password = "" } = req.body || {};
  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  if (!trimmedName || !trimmedEmail || !cleanPassword) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (cleanPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(trimmedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();
  const passwordHash = hashPassword(cleanPassword);

  db.prepare(
    `INSERT INTO users (id, name, email, password, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(userId, trimmedName, trimmedEmail, passwordHash, now);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  const token = createToken(user);

  return res.status(201).json({ user: normalizeUser(user), token });
});

app.post("/api/auth/login", (req, res) => {
  const { email = "", password = "" } = req.body || {};
  const trimmedEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);

  if (!trimmedEmail || !cleanPassword) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(trimmedEmail);

  if (!user || !verifyPassword(cleanPassword, user.password)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = createToken(user);

  return res.json({ user: normalizeUser(user), token });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.sub);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user: normalizeUser(user) });
});

app.get("/api/activities", requireAuth, (req, res) => {
  const tokenUserId = req.user?.sub || "";
  const userId = String(req.query.userId || tokenUserId || "");

  if (!userId) {
    return res.status(400).json({ message: "A userId is required." });
  }

  if (tokenUserId && userId && tokenUserId !== userId) {
    return res.status(403).json({ message: "You are not allowed to access that user." });
  }

  const rows = db
    .prepare(
      `SELECT * FROM activities
       WHERE user_id = ?
       ORDER BY date DESC, start_time DESC, created_at DESC`
    )
    .all(userId);

  return res.json({ activities: rows.map(normalizeActivity) });
});

app.post("/api/activities", requireAuth, (req, res) => {
  const {
    userId,
    title = "",
    description = "",
    date = new Date().toISOString().slice(0, 10),
    startTime = "",
    endTime = "",
    reminder = false,
    priority = "medium",
    status = "pending",
  } = req.body || {};

  const tokenUserId = req.user?.sub || "";
  const resolvedUserId = String(userId || tokenUserId || "");

  if (!resolvedUserId) {
    return res.status(400).json({ message: "User authentication is required." });
  }

  if (tokenUserId && resolvedUserId && tokenUserId !== resolvedUserId) {
    return res.status(403).json({ message: "You are not allowed to modify that user." });
  }

  if (!String(title).trim()) {
    return res.status(400).json({ message: "Activity title is required." });
  }

  const activityId = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO activities (
      id, user_id, title, description, date, start_time, end_time,
      reminder, priority, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    activityId,
    resolvedUserId,
    String(title).trim(),
    String(description || ""),
    String(date),
    String(startTime || ""),
    String(endTime || ""),
    Number(Boolean(reminder)),
    String(priority || "medium"),
    String(status || "pending"),
    now,
    now
  );

  const activity = db.prepare("SELECT * FROM activities WHERE id = ?").get(activityId);

  return res.status(201).json({ activity: normalizeActivity(activity) });
});

app.put("/api/activities/:id", requireAuth, (req, res) => {
  const activityId = req.params.id;
  const tokenUserId = req.user?.sub || "";
  const userId = String(req.query.userId || req.body.userId || tokenUserId || "");

  if (!userId) {
    return res.status(400).json({ message: "User authentication is required." });
  }

  if (tokenUserId && userId && tokenUserId !== userId) {
    return res.status(403).json({ message: "You are not allowed to modify that user." });
  }

  const existing = db
    .prepare("SELECT * FROM activities WHERE id = ? AND user_id = ?")
    .get(activityId, userId);

  if (!existing) {
    return res.status(404).json({ message: "Activity not found." });
  }

  const nextTitle = req.body.title ?? existing.title;
  const nextDescription = req.body.description ?? existing.description ?? "";
  const nextDate = req.body.date ?? existing.date;
  const nextStartTime = req.body.startTime ?? existing.start_time ?? "";
  const nextEndTime = req.body.endTime ?? existing.end_time ?? "";
  const nextReminder = req.body.reminder ?? Boolean(existing.reminder);
  const nextPriority = req.body.priority ?? existing.priority ?? "medium";
  const nextStatus = req.body.status ?? existing.status ?? "pending";
  const updatedAt = new Date().toISOString();

  db.prepare(
    `UPDATE activities
     SET title = ?, description = ?, date = ?, start_time = ?, end_time = ?,
         reminder = ?, priority = ?, status = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    String(nextTitle).trim(),
    String(nextDescription),
    String(nextDate),
    String(nextStartTime),
    String(nextEndTime),
    Number(Boolean(nextReminder)),
    String(nextPriority),
    String(nextStatus),
    updatedAt,
    activityId,
    userId
  );

  const activity = db.prepare("SELECT * FROM activities WHERE id = ?").get(activityId);

  return res.json({ activity: normalizeActivity(activity) });
});

app.delete("/api/activities/:id", requireAuth, (req, res) => {
  const activityId = req.params.id;
  const tokenUserId = req.user?.sub || "";
  const userId = String(req.query.userId || tokenUserId || "");

  if (!userId) {
    return res.status(400).json({ message: "User authentication is required." });
  }

  if (tokenUserId && userId && tokenUserId !== userId) {
    return res.status(403).json({ message: "You are not allowed to modify that user." });
  }

  const result = db
    .prepare("DELETE FROM activities WHERE id = ? AND user_id = ?")
    .run(activityId, userId);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Activity not found." });
  }

  return res.json({ success: true });
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Daily Activity API running on http://${HOST}:${PORT}`);
});
