import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing. Please set it in your environment variables."
    );
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool, { schema });
