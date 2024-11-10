import sqlite3 from "sqlite3";
import dotenv from 'dotenv'

dotenv.config()

// create a new database or open already existing database
const dbfile: string = process.env.DBFILE ? process.env.DBFILE : './db/default.db';
const db: sqlite3.Database = new sqlite3.Database(dbfile, (err: Error | null) => {
    if (err) {
        console.error(`Error creating or opening the Database: ${err.message}`);
        console.error(`Stack trace: ${err.stack}`);
        throw err;
    }
});

// create datatables if they don't already exist
const createTables: string =
    `   
    CREATE TABLE IF NOT EXISTS hero(
    hero_id INTEGER PRIMARY KEY NOT NULL,
    hero_name TEXT NOT NULL,
    is_xman TEXT NOT NULL,
    was_snapped TEXT NOT NULL);

    CREATE TABLE IF NOT EXISTS hero_power(
    hero_id INTEGER NOT NULL,
    hero_power text NOT NULL,
    FOREIGN KEY(hero_id) REFERENCES hero(hero_id));
    `

db.exec(createTables, (err: Error | null) => {
    if (err) {
        console.error(`Error creating tables: ${err.message}`);
        console.error(`Stack trace: ${err.stack}`);
        throw err;
    }
    else {
        console.log(`tables created successfully`);
    }
});

export default db;