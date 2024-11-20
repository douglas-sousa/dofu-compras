"use server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function get (
    query: string,
    params: unknown[]
) {
    const client = await pool.connect();
    const { rows } = await client.query(query, params);

    client.release();

    return rows[0];
}

export async function all (
    query: string,
    params: unknown[]
) {
    const client = await pool.connect();
    const { rows } = await client.query(query, params);

    client.release();

    return rows;
}

export async function run (
    query: string,
    params: unknown[]
) {
    const client = await pool.connect();
    await client.query(query, params);

    client.release();
}