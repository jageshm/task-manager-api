import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, Pool } from '@neondatabase/serverless';

// Connect to the database with pool configuration
const sql = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(sql);
