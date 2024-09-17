// eslint-disable-next-line @typescript-eslint/no-var-requires
const sqlite = require("sqlite3").verbose();

const database = new sqlite.Database(process.env.DATABASE_FILE);

database.exec(`
    CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY
    );
`);

database.exec(`
    CREATE TABLE IF NOT EXISTS Posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        datetime DATETIME,
        user_id TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
`);

database.exec(`
    CREATE TABLE IF NOT EXISTS Images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        link VARCHAR(255),
        FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
    );
`);

database.close((error) => {
    if (error) {
        console.error(error);
    }

    console.log("done");
});