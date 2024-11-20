"use server";
import sqlite from "sqlite3";

const database = new sqlite.Database(process.env.DATABASE_FILE!);

database.run("PRAGMA foreign_keys = ON", (error) => {
    if (error) {
        console.error(error);
    }
});

export async function get (
    query: string,
    params: unknown[]
) {
    return new Promise((resolve, reject) => {
        database.get(query, params, (error, row) => {
            if (error) {
                return reject(error);
            }

            resolve(row);
        });
    });
}

export async function all (
    query: string,
    params: unknown[]
) {
    return new Promise((resolve, reject) => {
        database.all(query, params, (error, rows) => {
            if (error) {
                return reject(error);
            }

            resolve(rows);
        });
    });
}

export async function run (
    query: string,
    params: unknown[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        database.run(query, params, (error) => {
            if (error) {
                return reject(error);
            }

            resolve();
        });
    });
}