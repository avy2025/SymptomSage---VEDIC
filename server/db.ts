import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing. Please set it in your environment variables."
    );
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });
