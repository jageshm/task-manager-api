import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

// Connect to the database
const sql = neon(process.env.DATABASE_URL || "");
export const db = drizzle(sql);
