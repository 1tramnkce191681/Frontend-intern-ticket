import fs from "fs";
import path from "path";
import { Ticket, Comment } from "@/types";

const dbPath = path.join(process.cwd(), "db", "db.json");

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface TokenRecord {
  token: string;
  userId: string;
  expiresAt: string;
}

interface DbSchema {
  users?: User[];
  tokens?: TokenRecord[];
  tickets: Ticket[];
  comments: Record<string, Comment[]>;
}

/**
 * Read entire database from db.json
 */
export function readDb(): DbSchema {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading db.json:", error);
  }
  return { tickets: [], comments: {} };
}

/**
 * Write entire database to db.json
 */
export function writeDb(db: DbSchema): void {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
}

/**
 * Get all tickets
 */
export function getAllTickets(): Ticket[] {
  const db = readDb();
  return db.tickets;
}

/**
 * Get ticket by ID
 */
export function getTicketById(id: string): Ticket | null {
  const db = readDb();
  return db.tickets.find((t) => t.id === id) || null;
}

/**
 * Create new ticket
 */
export function createTicket(title: string, description: string): Ticket {
  const db = readDb();
  const newId = String(Math.max(...db.tickets.map(t => parseInt(t.id)), 0) + 1);
  
  const newTicket: Ticket = {
    id: newId,
    title,
    description,
    status: "Open",
    createdAt: new Date().toISOString(),
  };
  
  db.tickets.push(newTicket);
  writeDb(db);
  
  return newTicket;
}

/**
 * Update ticket status
 */
export function updateTicketStatus(id: string, status: Ticket["status"]): Ticket | null {
  const db = readDb();
  const ticketIndex = db.tickets.findIndex((t) => t.id === id);
  
  if (ticketIndex === -1) return null;
  
  db.tickets[ticketIndex].status = status;
  writeDb(db);
  
  return db.tickets[ticketIndex];
}

/**
 * Update ticket title and description
 */
export function updateTicket(id: string, data: { title?: string; description?: string }): Ticket | null {
  const db = readDb();
  const ticketIndex = db.tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) return null;

  db.tickets[ticketIndex] = { ...db.tickets[ticketIndex], ...data };
  writeDb(db);

  return db.tickets[ticketIndex];
}
/**
 * Get comments for a ticket
 */
export function getCommentsByTicketId(ticketId: string): Comment[] {
  const db = readDb();
  return db.comments[ticketId] || [];
}

/**
 * Add comment to a ticket
 */
export function addComment(ticketId: string, content: string): Comment {
  const db = readDb();
  
  if (!db.comments[ticketId]) {
    db.comments[ticketId] = [];
  }
  
  const newId = String(
    Math.max(...Object.values(db.comments).flat().map((c) => parseInt(c.id)), 0) + 1
  );
  
  const newComment: Comment = {
    id: newId,
    ticketId,
    content,
    createdAt: new Date().toISOString(),
  };
  
  db.comments[ticketId].push(newComment);
  writeDb(db);
  
  return newComment;
}

/**
 * Delete a ticket and its comments
 */
export function deleteTicket(id: string): boolean {
  const db = readDb();
  const initialLength = db.tickets.length;
  
  db.tickets = db.tickets.filter((t) => t.id !== id);
  
  if (db.tickets.length === initialLength) return false;

  // Clean up comments associated with this ticket
  delete db.comments[id];
  
  writeDb(db);
  
  return true;
}

/**
 * AUTH FUNCTIONS
 */

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | null {
  const db = readDb();
  return db.users?.find((u) => u.email === email) || null;
}

/**
 * Find user by ID
 */
export function findUserById(id: string): User | null {
  const db = readDb();
  return db.users?.find((u) => u.id === id) || null;
}

/**
 * Validate token
 */
export function validateToken(token: string): string | null {
  const db = readDb();
  const tokenRecord = db.tokens?.find((t) => t.token === token);
  
  if (!tokenRecord) return null;
  
  // Check if token is expired
  if (new Date(tokenRecord.expiresAt) < new Date()) {
    // Remove expired token
    db.tokens = db.tokens?.filter((t) => t.token !== token) || [];
    writeDb(db);
    return null;
  }
  
  return tokenRecord.userId;
}

/**
 * Save new token
 */
export function saveToken(userId: string, token: string): void {
  const db = readDb();
  
  if (!db.tokens) {
    db.tokens = [];
  }
  
  // Token expires in 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  db.tokens.push({
    token,
    userId,
    expiresAt,
  });
  
  writeDb(db);
}

/**
 * Remove token (logout)
 */
export function removeToken(token: string): void {
  const db = readDb();
  db.tokens = db.tokens?.filter((t) => t.token !== token) || [];
  writeDb(db);
}
