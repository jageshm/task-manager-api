import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Regular node-postgres connection for server environments
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Connect to the database
const client = postgres(connectionString);
export const db = drizzle(client);
