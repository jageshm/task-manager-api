
import { db } from '../server/db';
import { users, tasks1 } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create tasks table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        user_id INTEGER REFERENCES users(id) NOT NULL
      );
    `);

    console.log('Tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

main();
