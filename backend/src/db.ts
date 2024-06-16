import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;

export function getPoolInstance(): Pool {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            max: 100, // Maximum number of connections
            // @ts-expect-error "expected"
            port: process.env.DB_PORT || 5432, // Default PostgreSQL port
        });
    }
    return pool;
}
