import crypto from "node:crypto";

import { openDb } from "./db.js";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const db = openDb();

const userId = "user-demo-001";
const now = new Date().toISOString();

const userInsert = db.prepare(`
  INSERT OR IGNORE INTO users (id, name, email, password, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

userInsert.run(userId, "Alex Morgan", "demo@dailyactivity.com", hashPassword("password123"), now);

const activityInsert = db.prepare(`
  INSERT OR IGNORE INTO activities (
    id, user_id, title, description, date, start_time, end_time, reminder, priority, status, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const sampleActivities = [
  {
    id: "activity-001",
    user_id: userId,
    title: "Team planning sync",
    description: "Discuss sprint priorities and blockers.",
    date: new Date().toISOString().slice(0, 10),
    start_time: "09:00",
    end_time: "09:45",
    reminder: 1,
    priority: "high",
    status: "pending",
  },
  {
    id: "activity-002",
    user_id: userId,
    title: "Deep work session",
    description: "Finish the onboarding dashboard implementation.",
    date: new Date().toISOString().slice(0, 10),
    start_time: "11:00",
    end_time: "12:30",
    reminder: 0,
    priority: "medium",
    status: "pending",
  },
  {
    id: "activity-003",
    user_id: userId,
    title: "Review and wrap-up",
    description: "Check progress and plan tomorrow's priorities.",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    start_time: "16:00",
    end_time: "16:30",
    reminder: 1,
    priority: "low",
    status: "pending",
  },
];

for (const activity of sampleActivities) {
  activityInsert.run(
    activity.id,
    activity.user_id,
    activity.title,
    activity.description,
    activity.date,
    activity.start_time,
    activity.end_time,
    activity.reminder ? 1 : 0,
    activity.priority,
    activity.status,
    now,
    now
  );
}

db.close();

console.log("Seed data inserted successfully.");
