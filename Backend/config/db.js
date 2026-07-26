import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const ca = process.env.PG_ROOT_CERT_BASE64
    ? Buffer.from(process.env.PG_ROOT_CERT_BASE64, "base64").toString("utf-8")
    : null;

const sslConfig = ca
    ? { rejectUnauthorized: true, ca }
    : { rejectUnauthorized: false }; // 

const db = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: sslConfig
});

export default db;
